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
    path: 'user',
    canActivate: [userRoleGuard],
    loadComponent: () =>
      import('./features/main/pages/user/user.component').then(
        (m) => m.UserComponent,
      ),
  },
  {
    path: 'Productos',
    loadComponent: () =>
      import('./features/main/pages/products/products.component').then(
        (m) => m.ProductsComponent,
      ),
  },
  {
    path: 'Admin',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'Servicios',
    loadComponent: () =>
      import('./features/main/pages/services/services.component').then(
        (m) => m.ServicesComponent,
      ),
  },
  {
    path: 'Contacto',
    loadComponent: () =>
      import('./features/main/pages/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
  },
  {
    path: 'Blog',
    loadComponent: () =>
      import('./features/main/pages/blog/blog.component').then(
        (m) => m.BlogComponent,
      ),
  },
  {
    path: 'Usuario',
    redirectTo: 'user',
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
    path: 'carrito',
    canActivate: [userRoleGuard],
    loadComponent: () =>
      import('./shared/organisms/shopping-cart/shopping-cart.component').then(
        (m) => m.ShoppingCartComponent,
      ),
  },
];
