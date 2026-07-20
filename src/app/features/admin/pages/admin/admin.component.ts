import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { BlogPostFormComponent } from '@features/admin/components/blog-post-form/blog-post-form.component';
import { CategoryFormComponent } from '@features/admin/components/category-form/category-form.component';
import { ProfileFormComponent } from '@features/admin/components/profile-form/profile-form.component';
import { ProductFormComponent } from '@features/admin/components/product-form/product-form.component';
import {
  AdminProductCreatePayload,
  AdminProductUpdatePayload,
} from '@core/interfaces/admin-product-form.interface';
import { BlogPost, BlogPostCreateInput } from '@core/interfaces/blog';
import { Category } from '@core/interfaces/categories';
import {
  CategoryPayload,
  CategoryUpdatePayload,
} from '@core/interfaces/category.interface';
import { Product } from '@core/interfaces/product';
import { AuthService } from '@core/services/auth.service';
import { BlogService } from '@core/services/blog.service';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CurrencyPipe,
    ProfileFormComponent,
    CategoryFormComponent,
    ProductFormComponent,
    BlogPostFormComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  private authService = inject(AuthService);
  private blogService = inject(BlogService);
  private productService = inject(ProductService);
  private router = inject(Router);

  readonly categories$ = this.productService.getCategories();
  readonly products$ = this.productService.getProducts();
  readonly posts$ = this.blogService.posts$;
  blogFeedback = '';
  profileFeedback = '';
  passwordFeedback = '';
  selectedProduct: Product | null = null;
  selectedPost: BlogPost | null = null;

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
      topLevelCategoryCount: categories.filter((category) => !category.parentId).length,
      subcategoryCount: categories.filter((category) => !!category.parentId).length,
      productCount: products.length,
      featuredCount: products.filter((product) => !!product.featured).length,
      postCount: posts.length,
      commentCount: posts.reduce((acc, post) => acc + post.comments.length, 0),
      reactionCount: posts.reduce(
        (acc, post) => acc + post.reactions.likes.length + post.reactions.dislikes.length,
        0,
      ),
      productsWithCategory: products.map((product) => ({
        product,
        categoryName:
          categories.find((category) => category._id === product.categoryId)
            ?.name ?? 'Sin categoría',
      })),
    })),
  );

  logoutAdmin(): void {
    this.authService.logout();
    void this.router.navigate(['/login'], {
      queryParams: { role: 'admin' },
    });
  }

  createCategory(payload: CategoryPayload): void {
    const normalizedName = payload.name.trim();
    if (!normalizedName) {
      return;
    }

    this.productService.addCategory(normalizedName, payload.parentId).subscribe();
  }

  updateCategory(payload: CategoryUpdatePayload): void {
    const normalizedName = payload.name.trim();
    if (!normalizedName) {
      return;
    }

    this.productService
      .updateCategory(payload.categoryId, {
        name: normalizedName,
        parentId: payload.parentId,
      })
      .subscribe();
  }

  createProduct(payload: AdminProductCreatePayload): void {
    this.productService.addProduct(payload).subscribe();
  }

  updateProduct(payload: AdminProductUpdatePayload): void {
    this.productService
      .updateProduct(payload._id, {
        name: payload.name,
        description: payload.description,
        categoryId: payload.categoryId,
        price: payload.price,
        stock: payload.stock,
        images: payload.images,
        featured: payload.featured,
        tags: payload.tags,
        filenames: payload.filenames,
      })
      .subscribe();
    this.selectedProduct = null;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
  }

  cancelProductEdit(): void {
    this.selectedProduct = null;
  }

  removeCategory(category: Category): void {
    this.productService.deleteCategory(category._id).subscribe();
  }

  removeProduct(product: Product): void {
    this.productService.deleteProduct(product._id).subscribe();
  }

  setProductFeatured(product: Product, featured: boolean): void {
    this.productService.setProductFeatured(product._id, featured).subscribe();
  }

  createBlogPost(payload: BlogPostCreateInput): void {
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
  }

  updateBlogPost(payload: { postId: string; payload: BlogPostCreateInput }): void {
    const result = this.blogService.updatePost(payload.postId, payload.payload);
    this.blogFeedback = result.message ?? 'Publicacion actualizada.';
    if (result.ok) {
      this.selectedPost = null;
    }
  }

  editBlogPost(post: BlogPost): void {
    this.selectedPost = post;
  }

  cancelBlogEdit(): void {
    this.selectedPost = null;
    this.blogFeedback = '';
  }

  removeBlogPost(post: BlogPost): void {
    this.blogService.deletePost(post.id);
    if (this.selectedPost?.id === post.id) {
      this.selectedPost = null;
    }
  }

  saveDisplayName(displayName: string): void {
    this.authService.updateSessionDisplayName(displayName);
    this.profileFeedback = 'Perfil actualizado correctamente.';
  }

  changePassword(payload: {
    currentPassword: string;
    nextPassword: string;
  }): void {
    const result = this.authService.changeCurrentUserPassword(
      payload.currentPassword,
      payload.nextPassword,
    );
    this.passwordFeedback =
      result.message ?? 'Contraseña actualizada correctamente.';
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

  get adminUsername(): string {
    return this.authService.currentSession()?.username ?? 'admin';
  }

  get adminRole(): 'admin' | 'user' {
    return this.authService.currentSession()?.role ?? 'admin';
  }
}
