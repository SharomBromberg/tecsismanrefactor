import { Routes } from '@angular/router';
import { adminRoleGuard, userRoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/main/pages/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'Inicio',
    loadComponent: () =>
      import('./features/main/pages/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'inicio',
    redirectTo: 'Inicio',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [adminRoleGuard],
    loadComponent: () =>
      import('./features/admin/pages/admin/admin.component').then(
        (m) => m.AdminComponent,
      ),
  },
  {
    path: 'Admin',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'cuenta',
    canActivate: [userRoleGuard],
    loadComponent: () =>
      import('./features/main/pages/user/user.component').then(
        (m) => m.UserComponent,
      ),
  },
  {
    path: 'Cuenta',
    redirectTo: 'cuenta',
    pathMatch: 'full',
  },
  {
    path: 'user',
    canActivate: [userRoleGuard],
    loadComponent: () =>
      import('./features/main/pages/user/user.component').then(
        (m) => m.UserComponent,
      ),
  },
  {
    path: 'Usuario',
    redirectTo: 'cuenta',
    pathMatch: 'full',
  },
  {
    path: 'Productos',
    loadComponent: () =>
      import('./features/main/pages/products/products.component').then(
        (m) => m.ProductsComponent,
      ),
  },
  {
    path: 'productos',
    redirectTo: 'Productos',
    pathMatch: 'full',
  },
  {
    path: 'Productos/:id',
    loadComponent: () =>
      import('./features/main/pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
  },
  {
    path: 'productos/:id',
    loadComponent: () =>
      import('./features/main/pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
  },
  {
    path: 'Servicios',
    loadComponent: () =>
      import('./features/main/pages/services/services.component').then(
        (m) => m.ServicesComponent,
      ),
  },
  {
    path: 'servicios',
    redirectTo: 'Servicios',
    pathMatch: 'full',
  },
  {
    path: 'Contacto',
    loadComponent: () =>
      import('./features/main/pages/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
  },
  {
    path: 'contacto',
    redirectTo: 'Contacto',
    pathMatch: 'full',
  },
  {
    path: 'Blog',
    loadComponent: () =>
      import('./features/main/pages/blog/blog.component').then(
        (m) => m.BlogComponent,
      ),
  },
  {
    path: 'blog',
    redirectTo: 'Blog',
    pathMatch: 'full',
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./shared/organisms/shopping-cart/shopping-cart.component').then(
        (m) => m.ShoppingCartComponent,
      ),
  },
  {
    path: 'Carrito',
    redirectTo: 'carrito',
    pathMatch: 'full',
  },
  {
    path: 'checkout',
    redirectTo: 'carrito',
    pathMatch: 'full',
  },
  {
    path: 'Checkout',
    redirectTo: 'carrito',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'Inicio',
  },
];
