import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product';
import { Category } from '../../../interfaces/categories';
import { Router } from '@angular/router';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @Input() buttonText: string = '';
  @Input() customStyle: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  constructor(private productService: ProductService, private router: Router) { }


  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: string = '';
  noProductsMessage: string = '';
  itemsPerPage: number = 5; // Número de productos por página
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Número total de páginas
  selectedProduct: Product | null = null;


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
          this.calculateTotalPages();
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
  filterProductsByCategory() {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(
        (data: Product[]) => {
          if (Array.isArray(data)) {
            this.products = data;
            this.noProductsMessage = (this.products.length === 0) ? 'No hay productos disponibles en esta categoría.' : '';
            this.calculateTotalPages();
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
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
  }
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getProductById(id: string): void {
    this.productService.getProductById(id)
      .subscribe(
        res => {
          this.selectedProduct = res;
          this.router.navigate(['/product-details', this.selectedProduct._id]);
        },
        err => console.error('Error loading product', err)
      );
  }
}

