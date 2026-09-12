import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, filter, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/interfaces/product';
import { Category } from '@core/interfaces/categories';
import { AuthService } from '@core/services/auth.service';
import { CartDrawerService } from '@core/services/cart-drawer.service';
import { CartService } from '@core/services/cart.service';
import { PurchaseHistoryService } from '@core/services/purchase-history.service';
import { UserFavoritesService } from '@core/services/user-favorites.service';
import { ToastService } from '@core/services/toast.service';
import {
  getStockState,
  getStockStateLabel,
} from '@core/utils/stock-state.util';

import { ProductGalleryComponent } from '@shared/molecules/product-gallery/product-gallery.component';
import { ProductCardComponent } from '@shared/molecules/product-card/product-card.component';
import { IconComponent } from '@shared/atoms/icon/icon.component';
import { ReviewFormComponent } from '@shared/organisms/review-form/review-form.component';
import { ReviewListComponent } from '@shared/organisms/review-list/review-list.component';
import { PurchaseInfoComponent } from '@shared/organisms/purchase-info/purchase-info.component';
import { ProductDescriptionComponent } from '@shared/organisms/product-description/product-description.component';
import { CommentRequest } from '@core/interfaces/comment';

type ProductDetailTab = 'ficha' | 'entrega' | 'opiniones';

interface ProductSpec {
  label: string;
  value: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    IconComponent,
    ProductGalleryComponent,
    ProductCardComponent,
    PurchaseInfoComponent,
    ProductDescriptionComponent,
    ReviewFormComponent,
    ReviewListComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private cartDrawerService = inject(CartDrawerService);
  private purchaseHistoryService = inject(PurchaseHistoryService);
  private userFavoritesService = inject(UserFavoritesService);
  private toastService = inject(ToastService);
  private readonly currentUsername =
    this.authService.currentSession()?.username ?? '';
  readonly stars = [1, 2, 3, 4, 5];
  reviewPermissionError = '';
  activeTab: ProductDetailTab = 'ficha';

  readonly favoriteIds$ = this.currentUsername
    ? this.userFavoritesService.getFavoriteIds$(this.currentUsername)
    : of([] as string[]);

  readonly categories$ = this.productService.getCategories();
  readonly products$ = this.productService.getProducts();

  readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => !!id),
    tap(() => {
      this.activeTab = 'ficha';
      this.reviewPermissionError = '';
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      }
    }),
    switchMap((id) => this.productService.getProductById(id)),
    filter((product): product is Product => !!product),
  );

  readonly viewModel$ = combineLatest([
    this.product$,
    this.favoriteIds$,
    this.categories$,
    this.products$,
  ]).pipe(
    map(([product, favoriteIds, categories, products]) => {
      const categoryName =
        categories.find((category: Category) => category._id === product.categoryId)
          ?.name ?? 'Sin categoría';
      const normalizedProduct = {
        ...product,
        _id: product._id ?? '',
        stock: product.stock ?? 0,
        technicalDescription: product.technicalDescription ?? '',
        images: product.images ?? [],
        comments: (product.comments ?? []).map((c) => ({
          author: c.author ?? 'Anónimo',
          rating: c.rating ?? 5,
          // Forzamos que sea siempre un string para cumplir con CommentRequest
          message: c.message ?? c.text ?? '',
          // Cumplimos con ProductComment
          text: c.text ?? c.message ?? '',
          // Convertimos a Date para cumplir con el contrato de CommentRequest
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
        })),
      };

      const stockState = getStockState(normalizedProduct.stock);
      const specs: ProductSpec[] = [
        { label: 'SKU', value: this.getSku(normalizedProduct._id) },
        { label: 'Categoría', value: categoryName },
        {
          label: 'Disponibilidad',
          value:
            stockState === 'out-of-stock'
              ? 'Agotado'
              : `${getStockStateLabel(stockState)} · ${normalizedProduct.stock} unidades`,
        },
      ];
      if (normalizedProduct.tags?.length) {
        specs.push({ label: 'Etiquetas', value: normalizedProduct.tags.join(', ') });
      }
      if (normalizedProduct.attributes?.sizes?.length) {
        specs.push({
          label: 'Tallas disponibles',
          value: normalizedProduct.attributes.sizes.join(', '),
        });
      }
      if (normalizedProduct.attributes?.colors?.length) {
        specs.push({
          label: 'Colores disponibles',
          value: normalizedProduct.attributes.colors.join(', '),
        });
      }

      const sameCategory = products.filter(
        (item) =>
          item.categoryId === product.categoryId && item._id !== product._id,
      );
      const otherCategory = products.filter(
        (item) =>
          item.categoryId !== product.categoryId && item._id !== product._id,
      );
      const relatedCandidates = [...sameCategory, ...otherCategory].slice(0, 3);

      const relatedSectionTitle =
        sameCategory.length >= 2
          ? `También en ${categoryName}`
          : 'Productos recomendados';

      const relatedProducts = relatedCandidates.map((item) => ({
        product: item,
        categoryName:
          categories.find((category) => category._id === item.categoryId)?.name ??
          'Producto',
      }));

      return {
        categoryName,
        product: normalizedProduct,
        ratingValue: Number(product.rating ?? 0),
        reviewCount: (product.comments ?? []).length,
        isFavorite: favoriteIds.includes(product._id),
        specs,
        relatedSectionTitle,
        relatedProducts,
      };
    }),
    shareReplay(1),
  );

  setActiveTab(tab: ProductDetailTab): void {
    this.activeTab = tab;
  }

  getSku(productId: string): string {
    if (!productId) {
      return 'N/D';
    }

    return productId.slice(-8).toUpperCase();
  }

  canReviewProduct(productId: string): boolean {
    return this.getReviewRestrictionMessage(productId) === '';
  }

  getReviewRestrictionMessage(productId: string): string {
    if (!this.authService.isLoggedIn('user')) {
      return 'Debes iniciar sesion con una cuenta de usuario para dejar una opinion.';
    }

    const username = this.authService.currentSession()?.username ?? '';
    const hasPurchased = this.purchaseHistoryService.hasPurchasedProduct(
      username,
      productId,
    );

    if (!hasPurchased) {
      return 'Solo puedes calificar productos que hayas comprado.';
    }

    return '';
  }

  submitComment(productId: string, commentData: CommentRequest): void {
    this.reviewPermissionError = '';

    const restriction = this.getReviewRestrictionMessage(productId);
    if (restriction) {
      this.reviewPermissionError = restriction;
      return;
    }

    if (!productId) {
      return;
    }

    this.productService.addComment(productId, commentData).subscribe({
      error: (err) => console.error('Error al publicar comentario:', err),
    });
  }

  toggleFavorite(productId: string): void {
    if (!this.currentUsername) {
      this.toastService.show(
        'Inicia sesion para agregar productos a favoritos.',
        'info',
      );
      return;
    }

    const added = this.userFavoritesService.toggle(
      this.currentUsername,
      productId,
    );
    this.toastService.show(
      added
        ? 'Producto agregado a favoritos.'
        : 'Producto eliminado de favoritos.',
      'success',
    );
  }

  addRelatedToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.toastService.show(`${product.name} agregado al carrito.`, 'success');
    this.cartDrawerService.open();
  }
}
