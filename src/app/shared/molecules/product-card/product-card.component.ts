import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@core/interfaces/product';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, ButtonComponent, IconComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() categoryName = 'Producto destacado';
  @Input() variant: 'featured' | 'grid' = 'featured';
  @Input() showFavorite = false;
  @Input() isFavorite = false;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() favoriteToggle = new EventEmitter<string>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onFavoriteToggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit(this.product._id);
  }
}
