import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, of } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { UserProfileService } from '@core/services/user-profile.service';
import { ProductService } from '@core/services/product.service';
import { UserFavoritesService } from '@core/services/user-favorites.service';
import { OrderService } from '@core/services/order.service';
import { CartService } from '@core/services/cart.service';
import { CartDrawerService } from '@core/services/cart-drawer.service';
import { ToastService } from '@core/services/toast.service';
import { ShippingAddress } from '@core/interfaces/user-profile';
import { Order, OrderStatus } from '@core/interfaces/order';
import { Product } from '@core/interfaces/product';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { IconComponent } from '@shared/atoms/icon/icon.component';
import { RatingStarsComponent } from '@shared/molecules/rating-star/rating-stars.component';

export interface EnrichedOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
  product?: Product;
}

export interface EnrichedOrder extends Order {
  enrichedItems: EnrichedOrderItem[];
}

export interface FavoriteItemVm {
  productId: string;
  name: string;
  image: string;
  price: number;
  categoryName: string;
  product: Product;
}

export type FavoriteSort = 'recent' | 'price-asc' | 'price-desc';

export type AccountSection =
  | 'history'
  | 'favorites'
  | 'profile'
  | 'addresses'
  | 'security';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly userFavoritesService = inject(UserFavoritesService);
  private readonly cartService = inject(CartService);
  private readonly cartDrawerService = inject(CartDrawerService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  private readonly fb = new FormBuilder();
  private readonly session = this.authService.currentSession();
  readonly username = this.session?.username ?? '';

  activeSection: AccountSection = 'history';
  profileEditMode = false;
  addressEditMode = false;
  securityEditMode = false;
  editingAddressId: string | null = null;
  addresses: ShippingAddress[] = [];

  profileSavedMessage = '';
  profileErrorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';
  addressSuccessMessage = '';
  addressErrorMessage = '';

  readonly profileForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  readonly addressForm = this.fb.nonNullable.group({
    label: ['', [Validators.required]],
    recipient: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    city: ['', [Validators.required]],
    addressLine: ['', [Validators.required, Validators.minLength(6)]],
    reference: [''],
  });

  readonly favoriteSort$ = new BehaviorSubject<FavoriteSort>('recent');

  readonly userOrders$;
  readonly favoritesVm$;
  readonly favoritesCount$;
  readonly stats$;

  constructor() {
    if (!this.username) {
      this.userOrders$ = of([] as EnrichedOrder[]);
      this.favoritesVm$ = of([] as FavoriteItemVm[]);
      this.favoritesCount$ = of(0);
      this.stats$ = of({ totalOrders: 0, totalSpent: 0, favoritesCount: 0 });
      return;
    }

    const profile = this.userProfileService.getProfile(
      this.username,
      this.session?.displayName ?? 'Usuario',
    );
    this.profileForm.patchValue(profile);
    this.addresses = this.userProfileService.getAddresses(this.username);

    // Enriched user orders with real product images and metadata
    this.userOrders$ = combineLatest([
      this.orderService.orders$,
      this.productService.getProducts(),
    ]).pipe(
      map(([orders, products]) => {
        const userOrders = orders.filter(
          (o) =>
            o.username === this.username ||
            o.customerDisplayName === this.displayName ||
            o.username === 'guest',
        );

        return userOrders.map((order) => {
          const enrichedItems: EnrichedOrderItem[] = order.items.map((item) => {
            const product = products.find(
              (p) => p._id === item.productId || p.name === item.name,
            );
            return {
              ...item,
              image: product?.images?.[0] || 'assets/pictures/placeholder.png',
              product,
            };
          });

          return {
            ...order,
            enrichedItems,
          } as EnrichedOrder;
        });
      }),
    );

    // Favorites view model
    this.favoritesVm$ = combineLatest([
      this.userFavoritesService.getFavoriteIds$(this.username),
      this.productService.getProducts(),
      this.productService.getCategories(),
      this.favoriteSort$,
    ]).pipe(
      map(([favoriteIds, products, categories, sort]) => {
        const mapped: FavoriteItemVm[] = favoriteIds
          .map((id) => {
            const product = products.find((p) => p._id === id);
            if (!product) return null;
            const categoryName =
              categories.find((c) => c._id === product.categoryId)?.name ||
              product.categoryId ||
              'Tecnología';
            return {
              productId: product._id,
              name: product.name,
              image: product.images?.[0] || 'assets/pictures/placeholder.png',
              price: product.price,
              categoryName,
              product,
            };
          })
          .filter((item): item is FavoriteItemVm => item !== null);

        if (sort === 'price-asc') {
          return [...mapped].sort((a, b) => a.price - b.price);
        }
        if (sort === 'price-desc') {
          return [...mapped].sort((a, b) => b.price - a.price);
        }
        return [...mapped].reverse();
      }),
    );

    this.favoritesCount$ = this.favoritesVm$.pipe(map((favs) => favs.length));

    // Combined summary statistics
    this.stats$ = combineLatest([this.userOrders$, this.favoritesCount$]).pipe(
      map(([orders, favoritesCount]) => ({
        totalOrders: orders.length,
        totalSpent: orders.reduce((acc, o) => acc + o.total, 0),
        favoritesCount,
      })),
    );
  }

  ngOnInit(): void {
    if (!this.session) {
      this.router.navigate(['/login']);
    }
  }

  get displayName(): string {
    return this.authService.currentSession()?.displayName ?? 'Usuario';
  }

  get email(): string {
    return (
      this.profileForm.controls.email.value ||
      this.session?.username ||
      'usuario@tecsisman.com'
    );
  }

  setSection(section: AccountSection): void {
    this.activeSection = section;
    this.profileEditMode = false;
    this.addressEditMode = false;
    this.securityEditMode = false;
  }

  setFavoriteSort(sort: FavoriteSort): void {
    this.favoriteSort$.next(sort);
  }

  // Actions on Orders
  reorder(order: EnrichedOrder): void {
    let addedCount = 0;
    order.enrichedItems.forEach((item) => {
      if (item.product) {
        this.cartService.addToCart(item.product, item.quantity);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      this.toastService.show(
        `Se agregaron ${addedCount} productos de tu pedido al carrito.`,
        'success',
      );
      this.cartDrawerService.open();
    } else {
      this.toastService.show(
        'Los productos de este pedido no están disponibles actualmente.',
        'info',
      );
    }
  }

  contactWhatsAppOrder(order: EnrichedOrder): void {
    const lines = [
      `*Consulta de Pedido — Tecsisman*`,
      `Número de Pedido: *#${order.id}*`,
      `Cliente: ${this.displayName}`,
      `Total: $ ${order.total.toLocaleString('es-CO')}`,
      `Estado actual: ${this.getStatusLabel(order.status)}`,
      '',
      'Hola, quisiera recibir información sobre el estado de mi despacho y entrega.',
    ];
    const text = lines.join('\n');
    window.open(
      `https://wa.me/573163202647?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'Pendiente de confirmación';
      case 'paid':
        return 'Pago confirmado / En alistamiento';
      case 'shipped':
        return 'En camino / Despachado';
      case 'delivered':
        return 'Entregado con éxito';
      case 'refunded':
        return 'Reembolsado';
      default:
        return 'En proceso';
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'status-badge--pending';
      case 'paid':
        return 'status-badge--paid';
      case 'shipped':
        return 'status-badge--shipped';
      case 'delivered':
        return 'status-badge--delivered';
      case 'refunded':
        return 'status-badge--refunded';
      default:
        return 'status-badge--default';
    }
  }

  // Favorite actions
  addFavoriteToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.toastService.show(`${product.name} agregado al carrito.`, 'success');
    this.cartDrawerService.open();
  }

  removeFavorite(productId: string): void {
    if (!this.username) return;
    this.userFavoritesService.remove(this.username, productId);
    this.toastService.show('Producto eliminado de tus favoritos.', 'info');
  }

  // Profile actions
  saveProfile(): void {
    this.profileSavedMessage = '';
    this.profileErrorMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.profileErrorMessage = 'Por favor completa los datos requeridos.';
      return;
    }

    if (!this.username) return;

    const payload = this.profileForm.getRawValue();
    this.userProfileService.saveProfile(this.username, {
      displayName: payload.displayName,
      email: payload.email,
      phone: payload.phone,
    });
    this.authService.updateSessionDisplayName(payload.displayName);

    this.profileSavedMessage = 'Datos de perfil actualizados con éxito.';
    this.toastService.show('Perfil actualizado correctamente.', 'success');
    this.profileEditMode = false;
  }

  // Address actions
  saveAddress(): void {
    this.addressSuccessMessage = '';
    this.addressErrorMessage = '';

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.addressErrorMessage = 'Por favor revisa los campos de la dirección.';
      return;
    }

    if (!this.username) return;

    const payload = this.addressForm.getRawValue();

    if (this.editingAddressId) {
      this.addresses = this.addresses.map((item) =>
        item.id === this.editingAddressId
          ? {
              ...item,
              label: payload.label,
              recipient: payload.recipient,
              phone: payload.phone,
              city: payload.city,
              addressLine: payload.addressLine,
              reference: payload.reference,
            }
          : item,
      );
      this.userProfileService.saveAddresses(this.username, this.addresses);
      this.addressForm.reset();
      this.editingAddressId = null;
      this.addressSuccessMessage = 'Dirección actualizada con éxito.';
      this.toastService.show('Dirección actualizada con éxito.', 'success');
      this.addressEditMode = false;
      return;
    }

    const newAddress: ShippingAddress = {
      id: `${Date.now()}`,
      label: payload.label,
      recipient: payload.recipient,
      phone: payload.phone,
      city: payload.city,
      addressLine: payload.addressLine,
      reference: payload.reference,
      isDefault: this.addresses.length === 0,
    };

    this.addresses = [...this.addresses, newAddress];
    this.userProfileService.saveAddresses(this.username, this.addresses);
    this.addressForm.reset();
    this.addressSuccessMessage = 'Dirección guardada con éxito.';
    this.toastService.show('Dirección agregada con éxito.', 'success');
    this.addressEditMode = false;
  }

  editAddress(addressId: string): void {
    const address = this.addresses.find((item) => item.id === addressId);
    if (!address) return;

    this.addressEditMode = true;
    this.editingAddressId = address.id;
    this.addressSuccessMessage = '';
    this.addressErrorMessage = '';
    this.addressForm.patchValue({
      label: address.label,
      recipient: address.recipient,
      phone: address.phone,
      city: address.city,
      addressLine: address.addressLine,
      reference: address.reference ?? '',
    });
  }

  deleteAddress(addressId: string): void {
    this.addresses = this.addresses.filter((item) => item.id !== addressId);
    this.userProfileService.saveAddresses(this.username, this.addresses);
    this.toastService.show('Dirección eliminada.', 'info');
  }

  setDefaultAddress(addressId: string): void {
    this.addresses = this.addresses.map((item) => ({
      ...item,
      isDefault: item.id === addressId,
    }));
    this.userProfileService.saveAddresses(this.username, this.addresses);
    this.toastService.show('Dirección principal actualizada.', 'success');
  }

  cancelAddressEdit(): void {
    this.addressEditMode = false;
    this.editingAddressId = null;
    this.addressForm.reset();
  }

  // Password actions
  changePassword(): void {
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordErrorMessage = 'Por favor completa todos los campos.';
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.passwordErrorMessage = 'Las nuevas contraseñas no coinciden.';
      return;
    }

    const ok = this.authService.changePassword(currentPassword, newPassword);
    if (!ok) {
      this.passwordErrorMessage = 'La contraseña actual no es correcta.';
      return;
    }

    this.passwordSuccessMessage = 'Contraseña actualizada correctamente.';
    this.toastService.show('Contraseña actualizada con éxito.', 'success');
    this.passwordForm.reset();
    this.securityEditMode = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/Inicio']);
  }
}
