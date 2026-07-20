import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@core/interfaces/product';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-featured-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, ButtonComponent],
  templateUrl: './featured-product-card.component.html',
  styleUrls: ['./featured-product-card.component.scss'],
})
export class FeaturedProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() categoryName = 'Producto destacado';
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
