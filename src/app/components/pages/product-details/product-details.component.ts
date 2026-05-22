import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, ElementRef, viewChild, viewChildren, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { RatingStarsPipe } from 'src/app/core/pipes/rating-stars.pipe';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [  FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    RatingStarsPipe 
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  selectedImageIndex = 0;
  readonly whatsappNumber = '573000000000'; // Número de prueba para WhatsApp

  readonly categories$ = this.productService.getCategories().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => Boolean(id)),
    switchMap((id) => this.productService.getProductById(id)),
    filter((product): product is Product => Boolean(product)),
    tap(() => {
      this.selectedImageIndex = 0;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly viewModel$ = this.product$.pipe(
    switchMap((product) =>
      this.categories$.pipe(
        map((categories) => ({
          product,
          categoryName: categories.find((category) => category._id === product.categoryId)?.name ?? 'Sin categoria',
        })),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly commentForm = this.fb.nonNullable.group({
    author: ['', [Validators.required, Validators.minLength(2)]],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  carouselContainer = viewChild<ElementRef<HTMLElement>>('carouselContainer');
  thumbnailButtons = viewChildren<ElementRef<HTMLElement>>('thumbnailBtn');

  ngOnInit(): void {}

  openWhatsApp(productName: string): void {
    const message = `Hola, me interesa el producto ${productName}`;
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  selectImage(index: number): void {
    this.scrollToImage(index);
  }

  scrollToImage(index: number): void {
    this.selectedImageIndex = index;
    this.cdr.markForCheck(); // Fuerza el repintado OnPush
    const container = this.carouselContainer()?.nativeElement;
    if (container) {
      const targetScrollLeft = container.clientWidth * index;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  }

  onCarouselScroll(event: Event): void {
    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (this.selectedImageIndex !== newIndex) {
        this.selectedImageIndex = newIndex;
        this.cdr.markForCheck();
        
        // Auto-scroll del bloque de thumbnails para seguir la imagen
        const thumbBtn = this.thumbnailButtons()[newIndex]?.nativeElement;
        if (thumbBtn) {
          thumbBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  }

  submitComment(product: Product): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.productService
      .addComment(product._id, this.commentForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.commentForm.reset({ author: '', rating: 5, message: '' });
        },
        error: (err) => {
          console.error('Failed to add comment:', err);
        },
        complete: () => {
          // Lógica opcional a ejecutar cuando el flujo finaliza correctamente
        }
      });
  }

  trackByComment(index: number): number {
    return index;
  }
}
