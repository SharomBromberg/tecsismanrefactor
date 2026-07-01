import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { CategoryFormComponent } from 'src/app/features/admin/components/category-form/category-form.component';
import { ProductFormComponent } from 'src/app/features/admin/components/product-form/product-form.component';
import { AdminProductCreatePayload } from 'src/app/core/interfaces/admin-product-form.interface';
import { Category } from 'src/app/core/interfaces/categories';
import { Product } from 'src/app/core/interfaces/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CurrencyPipe,
    CategoryFormComponent,
    ProductFormComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  readonly categories$ = this.productService.getCategories();
  readonly products$ = this.productService.getProducts();
  readonly vm$ = combineLatest([this.products$, this.categories$]).pipe(
    map(([products, categories]) => ({
      products,
      categories,
      categoryCount: categories.length,
      productCount: products.length,
      productsWithCategory: products.map((product) => ({
        product,
        categoryName:
          categories.find((category) => category._id === product.categoryId)
            ?.name ?? 'Sin categoría',
      })),
    })),
  );

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
  ) {}

  logoutAdmin(): void {
    this.authService.logout();
    void this.router.navigate(['/login'], {
      queryParams: { role: 'admin' },
    });
  }

  createCategory(name: string): void {
    const normalizedName = name.trim();
    if (!normalizedName) {
      return;
    }

    this.productService.addCategory(normalizedName).subscribe();
  }

  createProduct(payload: AdminProductCreatePayload): void {
    this.productService.addProduct(payload).subscribe();
  }

  removeCategory(category: Category): void {
    this.productService.deleteCategory(category._id).subscribe();
  }

  removeProduct(product: Product): void {
    this.productService.deleteProduct(product._id).subscribe();
  }

  trackByCategoryId(index: number, category: Category): string {
    return category._id || `${index}`;
  }

  trackByProductId(index: number, item: { product: Product }): string {
    return item.product._id || `${index}`;
  }

  get adminDisplayName(): string {
    return this.authService.currentSession()?.displayName ?? 'Administrador';
  }

  get initialLetter(): string {
    const displayName = this.adminDisplayName.trim();
    if (!displayName) {
      return 'A';
    }

    return displayName[0].toUpperCase();
  }
}
