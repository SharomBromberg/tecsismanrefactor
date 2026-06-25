import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Product, ProductComment } from 'src/app/core/interfaces/product';

import { ProductGalleryComponent } from '../../molecules/product-gallery/product-gallery.component';
import { ReviewFormComponent } from '../../organisms/review-form/review-form.component';
import { ReviewListComponent } from '../../organisms/review-list/review-list.component';
import { PurchaseInfoComponent } from '../../organisms/purchase-info/purchase-info.component';
import { ProductDescriptionComponent } from '../../organisms/product-description/product-description.component';
import { CommentRequest } from 'src/app/core/interfaces/comment';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CurrencyPipe,
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

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => !!id),
    switchMap((id) => this.productService.getProductById(id)),
    filter((product): product is Product => !!product),
    map((product) => ({
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
    })),
    shareReplay(1),
  );

  submitComment(productId: string, commentData: CommentRequest): void {
    if (productId) {
      this.productService.addComment(productId, commentData).subscribe({
        error: (err) => console.error('Error al publicar comentario:', err),
      });
    }
  }
}
