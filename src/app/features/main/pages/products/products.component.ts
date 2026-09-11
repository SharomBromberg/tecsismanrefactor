import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from '@shared/organisms/page-header/page-header.component';
import { SearchBoxComponent } from '@shared/molecules/search-box/search-box.component';
import { RatingStarsComponent } from '@shared/molecules/rating-star/rating-stars.component';
import { ProductCardComponent } from '@shared/molecules/product-card/product-card.component';
import { CATEGORIES, PRODUCTS } from '@core/constants/products.constants';
import { Product } from '@core/interfaces/product';

type SortKey = 'featured' | 'rating' | 'price-asc' | 'price-desc' | 'name-asc';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, SearchBoxComponent, RatingStarsComponent, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
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

  filtered = computed<Product[]>(() => {
    const q = this.searchControl.value.trim().toLowerCase();
    const subs = this.activeSubs();
    let list = PRODUCTS.filter((p: Product) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      if (subs.length && !subs.includes(p.subcategoryId ?? '')) return false;
      if (p.price > this.priceMax()) return false;
      if (this.inStockOnly() && (p.stock ?? 0) <= 0) return false;
      if (this.minRating() && p.rating < this.minRating()) return false;
      return true;
    });

    switch (this.sort()) {
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'name-asc': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  });

  activeChips = computed<{ key: string; label: string; clear: () => void }[]>(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    for (const c of this.categories) {
      for (const s of c.subcategories) {
        if (this.activeSubs().includes(s.id)) {
          chips.push({ key: 'sub-' + s.id, label: s.name, clear: () => this.toggleSub(s.id) });
        }
      }
    }
    if (this.priceMax() < this.maxPrice) {
      chips.push({ key: 'price', label: `Hasta ${this.money(this.priceMax())}`, clear: () => this.priceMax.set(this.maxPrice) });
    }
    if (this.inStockOnly()) {
      chips.push({ key: 'stock', label: 'Solo en stock', clear: () => this.inStockOnly.set(false) });
    }
    if (this.minRating()) {
      chips.push({ key: 'rating', label: `${this.minRating()}★ y más`, clear: () => this.minRating.set(0) });
    }
    return chips;
  });

  money(v: number): string {
    return v.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  }

  toggleExpand(catId: string): void {
    this.expandedCats.update((prev: string[]) => (prev.includes(catId) ? prev.filter((x: string) => x !== catId) : [...prev, catId]));
  }

  toggleSub(subId: string): void {
    this.activeSubs.update((prev: string[]) => (prev.includes(subId) ? prev.filter((x: string) => x !== subId) : [...prev, subId]));
  }

  toggleCategoryAll(catId: string): void {
    const cat = this.categories.find((c) => c.id === catId);
    if (!cat) return;
    const ids = cat.subcategories.map((s) => s.id);
    const allOn = ids.every((id: string) => this.activeSubs().includes(id));
    this.activeSubs.update((prev: string[]) => (allOn ? prev.filter((id: string) => !ids.includes(id)) : [...new Set([...prev, ...ids])]));
  }

  isCategoryChecked(catId: string): boolean {
    const cat = this.categories.find((c) => c.id === catId);
    if (!cat) return false;
    return cat.subcategories.every((s) => this.activeSubs().includes(s.id));
  }

  isCategoryIndeterminate(catId: string): boolean {
    const cat = this.categories.find((c) => c.id === catId);
    if (!cat) return false;
    const some = cat.subcategories.some((s) => this.activeSubs().includes(s.id));
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