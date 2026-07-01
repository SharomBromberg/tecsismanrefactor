import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  ShippingAddress,
  UserProfileService,
} from 'src/app/core/services/user-profile.service';
import {
  PurchaseEntry,
  PurchaseHistoryService,
} from 'src/app/core/services/purchase-history.service';
import { ProductService } from 'src/app/core/services/product.service';
import { UserFavoritesService } from 'src/app/core/services/user-favorites.service';
import { AccountSidebarComponent } from '../../../../shared/organisms/account-sidebar/account-sidebar.component';

interface PurchaseHistoryItemVm {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  purchasedAt: string;
  unitPrice: number;
  total: number;
}

interface UserPanelVm {
  items: PurchaseHistoryItemVm[];
  totalOrders: number;
  totalSpent: number;
}

interface FavoriteItemVm {
  productId: string;
  name: string;
  image: string;
  price: number;
}

type FavoriteSort = 'recent' | 'price-asc' | 'price-desc';

type AccountSection =
  | 'profile'
  | 'addresses'
  | 'security'
  | 'favorites'
  | 'history';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    AccountSidebarComponent,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  private readonly fb = new FormBuilder();
  private readonly session = this.authService.currentSession();
  private readonly username = this.session?.username ?? '';

  activeSection: AccountSection = 'profile';
  accountMenuOpen = false;
  isMobileViewport = false;
  hasMobileSelection = false;
  profileEditMode = false;
  addressEditMode = false;
  securityEditMode = false;
  private hasInitializedViewportState = false;

  profileSavedMessage = '';
  profileErrorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';
  addressSuccessMessage = '';
  addressErrorMessage = '';
  editingAddressId: string | null = null;
  addresses: ShippingAddress[] = [];

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

  readonly panelVm$;
  readonly favoritesVm$;
  readonly favoritesCount$;
  readonly favoriteSort$ = new BehaviorSubject<FavoriteSort>('recent');

  constructor(
    private readonly authService: AuthService,
    private readonly userProfileService: UserProfileService,
    private readonly purchaseHistoryService: PurchaseHistoryService,
    private readonly productService: ProductService,
    private readonly userFavoritesService: UserFavoritesService,
    private readonly router: Router,
  ) {
    this.syncViewportState();

    if (!this.username) {
      this.panelVm$ = of({ items: [], totalOrders: 0, totalSpent: 0 });
      this.favoritesVm$ = of([] as FavoriteItemVm[]);
      this.favoritesCount$ = of(0);
      return;
    }

    const profile = this.userProfileService.getProfile(
      this.username,
      this.session?.displayName ?? 'Usuario',
    );
    this.profileForm.patchValue(profile);
    this.addresses = this.userProfileService.getAddresses(this.username);

    this.panelVm$ = combineLatest([
      this.purchaseHistoryService.getUserPurchases$(this.username),
      this.productService.getProducts(),
    ]).pipe(
      map(([entries, products]) => {
        const mappedItems = entries.map((entry: PurchaseEntry) => {
          const product = products.find((p) => p._id === entry.productId);
          const unitPrice = product?.price ?? 0;

          return {
            productId: entry.productId,
            productName: product?.name ?? 'Producto no disponible',
            image: product?.images?.[0] ?? 'assets/pictures/placeholder.png',
            quantity: entry.quantity,
            purchasedAt: entry.purchasedAt,
            unitPrice,
            total: unitPrice * entry.quantity,
          } as PurchaseHistoryItemVm;
        });

        return {
          items: mappedItems,
          totalOrders: mappedItems.length,
          totalSpent: mappedItems.reduce((acc, item) => acc + item.total, 0),
        } as UserPanelVm;
      }),
    );

    this.favoritesVm$ = combineLatest([
      this.userFavoritesService.getFavoriteIds$(this.username),
      this.productService.getProducts(),
      this.favoriteSort$,
    ]).pipe(
      map(([favoriteIds, products, favoriteSort]) => {
        const mapped = favoriteIds
          .map((id) => {
            const product = products.find((item) => item._id === id);
            if (!product) {
              return null;
            }

            return {
              productId: product._id,
              name: product.name,
              image: product.images?.[0] ?? 'assets/pictures/placeholder.png',
              price: product.price,
            } as FavoriteItemVm;
          })
          .filter((item): item is FavoriteItemVm => !!item);

        if (favoriteSort === 'price-asc') {
          return [...mapped].sort((a, b) => a.price - b.price);
        }

        if (favoriteSort === 'price-desc') {
          return [...mapped].sort((a, b) => b.price - a.price);
        }

        // "recent" respeta el orden de alta en favoritos (más reciente al final), por eso lo invertimos.
        return [...mapped].reverse();
      }),
    );

    this.favoritesCount$ = this.favoritesVm$.pipe(
      map((favorites) => favorites.length),
    );
  }

  get displayName(): string {
    return this.authService.currentSession()?.displayName ?? 'Usuario';
  }

  get sectionTitle(): string {
    switch (this.activeSection) {
      case 'profile':
        return 'Informacion de perfil';
      case 'addresses':
        return 'Direcciones';
      case 'security':
        return 'Seguridad';
      case 'favorites':
        return 'Favoritos';
      case 'history':
        return 'Compras';
      default:
        return 'Mi cuenta';
    }
  }

  get shouldShowContent(): boolean {
    return !this.isMobileViewport || this.hasMobileSelection;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncViewportState();
  }

  toggleAccountMenu(): void {
    if (this.isMobileViewport) {
      // Mobile-first flow: keep menu visible until the user selects a section.
      if (this.accountMenuOpen && !this.hasMobileSelection) {
        return;
      }

      const nextMenuState = !this.accountMenuOpen;
      this.accountMenuOpen = nextMenuState;

      if (nextMenuState) {
        this.hasMobileSelection = false;
        this.profileEditMode = false;
        this.addressEditMode = false;
        this.securityEditMode = false;
      }

      return;
    }

    this.accountMenuOpen = !this.accountMenuOpen;
  }

  showMobileMenu(): void {
    if (!this.isMobileViewport) {
      return;
    }

    this.accountMenuOpen = true;
    this.hasMobileSelection = false;
    this.profileEditMode = false;
    this.addressEditMode = false;
    this.securityEditMode = false;
  }

  setSection(section: AccountSection): void {
    this.activeSection = section;

    if (this.isMobileViewport) {
      this.hasMobileSelection = true;
      this.accountMenuOpen = false;
    }

    this.profileEditMode = false;
    this.addressEditMode = false;
    this.securityEditMode = false;
  }

  onSectionSelected(section: string): void {
    this.setSection(section as AccountSection);
  }

  setFavoriteSort(sort: FavoriteSort): void {
    this.favoriteSort$.next(sort);
  }

  saveProfile(): void {
    this.profileSavedMessage = '';
    this.profileErrorMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.profileErrorMessage =
        'Revisa los datos del perfil antes de guardar.';
      return;
    }

    if (!this.username) {
      this.profileErrorMessage =
        'No encontramos tu sesion. Inicia sesion nuevamente.';
      return;
    }

    const payload = this.profileForm.getRawValue();
    this.userProfileService.saveProfile(this.username, {
      displayName: payload.displayName,
      email: payload.email,
      phone: payload.phone,
    });
    this.authService.updateSessionDisplayName(payload.displayName);

    this.profileSavedMessage = 'Perfil actualizado correctamente.';
    this.profileEditMode = false;
  }

  saveAddress(): void {
    this.addressSuccessMessage = '';
    this.addressErrorMessage = '';

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.addressErrorMessage = 'Revisa los datos de direccion.';
      return;
    }

    if (!this.username) {
      this.addressErrorMessage =
        'No encontramos tu sesion. Inicia sesion nuevamente.';
      return;
    }

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
      this.addressSuccessMessage = 'Direccion actualizada correctamente.';
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
    this.addressSuccessMessage = 'Direccion guardada correctamente.';
    this.addressEditMode = false;
  }

  editAddress(addressId: string): void {
    const address = this.addresses.find((item) => item.id === addressId);
    if (!address) {
      return;
    }

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

  cancelAddressEdit(): void {
    this.addressEditMode = false;
    this.editingAddressId = null;
    this.addressForm.reset();
    this.addressSuccessMessage = '';
    this.addressErrorMessage = '';
  }

  removeAddress(addressId: string): void {
    if (!this.username) {
      return;
    }

    const next = this.addresses.filter((item) => item.id !== addressId);
    if (next.length > 0 && !next.some((item) => item.isDefault)) {
      next[0] = { ...next[0], isDefault: true };
    }

    this.addresses = next;
    this.userProfileService.saveAddresses(this.username, this.addresses);

    if (this.editingAddressId === addressId) {
      this.cancelAddressEdit();
    }
  }

  setDefaultAddress(addressId: string): void {
    if (!this.username) {
      return;
    }

    this.addresses = this.addresses.map((item) => ({
      ...item,
      isDefault: item.id === addressId,
    }));
    this.userProfileService.saveAddresses(this.username, this.addresses);
  }

  savePassword(): void {
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordErrorMessage =
        'Completa los campos para cambiar la contraseña.';
      return;
    }

    const payload = this.passwordForm.getRawValue();
    if (payload.newPassword !== payload.confirmPassword) {
      this.passwordErrorMessage = 'La confirmacion no coincide.';
      return;
    }

    const result = this.authService.changeCurrentUserPassword(
      payload.currentPassword,
      payload.newPassword,
    );

    if (!result.ok) {
      this.passwordErrorMessage =
        result.message ?? 'No fue posible actualizar la contraseña.';
      return;
    }

    this.passwordSuccessMessage = 'Contraseña actualizada correctamente.';
    this.passwordForm.reset();
    this.securityEditMode = false;
  }

  removeFavorite(productId: string): void {
    if (!this.username) {
      return;
    }

    this.userFavoritesService.toggle(this.username, productId);
  }

  logoutUser(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  private syncViewportState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const wasMobileViewport = this.isMobileViewport;
    const nextIsMobile = window.innerWidth <= 1024;
    this.isMobileViewport = nextIsMobile;

    if (!this.hasInitializedViewportState) {
      this.accountMenuOpen = !nextIsMobile;
      this.hasMobileSelection = !nextIsMobile;
      this.hasInitializedViewportState = true;
      return;
    }

    if (nextIsMobile && !wasMobileViewport) {
      this.accountMenuOpen = true;
      this.hasMobileSelection = false;
    }

    if (!nextIsMobile && wasMobileViewport) {
      this.accountMenuOpen = true;
      this.hasMobileSelection = true;
    }
  }
}
