import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { BlogComponent } from './components/pages/blog/blog.component';
import { UserComponent } from './components/pages/user/user.component';
import { ProductDetailsComponent } from './components/pages/product-details/product-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Inicio', component: HomeComponent },
  { path: 'Productos', component: ProductsComponent },
  { path: 'Admin', component: AdminComponent },
  { path: 'Servicios', component: ServicesComponent },
  { path: 'Contacto', component: ContactComponent },
  { path: 'Blog', component: BlogComponent },
  { path: 'Usuario', component: UserComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent }
];
