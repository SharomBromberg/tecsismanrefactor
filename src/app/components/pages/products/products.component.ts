import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap } from 'rxjs';

import { NgFor, NgIf, AsyncPipe, CurrencyPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';
import { ProductService } from 'src/app/services/product.service';
import { CatalogCardVm, Product } from 'src/app/interfaces/product';
import { Category } from 'src/app/interfaces/categories';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [    FormsModule,
    ReactiveFormsModule,
    NgFor,
    RouterLink,
    NgIf,
    AsyncPipe,
    CurrencyPipe,],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);

  readonly categoryControl = new FormControl<string>('', { nonNullable: true });
  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly activeSubcategory = new BehaviorSubject<string>('');

  readonly categories$ = this.productService.getCategories().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly selectedCategory$ = this.categoryControl.valueChanges.pipe(
    startWith(this.categoryControl.value),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly filteredProducts$ = combineLatest([
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
    this.selectedCategory$,
    this.activeSubcategory
  ]).pipe(
    switchMap(([query, categoryId, subcategory]) => {
      const base$ = query ? this.productService.searchProducts(query) : this.productService.getProducts();
      return base$.pipe(
        map((products: Product[]) => products.filter((product: Product) => {
          if (categoryId && product.categoryId !== categoryId) return false;
          if (subcategory) {
            const hasTag = product.tags?.some(t => t.toLowerCase() === subcategory.toLowerCase());
            const inName = product.name.toLowerCase().includes(subcategory.toLowerCase());
            return hasTag || inName;
          }
          return true;
        }))
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly featuredProducts$ = this.productService.getFeaturedProducts().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly cards$ = combineLatest([this.filteredProducts$, this.categories$]).pipe(
    map(([products, categories]) => this.toCardViewModel(products, categories)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly featuredCards$ = combineLatest([this.featuredProducts$, this.categories$]).pipe(
    map(([products, categories]) => this.toCardViewModel(products, categories)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly emptyMessage$ = combineLatest([this.filteredProducts$, this.selectedCategory$]).pipe(
    map(([products, categoryId]) => {
      if (products.length > 0) {
        return '';
      }

      return categoryId
        ? 'No hay productos en esta categoría.'
        : 'Aun no hay productos disponibles.';
    }),
  );

  selectCategory(categoryId: string): void {
    if (this.categoryControl.value === categoryId && !this.activeSubcategory.value) {
      this.categoryControl.setValue('');
    } else {
      this.categoryControl.setValue(categoryId);
      this.activeSubcategory.next('');
    }
  }

  selectSubcategory(categoryId: string, subcategory: string, event: Event): void {
    event.stopPropagation();
    this.categoryControl.setValue(categoryId);
    this.activeSubcategory.next(subcategory);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id ?? `${index}`;
  }

  trackByProductId(index: number, item: CatalogCardVm): string {
    return item.product.id ?? `${index}`;
  }

  private toCardViewModel(products: Product[], categories: Category[]): CatalogCardVm[] {
    return products.map((product) => ({
      product,
      categoryName: categories.find((category) => category.id === product.categoryId)?.name ?? 'Sin categoria',
    }));
  }
}
