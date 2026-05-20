import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'Inicio', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'Productos', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'Admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'Servicios', loadChildren: () => import('./services/services.module').then(m => m.ServicesModule) },
  { path: 'Contacto', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
  { path: 'Blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  { path: 'Usuario', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
