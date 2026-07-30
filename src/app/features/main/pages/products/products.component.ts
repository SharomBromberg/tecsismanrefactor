import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import { CatalogCardVm, Product } from '@core/interfaces/product';
import { Category } from '@core/interfaces/categories';
import { UserFavoritesService } from '@core/services/user-favorites.service';
import { ToastService } from '@core/services/toast.service';
import { CartService } from '@core/services/cart.service';
import { CartDrawerService } from '@core/services/cart-drawer.service';
import { SearchBoxComponent } from '@shared/molecules/search-box/search-box.component';
import { CategoryPillsComponent } from '@shared/molecules/category-pills/category-pills.component';
import { ProductCardComponent } from '@shared/molecules/product-card/product-card.component';

interface ProductCardFavoriteVm extends CatalogCardVm {
  isFavorite: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    SearchBoxComponent,
    CategoryPillsComponent,
    ProductCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly favoritesService = inject(UserFavoritesService);
  private readonly toastService = inject(ToastService);
  private readonly cartService = inject(CartService);
  private readonly cartDrawerService = inject(CartDrawerService);

  private readonly currentUsername =
    this.authService.currentSession()?.username ?? '';
  readonly isUserLoggedIn = !!this.currentUsername;

  readonly categoryControl = new FormControl<string>('', { nonNullable: true });
  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly activeSubcategory = new BehaviorSubject<string>('');
  readonly selectedBrands = new BehaviorSubject<string[]>([]);
  readonly selectedPriceRange = new BehaviorSubject<string>('');
  readonly showOnlyFavorites = new BehaviorSubject<boolean>(false);
  filtersVisible = false;
  mobileFilterOpen = false;

  readonly brandFilters = ['Cisco', 'Fortinet', 'Hikvision', 'Dell', 'TP-Link'];

  readonly categories$ = this.productService
    .getCategories()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly selectedCategory$ = this.categoryControl.valueChanges.pipe(
    startWith(this.categoryControl.value),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly selectedBrands$ = this.selectedBrands.asObservable();
  readonly selectedPriceRange$ = this.selectedPriceRange.asObservable();
  readonly showOnlyFavorites$ = this.showOnlyFavorites.asObservable();

  readonly filteredProducts$ = combineLatest([
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
    this.selectedCategory$,
    this.activeSubcategory,
    this.selectedPriceRange$,
    this.selectedBrands$,
  ]).pipe(
    switchMap(([query, categoryId, subcategory, priceRange, brands]) => {
      const base$ = query
        ? this.productService.searchProducts(query)
        : this.productService.getProducts();
      return base$.pipe(
        map((products: Product[]) =>
          products.filter((product: Product) => {
            const normalizedName = product.name.toLowerCase();
            const normalizedTags = (product.tags ?? []).map((tag) =>
              tag.toLowerCase(),
            );

            if (categoryId && product.categoryId !== categoryId) return false;

            if (subcategory) {
              const hasTag = normalizedTags.some(
                (t) => t === subcategory.toLowerCase(),
              );
              const inName = normalizedName.includes(subcategory.toLowerCase());
              if (!hasTag && !inName) return false;
            }

            if (brands.length > 0) {
              const brandMatch = brands.some((brand) => {
                const normalizedBrand = brand.toLowerCase();
                return (
                  normalizedName.includes(normalizedBrand) ||
                  normalizedTags.some((tag) => tag.includes(normalizedBrand))
                );
              });
              if (!brandMatch) return false;
            }

            if (priceRange) {
              if (priceRange === 'below-500' && product.price > 500)
                return false;
              if (
                priceRange === 'mid-500-1500' &&
                (product.price < 500 || product.price > 1500)
              )
                return false;
              if (priceRange === 'above-1500' && product.price <= 1500)
                return false;
            }

            return true;
          }),
        ),
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly featuredProducts$ = this.productService
    .getFeaturedProducts()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly favoriteIds$ = this.currentUsername
    ? this.favoritesService.getFavoriteIds$(this.currentUsername)
    : of([] as string[]);

  readonly cards$ = combineLatest([
    this.filteredProducts$,
    this.categories$,
    this.favoriteIds$,
    this.showOnlyFavorites$,
  ]).pipe(
    map(([products, categories, favoriteIds, showOnlyFavorites]) =>
      this.toCardViewModel(
        showOnlyFavorites
          ? products.filter((product) => favoriteIds.includes(product._id))
          : products,
        categories,
        favoriteIds,
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly featuredCards$ = combineLatest([
    this.featuredProducts$,
    this.categories$,
    this.favoriteIds$,
  ]).pipe(
    map(([products, categories, favoriteIds]) =>
      this.toCardViewModel(products, categories, favoriteIds),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly emptyMessage$ = combineLatest([
    this.cards$,
    this.selectedCategory$,
    this.selectedPriceRange$,
    this.selectedBrands$,
    this.showOnlyFavorites$,
  ]).pipe(
    map(([cards, categoryId, priceRange, brands, showOnlyFavorites]) => {
      if (cards.length > 0) {
        return '';
      }

      if (showOnlyFavorites) {
        return 'No tienes productos favoritos en este resultado.';
      }

      return categoryId || priceRange || brands.length
        ? 'No se encontraron productos que coincidan con los filtros seleccionados.'
        : 'Aún no hay productos disponibles.';
    }),
  );

  selectCategory(categoryId: string): void {
    if (
      this.categoryControl.value === categoryId &&
      !this.activeSubcategory.value
    ) {
      this.categoryControl.setValue('');
    } else {
      this.categoryControl.setValue(categoryId);
      this.activeSubcategory.next('');
    }
  }

  selectPriceRange(range: string): void {
    this.selectedPriceRange.next(
      this.selectedPriceRange.value === range ? '' : range,
    );
  }

  toggleBrand(brand: string): void {
    const current = this.selectedBrands.value;
    const updated = current.includes(brand)
      ? current.filter((item) => item !== brand)
      : [...current, brand];
    this.selectedBrands.next(updated);
  }

  clearFilters(): void {
    this.categoryControl.setValue('');
    this.activeSubcategory.next('');
    this.selectedPriceRange.next('');
    this.selectedBrands.next([]);
    this.showOnlyFavorites.next(false);
    this.mobileFilterOpen = false;
    this.filtersVisible = false;
  }

  toggleOnlyFavorites(): void {
    if (!this.isUserLoggedIn) {
      return;
    }

    this.showOnlyFavorites.next(!this.showOnlyFavorites.value);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category._id ?? `${index}`;
  }

  trackByProductId(index: number, item: ProductCardFavoriteVm): string {
    return item.product._id ?? `${index}`;
  }

  toggleFavorite(productId: string): void {
    if (!this.currentUsername) {
      this.toastService.show(
        'Inicia sesion para agregar productos a favoritos.',
        'info',
      );
      return;
    }

    const added = this.favoritesService.toggle(this.currentUsername, productId);
    this.toastService.show(
      added
        ? 'Producto agregado a favoritos.'
        : 'Producto eliminado de favoritos.',
      'success',
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.toastService.show(`${product.name} agregado al carrito.`, 'success');
    this.cartDrawerService.open();
  }

  private toCardViewModel(
    products: Product[],
    categories: Category[],
    favoriteIds: string[],
  ): ProductCardFavoriteVm[] {
    return products.map((product) => ({
      product,
      isFavorite: favoriteIds.includes(product._id),
      categoryName:
        categories.find((category) => category._id === product.categoryId)
          ?.name ?? 'Sin categoría',
    }));
  }
}
