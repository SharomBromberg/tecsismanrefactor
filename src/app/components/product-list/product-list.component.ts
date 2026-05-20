import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { Category } from '../../interfaces/categories';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(private productService: ProductService) { }


  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: string = '';
  noProductsMessage: string = '';


  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }


  getProducts(): void {
    this.productService.getAllProducts(this.selectedCategoryId)
      .subscribe(
        res => {
          this.products = res || [];
          this.noProductsMessage = (this.products.length === 0) ? 'Pronto tendremos listos los productos, ¡espéralos!' : '';

        },
        err => console.log('Error loading products', err)
      );
  }
  getCategories() {
    this.productService.getAllCategories()
      .subscribe(
        res => {

          this.categories = res || [];
        },
        err => console.log('Error loading categories', err)
      );
  }

  deleteProduct(id: string | undefined): void {
    if (id !== undefined) {
      this.productService.deleteProduct(id)
        .subscribe(
          res => {
            console.log(res);
            this.getProducts();
          },
          err => console.log(err)
        );
    }
  }
  filterProductsByCategory() {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(
        (data: Product[]) => {
          if (Array.isArray(data)) {
            this.products = data;
            this.noProductsMessage = (this.products.length === 0) ? 'No hay productos disponibles en esta categoría.' : '';
          } else {
            console.error('La respuesta del servicio no es un array de productos:', data);
            this.noProductsMessage = 'Hubo un problema al cargar los productos. Inténtalo de nuevo más tarde.';
          }
        },
        (error) => {
          console.error('Error filtering products by category', error);
          this.noProductsMessage = 'Hubo un problema al cargar los productos. Inténtalo de nuevo más tarde.';
        }
      );
    } else {
      // Si no hay categoría seleccionada, cargar todos los productos
      this.getProducts();
    }
  }
}