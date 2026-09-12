import { Component, computed, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from '@shared/organisms/page-header/page-header.component';
import { SearchBoxComponent } from '@shared/molecules/search-box/search-box.component';
import { RatingStarsComponent } from '@shared/molecules/rating-star/rating-stars.component';
import { ProductCardComponent } from '@shared/molecules/product-card/product-card.component';
import { CATEGORIES, PRODUCTS } from '@core/constants/products.constants';
import { Product } from '@core/interfaces/product';
import { CartService } from '@core/services/cart.service';
import { CartDrawerService } from '@core/services/cart-drawer.service';
import { ToastService } from '@core/services/toast.service';

type SortKey = 'featured' | 'rating' | 'price-asc' | 'price-desc' | 'name-asc';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    SearchBoxComponent,
    RatingStarsComponent,
    ProductCardComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private readonly cartService = inject(CartService);
  private readonly cartDrawerService = inject(CartDrawerService);
  private readonly toastService = inject(ToastService);

  readonly categories = CATEGORIES;
  readonly maxPrice: number = Math.max(...PRODUCTS.map((p: Product) => p.price));

  searchControl = new FormControl<string>('', { nonNullable: true });
  expandedCats = signal<string[]>(this.categories.map((c) => c.id));
  activeSubs = signal<string[]>([]);
  priceMax = signal<number>(this.maxPrice);
  minRating = signal(0);
  inStockOnly = signal(false);
  sort = signal<SortKey>('featured');
  filtersOpen = signal(false);

  currentPage = signal(1);
  pageSize = signal(8);

  constructor() {
    effect(
      () => {
        // Whenever the filtered list changes, reset to page 1
        this.filtered();
        this.currentPage.set(1);
      },
      { allowSignalWrites: true },
    );
  }

  filtered = computed<Product[]>(() => {
    const q = this.searchControl.value.trim().toLowerCase();
    const subs = this.activeSubs();
    let list = PRODUCTS.filter((p: Product) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      )
        return false;
      if (subs.length && !subs.includes(p.subcategoryId ?? '')) return false;
      if (p.price > this.priceMax()) return false;
      if (this.inStockOnly() && (p.stock ?? 0) <= 0) return false;
      if (this.minRating() && p.rating < this.minRating()) return false;
      return true;
    });

    switch (this.sort()) {
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(!!b.featured) - Number(!!a.featured),
        );
    }
    return list;
  });

  paginatedProducts = computed<Product[]>(() => {
    const list = this.filtered();
    const start = (this.currentPage() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  totalPages = computed<number>(() => {
    return Math.max(1, Math.ceil(this.filtered().length / this.pageSize()));
  });

  pagesArray = computed<number[]>(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.toastService.show(`${product.name} agregado al pedido.`, 'success');
    this.cartDrawerService.open();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  activeChips = computed<{ key: string; label: string; clear: () => void }[]>(
    () => {
      const chips: { key: string; label: string; clear: () => void }[] = [];
      for (const c of this.categories) {
        for (const s of c.subcategories) {
          if (this.activeSubs().includes(s.id)) {
            chips.push({
              key: 'sub-' + s.id,
              label: s.name,
              clear: () => this.toggleSub(s.id),
            });
          }
        }
      }
      if (this.priceMax() < this.maxPrice) {
        chips.push({
          key: 'price',
          label: `Hasta ${this.money(this.priceMax())}`,
          clear: () => this.priceMax.set(this.maxPrice),
        });
      }
      if (this.inStockOnly()) {
        chips.push({
          key: 'stock',
          label: 'Solo en stock',
          clear: () => this.inStockOnly.set(false),
        });
      }
      if (this.minRating()) {
        chips.push({
          key: 'rating',
          label: `${this.minRating()}★ y más`,
          clear: () => this.minRating.set(0),
        });
      }
      return chips;
    },
  );

  money(v: number): string {
    return v.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    });
  }

  toggleExpand(catId: string): void {
    this.expandedCats.update((prev: string[]) =>
      prev.includes(catId)
        ? prev.filter((x: string) => x !== catId)
        : [...prev, catId],
    );
  }

  toggleSub(subId: string): void {
    this.activeSubs.update((prev: string[]) =>
      prev.includes(subId)
        ? prev.filter((x: string) => x !== subId)
        : [...prev, subId],
    );
  }

  toggleCategoryAll(catId: string): void {
    const cat = this.categories.find((c) => c.id === catId);
    if (!cat) return;
    const ids = cat.subcategories.map((s) => s.id);
    const allOn = ids.every((id: string) => this.activeSubs().includes(id));
    this.activeSubs.update((prev: string[]) =>
      allOn
        ? prev.filter((id: string) => !ids.includes(id))
        : [...new Set([...prev, ...ids])],
    );
  }

  isCategoryChecked(catId: string): boolean {
    const cat = this.categories.find((c) => c.id === catId);
    if (!cat) return false;
    return cat.subcategories.every((s) => this.activeSubs().includes(s.id));
  }

  isCategoryIndeterminate(catId: string): boolean {
    const cat = this.categories.find((c) => c.id === catId);
    if (!cat) return false;
    const some = cat.subcategories.some((s) =>
      this.activeSubs().includes(s.id),
    );
    return some && !this.isCategoryChecked(catId);
  }

  subCount(subId: string): number {
    return PRODUCTS.filter((p: Product) => p.subcategoryId === subId).length;
  }

  clearAll(): void {
    this.searchControl.setValue('');
    this.activeSubs.set([]);
    this.priceMax.set(this.maxPrice);
    this.inStockOnly.set(false);
    this.minRating.set(0);
  }

  categoryLabel(catId: string): string {
    return this.categories.find((c) => c.id === catId)?.name ?? '';
  }
}