import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { BlogPostFormComponent } from '@features/admin/components/blog-post-form/blog-post-form.component';
import { CategoryFormComponent } from '@features/admin/components/category-form/category-form.component';
import { ProfileFormComponent } from '@features/admin/components/profile-form/profile-form.component';
import { ProductFormComponent } from '@features/admin/components/product-form/product-form.component';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { IconComponent } from '@shared/atoms/icon/icon.component';
import {
  AdminProductCreatePayload,
  AdminProductUpdatePayload,
} from '@core/interfaces/admin-product-form.interface';
import { AuthUserSummary, UserAccountStatus, UserRole } from '@core/interfaces/auth';
import { BlogComment, BlogPost, BlogPostCreateInput } from '@core/interfaces/blog';
import { Category } from '@core/interfaces/categories';
import {
  CategoryPayload,
  CategoryUpdatePayload,
} from '@core/interfaces/category.interface';
import { Order, OrderStatus } from '@core/interfaces/order';
import { Product } from '@core/interfaces/product';
import { AuthService } from '@core/services/auth.service';
import { BlogService } from '@core/services/blog.service';
import { OrderService } from '@core/services/order.service';
import { ProductService } from '@core/services/product.service';
import { ToastService } from '@core/services/toast.service';
import {
  StockState,
  getStockState,
  getStockStateLabel,
} from '@core/utils/stock-state.util';

export type AdminTab = 'resumen' | 'productos' | 'pedidos' | 'blog' | 'usuarios' | 'perfil';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    RouterLink,
    IconComponent,
    ProfileFormComponent,
    CategoryFormComponent,
    ProductFormComponent,
    BlogPostFormComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private blogService = inject(BlogService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  readonly categories$ = this.productService.getCategories();
  readonly products$ = this.productService.getProducts();
  readonly posts$ = this.blogService.posts$;
  readonly orders$ = this.orderService.getOrders();

  activeTab: AdminTab = 'resumen';
  selectedProduct: Product | null = null;
  selectedPost: BlogPost | null = null;
  expandedPostId: string | null = null;

  isProductFormOpen = false;
  isCategoryModalOpen = false;
  isBlogFormOpen = false;

  // Filter terms
  productSearchTerm = '';
  productCategoryFilter = 'all';
  productStockFilter: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' = 'all';

  orderSearchTerm = '';
  orderStatusFilter: 'all' | OrderStatus = 'all';

  blogSearchTerm = '';

  staffUsers: AuthUserSummary[] = [];
  userSearchTerm = '';
  userRoleFilter: UserRole | 'all' = 'all';

  readonly roleOptions: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Administrador total' },
    { value: 'product-manager', label: 'Gestor de productos' },
    { value: 'blog-editor', label: 'Editor de blog' },
    { value: 'user', label: 'Usuario/Cliente' },
  ];

  readonly orderStatusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'paid', label: 'Pagado' },
    { value: 'shipped', label: 'En camino' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'refunded', label: 'Reembolsado' },
  ];

  readonly vm$ = combineLatest([
    this.products$,
    this.categories$,
    this.posts$,
    this.orders$,
  ]).pipe(
    map(([products, categories, posts, orders]) => {
      const visibleBlogPosts = posts.filter(
        (post) => this.canSeeAllBlogPosts || post.authorUsername === this.adminUsername,
      );

      const totalRevenue = orders
        .filter((o) => o.status === 'delivered' || o.status === 'paid' || o.status === 'shipped')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
      const completedOrdersCount = orders.filter((o) => o.status === 'delivered').length;

      return {
        products,
        categories,
        posts: visibleBlogPosts,
        orders,
        totalRevenue,
        pendingOrdersCount,
        completedOrdersCount,
        categoryCount: categories.length,
        topLevelCategoryCount: categories.filter((category) => !category.parentId).length,
        subcategoryCount: categories.filter((category) => !!category.parentId).length,
        productCount: products.length,
        featuredCount: products.filter((product) => !!product.featured).length,
        lowStockCount: products.filter(
          (product) => getStockState(product.stock) === 'low-stock',
        ).length,
        outOfStockCount: products.filter(
          (product) => getStockState(product.stock) === 'out-of-stock',
        ).length,
        postCount: visibleBlogPosts.length,
        commentCount: visibleBlogPosts.reduce((acc, post) => acc + post.comments.length, 0),
        reactionCount: visibleBlogPosts.reduce(
          (acc, post) => acc + post.reactions.likes.length + post.reactions.dislikes.length,
          0,
        ),
        productsWithCategory: products.map((product) => ({
          product,
          categoryName:
            categories.find((category) => category._id === product.categoryId)
              ?.name ?? 'Sin categoría',
        })),
      };
    }),
  );

  ngOnInit(): void {
    this.refreshUsers();
  }

  setActiveTab(tab: AdminTab): void {
    this.activeTab = tab;
  }

  get availableTabs(): { id: AdminTab; label: string; icon: string; count?: number }[] {
    const tabs: { id: AdminTab; label: string; icon: string; count?: number }[] = [
      { id: 'resumen', label: 'Resumen', icon: 'history' },
    ];

    if (this.canManageProducts) {
      tabs.push({ id: 'productos', label: 'Productos', icon: 'cart' });
    }
    if (this.canManageOrders) {
      tabs.push({ id: 'pedidos', label: 'Pedidos', icon: 'history' });
    }
    if (this.canManageBlog) {
      tabs.push({ id: 'blog', label: 'Blog', icon: 'edit' });
    }
    if (this.canManageUsers) {
      tabs.push({ id: 'usuarios', label: 'Usuarios', icon: 'user' });
    }
    tabs.push({ id: 'perfil', label: 'Mi Perfil', icon: 'lock' });

    return tabs;
  }

  get canManageProducts(): boolean {
    return this.adminRole === 'admin' || this.adminRole === 'product-manager';
  }

  get canManageBlog(): boolean {
    return this.adminRole === 'admin' || this.adminRole === 'blog-editor';
  }

  get canManageOrders(): boolean {
    return this.adminRole === 'admin' || this.adminRole === 'product-manager';
  }

  get canManageUsers(): boolean {
    return this.adminRole === 'admin';
  }

  get canSeeAllBlogPosts(): boolean {
    return this.adminRole === 'admin';
  }

  logoutAdmin(): void {
    this.authService.logout();
    void this.router.navigate(['/login'], {
      queryParams: { role: 'admin' },
    });
  }

  filterProductsList(items: { product: Product; categoryName: string }[]): { product: Product; categoryName: string }[] {
    const term = this.productSearchTerm.trim().toLowerCase();
    const cat = this.productCategoryFilter;
    const stock = this.productStockFilter;

    return items.filter(({ product, categoryName }) => {
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product._id.toLowerCase().includes(term) ||
        categoryName.toLowerCase().includes(term);

      const matchesCat = cat === 'all' || product.categoryId === cat;

      const state = this.stockState(product);
      const matchesStock =
        stock === 'all' ||
        (stock === 'in-stock' && state === 'in-stock') ||
        (stock === 'low-stock' && state === 'low-stock') ||
        (stock === 'out-of-stock' && state === 'out-of-stock');

      return matchesTerm && matchesCat && matchesStock;
    });
  }

  filterOrdersList(orders: Order[]): Order[] {
    const term = this.orderSearchTerm.trim().toLowerCase();
    const status = this.orderStatusFilter;

    return orders.filter((order) => {
      const matchesTerm =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customerDisplayName.toLowerCase().includes(term) ||
        (order.phone && order.phone.includes(term)) ||
        (order.city && order.city.toLowerCase().includes(term));

      const matchesStatus = status === 'all' || order.status === status;

      return matchesTerm && matchesStatus;
    });
  }

  filterBlogPosts(posts: BlogPost[]): BlogPost[] {
    const term = this.blogSearchTerm.trim().toLowerCase();
    if (!term) return posts;

    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.authorDisplayName.toLowerCase().includes(term),
    );
  }

  openNewProductForm(): void {
    this.selectedProduct = null;
    this.isProductFormOpen = true;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.isProductFormOpen = true;
  }

  cancelProductEdit(): void {
    this.selectedProduct = null;
    this.isProductFormOpen = false;
  }

  openNewBlogForm(): void {
    this.selectedPost = null;
    this.isBlogFormOpen = true;
  }

  editBlogPost(post: BlogPost): void {
    this.selectedPost = post;
    this.isBlogFormOpen = true;
  }

  cancelBlogEdit(): void {
    this.selectedPost = null;
    this.isBlogFormOpen = false;
  }

  createCategory(payload: CategoryPayload): void {
    const normalizedName = payload.name.trim();
    if (!normalizedName) {
      return;
    }

    this.productService.addCategory(normalizedName, payload.parentId).subscribe({
      next: () => this.toastService.show('Categoría creada correctamente.', 'success'),
      error: () => this.toastService.show('No se pudo crear la categoría.', 'error'),
    });
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
      .subscribe({
        next: () => this.toastService.show('Categoría actualizada correctamente.', 'success'),
        error: () => this.toastService.show('No se pudo actualizar la categoría.', 'error'),
      });
  }

  createProduct(payload: AdminProductCreatePayload): void {
    this.productService.addProduct(payload).subscribe({
      next: () => {
        this.toastService.show('Producto creado correctamente en el catálogo.', 'success');
        this.isProductFormOpen = false;
      },
      error: () => this.toastService.show('No se pudo crear el producto.', 'error'),
    });
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
        attributes: payload.attributes,
      })
      .subscribe({
        next: () => {
          this.toastService.show('Producto actualizado correctamente.', 'success');
          this.isProductFormOpen = false;
          this.selectedProduct = null;
        },
        error: () => this.toastService.show('No se pudo actualizar el producto.', 'error'),
      });
  }

  removeCategory(category: Category): void {
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      this.productService.deleteCategory(category._id).subscribe({
        next: () => this.toastService.show('Categoría eliminada.', 'success'),
        error: () => this.toastService.show('No se pudo eliminar la categoría.', 'error'),
      });
    }
  }

  removeProduct(product: Product): void {
    if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
      this.productService.deleteProduct(product._id).subscribe({
        next: () => this.toastService.show('Producto eliminado del catálogo.', 'success'),
        error: () => this.toastService.show('No se pudo eliminar el producto.', 'error'),
      });
    }
  }

  setProductFeatured(product: Product, featured: boolean): void {
    this.productService.setProductFeatured(product._id, featured).subscribe({
      next: () =>
        this.toastService.show(
          featured ? 'Producto destacado en vitrina principal.' : 'Producto quitado de destacados.',
          'success',
        ),
      error: () =>
        this.toastService.show('No se pudo actualizar el estado destacado.', 'error'),
    });
  }

  stockState(product: Product): StockState {
    return getStockState(product.stock);
  }

  stockStateLabel(state: StockState): string {
    return getStockStateLabel(state);
  }

  createBlogPost(payload: BlogPostCreateInput): void {
    const result = this.blogService.createPost(payload, {
      username: this.adminUsername,
      displayName: this.adminDisplayName,
    });

    this.toastService.show(
      result.message ??
        (result.ok ? 'Publicación creada correctamente.' : 'No se pudo crear la publicación.'),
      result.ok ? 'success' : 'error',
    );
    if (result.ok) {
      this.isBlogFormOpen = false;
    }
  }

  updateBlogPost(payload: { postId: string; payload: BlogPostCreateInput }): void {
    const result = this.blogService.updatePost(payload.postId, payload.payload);
    this.toastService.show(
      result.message ??
        (result.ok
          ? 'Publicación actualizada correctamente.'
          : 'No se pudo actualizar la publicación.'),
      result.ok ? 'success' : 'error',
    );
    if (result.ok) {
      this.selectedPost = null;
      this.isBlogFormOpen = false;
    }
  }

  removeBlogPost(post: BlogPost): void {
    if (confirm(`¿Eliminar la publicación "${post.title}"?`)) {
      this.blogService.deletePost(post.id);
      this.toastService.show('Publicación eliminada correctamente.', 'success');
      if (this.selectedPost?.id === post.id) {
        this.selectedPost = null;
        this.isBlogFormOpen = false;
      }
    }
  }

  toggleComments(postId: string): void {
    this.expandedPostId = this.expandedPostId === postId ? null : postId;
  }

  removeComment(post: BlogPost, comment: BlogComment): void {
    this.blogService.deleteComment(post.id, comment.id);
    this.toastService.show('Comentario eliminado.', 'success');
  }

  blogStatusLabel(status: BlogPost['status']): string {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'in-review':
        return 'En revisión';
      case 'scheduled':
        return 'Programado';
      default:
        return 'Publicado';
    }
  }

  updateOrderStatus(order: Order, status: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: () => this.toastService.show(`Pedido #${order.id} actualizado a ${this.orderStatusLabel(status)}.`, 'success'),
      error: () => this.toastService.show('No se pudo actualizar el pedido.', 'error'),
    });
  }

  orderStatusLabel(status: OrderStatus): string {
    return this.orderStatusOptions.find((option) => option.value === status)?.label ?? status;
  }

  getWhatsAppCustomerLink(order: Order): string {
    const phone = (order.phone || '').replace(/\D/g, '');
    const cleanPhone = phone.startsWith('57') ? phone : `57${phone}`;
    const text = encodeURIComponent(
      `Hola ${order.customerDisplayName}, te contactamos de Tecsisman respecto a tu pedido #${order.id}. ¿Cómo estás?`,
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  refreshUsers(): void {
    this.staffUsers = this.authService.listStaffAndUsers();
  }

  get filteredUsers(): AuthUserSummary[] {
    const term = this.userSearchTerm.trim().toLowerCase();
    return this.staffUsers.filter((user) => {
      const matchesTerm =
        !term ||
        user.username.toLowerCase().includes(term) ||
        user.displayName.toLowerCase().includes(term);
      const matchesRole = this.userRoleFilter === 'all' || user.role === this.userRoleFilter;
      return matchesTerm && matchesRole;
    });
  }

  changeUserRole(user: AuthUserSummary, role: UserRole): void {
    const result = this.authService.setUserRole(user.username, role);
    this.toastService.show(
      result.message ?? (result.ok ? 'Rol actualizado correctamente.' : 'No se pudo actualizar el rol.'),
      result.ok ? 'success' : 'error',
    );
    this.refreshUsers();
  }

  toggleUserStatus(user: AuthUserSummary): void {
    const nextStatus: UserAccountStatus = user.status === 'active' ? 'suspended' : 'active';
    const result = this.authService.setUserStatus(user.username, nextStatus);
    this.toastService.show(
      result.message ??
        (result.ok
          ? nextStatus === 'suspended'
            ? 'Usuario suspendido.'
            : 'Usuario reactivado.'
          : 'No se pudo actualizar el estado.'),
      result.ok ? 'success' : 'error',
    );
    this.refreshUsers();
  }

  resetUserPassword(user: AuthUserSummary): void {
    const tempPassword = this.generateTempPassword();
    const result = this.authService.adminResetPassword(user.username, tempPassword);

    if (result.ok) {
      this.toastService.show(
        `Contraseña restablecida para ${user.username}. Clave temporal: ${tempPassword}`,
        'success',
        7000,
      );
      return;
    }

    this.toastService.show(result.message ?? 'No se pudo restablecer la contraseña.', 'error');
  }

  private generateTempPassword(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `Tecsis${random}!`;
  }

  saveDisplayName(displayName: string): void {
    this.authService.updateSessionDisplayName(displayName);
    this.toastService.show('Perfil actualizado correctamente.', 'success');
  }

  changePassword(payload: {
    currentPassword: string;
    nextPassword: string;
  }): void {
    const result = this.authService.changeCurrentUserPassword(
      payload.currentPassword,
      payload.nextPassword,
    );
    this.toastService.show(
      result.message ??
        (result.ok
          ? 'Contraseña actualizada correctamente.'
          : 'No se pudo actualizar la contraseña.'),
      result.ok ? 'success' : 'error',
    );
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

  trackByOrderId(index: number, order: Order): string {
    return order.id || `${index}`;
  }

  trackByUsername(index: number, user: AuthUserSummary): string {
    return user.username || `${index}`;
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

  get adminRole(): UserRole {
    return this.authService.currentSession()?.role ?? 'admin';
  }

  roleLabel(role: UserRole): string {
    return this.roleOptions.find((option) => option.value === role)?.label ?? role;
  }
}
