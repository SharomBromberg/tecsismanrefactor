import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { CategoryFormComponent } from 'src/app/features/admin/components/category-form/category-form.component';
import { ProductFormComponent } from 'src/app/features/admin/components/product-form/product-form.component';
import { AdminProductCreatePayload } from 'src/app/core/interfaces/admin-product-form.interface';
import { BlogPost } from 'src/app/core/interfaces/blog';
import { Category } from 'src/app/core/interfaces/categories';
import { Product } from 'src/app/core/interfaces/product';
import { AuthService } from 'src/app/core/services/auth.service';
import { BlogService } from 'src/app/core/services/blog.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    CategoryFormComponent,
    ProductFormComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  readonly categories$ = this.productService.getCategories();
  readonly products$ = this.productService.getProducts();
  readonly posts$ = this.blogService.posts$;
  readonly postForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(6)]],
    category: ['', [Validators.required]],
    coverImage: ['assets/logos/4.png', [Validators.required]],
    excerpt: ['', [Validators.required, Validators.minLength(20)]],
    content: ['', [Validators.required, Validators.minLength(80)]],
  });
  blogFeedback = '';

  readonly vm$ = combineLatest([
    this.products$,
    this.categories$,
    this.posts$,
  ]).pipe(
    map(([products, categories, posts]) => ({
      products,
      categories,
      posts,
      categoryCount: categories.length,
      productCount: products.length,
      postCount: posts.length,
      commentCount: posts.reduce((acc, post) => acc + post.comments.length, 0),
      productsWithCategory: products.map((product) => ({
        product,
        categoryName:
          categories.find((category) => category._id === product.categoryId)
            ?.name ?? 'Sin categoría',
      })),
    })),
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
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

  createBlogPost(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const payload = this.postForm.getRawValue();
    const result = this.blogService.createPost(
      {
        title: payload.title ?? '',
        excerpt: payload.excerpt ?? '',
        content: payload.content ?? '',
        coverImage: payload.coverImage ?? '',
        category: payload.category ?? '',
      },
      this.adminDisplayName,
    );

    this.blogFeedback = result.message ?? 'Publicacion creada correctamente.';

    if (result.ok) {
      this.postForm.reset({ coverImage: 'assets/logos/4.png' });
    }
  }

  removeBlogPost(post: BlogPost): void {
    this.blogService.deletePost(post.id);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category._id || `${index}`;
  }

  trackByProductId(index: number, item: { product: Product }): string {
    return item.product._id || `${index}`;
  }

  trackByPostId(index: number, post: BlogPost): string {
    return post.id || `${index}`;
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
