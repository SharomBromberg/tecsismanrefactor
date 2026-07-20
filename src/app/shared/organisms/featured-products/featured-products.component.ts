import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, map, shareReplay } from 'rxjs';
import { Product } from '@core/interfaces/product';
import { CartDrawerService } from '@core/services/cart-drawer.service';
import { CartService } from '@core/services/cart.service';
import { ProductService } from '@core/services/product.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { FeaturedProductCardComponent } from '../../molecules/featured-product-card/featured-product-card.component';

interface FeaturedProductCardVm {
  product: Product;
  categoryName: string;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    ButtonComponent,
    FeaturedProductCardComponent,
  ],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss'],
})
export class FeaturedProductsComponent implements AfterViewInit {
  @ViewChild('carouselTrack')
  private carouselTrack?: ElementRef<HTMLDivElement>;

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly cartDrawerService = inject(CartDrawerService);
  private readonly toastService = inject(ToastService);

  canScrollPrev = false;
  canScrollNext = false;

  readonly featuredCards$ = combineLatest([
    this.productService.getFeaturedProducts(),
    this.productService.getCategories(),
  ]).pipe(
    map(([products, categories]) =>
      products.slice(0, 4).map((product) => ({
        product,
        categoryName:
          categories.find((category) => category._id === product.categoryId)
            ?.name ?? 'Producto destacado',
      })),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.toastService.show(`${product.name} agregado al carrito.`, 'success');
    this.cartDrawerService.open();
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.updateCarouselState());
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCarouselState();
  }

  scrollCarousel(direction: -1 | 1): void {
    const track = this.carouselTrack?.nativeElement;
    if (!track) {
      return;
    }

    const firstSlide = track.querySelector<HTMLElement>(
      '.featured-products__slide',
    );
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
    const step = firstSlide ? firstSlide.offsetWidth + gap : track.clientWidth;

    track.scrollBy({
      left: step * direction,
      behavior: 'smooth',
    });
  }

  updateCarouselState(): void {
    const track = this.carouselTrack?.nativeElement;
    if (!track) {
      return;
    }

    const maxScrollLeft = Math.max(track.scrollWidth - track.clientWidth, 0);
    const tolerance = 8;

    this.canScrollPrev = track.scrollLeft > tolerance;
    this.canScrollNext = track.scrollLeft < maxScrollLeft - tolerance;
  }

  trackByProductId(index: number, item: FeaturedProductCardVm): string {
    return item.product._id ?? `${index}`;
  }
}
