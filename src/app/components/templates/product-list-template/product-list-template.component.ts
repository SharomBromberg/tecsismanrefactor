import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/interfaces/categories';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list-template',
  templateUrl: './product-list-template.component.html',
  styleUrls: ['./product-list-template.component.scss']
})
export class ProductListTemplateComponent implements OnInit {

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