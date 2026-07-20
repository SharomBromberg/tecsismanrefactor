import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, filter, map, of, shareReplay, switchMap } from 'rxjs';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/interfaces/product';
import { AuthService } from '@core/services/auth.service';
import { PurchaseHistoryService } from '@core/services/purchase-history.service';
import { UserFavoritesService } from '@core/services/user-favorites.service';
import { ToastService } from '@core/services/toast.service';

import { ProductGalleryComponent } from '@shared/molecules/product-gallery/product-gallery.component';
import { IconComponent } from '@shared/atoms/icon/icon.component';
import { ReviewFormComponent } from '@shared/organisms/review-form/review-form.component';
import { ReviewListComponent } from '@shared/organisms/review-list/review-list.component';
import { PurchaseInfoComponent } from '@shared/organisms/purchase-info/purchase-info.component';
import { ProductDescriptionComponent } from '@shared/organisms/product-description/product-description.component';
import { CommentRequest } from '@core/interfaces/comment';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    IconComponent,
    ProductGalleryComponent,
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
  private purchaseHistoryService = inject(PurchaseHistoryService);
  private userFavoritesService = inject(UserFavoritesService);
  private toastService = inject(ToastService);
  private readonly currentUsername =
    this.authService.currentSession()?.username ?? '';
  readonly stars = [1, 2, 3, 4, 5];
  reviewPermissionError = '';

  readonly favoriteIds$ = this.currentUsername
    ? this.userFavoritesService.getFavoriteIds$(this.currentUsername)
    : of([] as string[]);

  readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => !!id),
    switchMap((id) => this.productService.getProductById(id)),
    filter((product): product is Product => !!product),
  );

  readonly viewModel$ = combineLatest([this.product$, this.favoriteIds$]).pipe(
    map(([product, favoriteIds]) => ({
      product: {
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
      },
      ratingValue: Number(product.rating ?? 0),
      reviewCount: (product.comments ?? []).length,
      isFavorite: favoriteIds.includes(product._id),
    })),
    shareReplay(1),
  );

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
}
