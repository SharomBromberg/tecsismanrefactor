import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  adminLoggedIn = false;
  username = '';
  password = '';
  products: Product[] = [];
  newProduct: Product = { id: 0, name: '', price: 0, category: '', image: '' };
  editingProduct: Product | null = null;

  loginAdmin() {
    if (this.username === 'admin' && this.password === 'password123') {
      this.adminLoggedIn = true;
    } else {
      alert('Credenciales incorrectas');
    }
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price) {
      this.newProduct.id = this.products.length + 1;
      this.products.push({ ...this.newProduct });
      this.newProduct = { id: 0, name: '', price: 0, category: '', image: '' };
    }
  }

  editProduct(product: Product) {
    this.editingProduct = { ...product };
  }

  saveEdit() {
    if (this.editingProduct) {
      const index = this.products.findIndex(p => p.id === this.editingProduct?.id);
      if (index !== -1) {
        this.products[index] = this.editingProduct;
        this.editingProduct = null;
      }
    }
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
