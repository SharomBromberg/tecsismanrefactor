import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { CartService } from '@core/services/cart.service';
import { CartDrawerService } from '@core/services/cart-drawer.service';
import { ToastService } from '@core/services/toast.service';
import { Product } from '@core/interfaces/product';
import { buildWhatsAppUrl } from '@core/constants/contact.constants';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { RatingStarsComponent } from '@shared/molecules/rating-star/rating-stars.component';
import {
  StockState,
  getStockState,
  getStockStateLabel,
} from '@core/utils/stock-state.util';

@Component({
  selector: 'app-purchase-info',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, ButtonComponent, RatingStarsComponent],
  templateUrl: './purchase-info.component.html',
  styleUrls: ['./purchase-info.component.scss'],
})
export class PurchaseInfoComponent {
  @Input({ required: true }) product!: Product;
  @Input() rating = 0;
  @Input() reviewCount = 0;

  private readonly cartService = inject(CartService);
  private readonly cartDrawerService = inject(CartDrawerService);
  private readonly toastService = inject(ToastService);

  quantity = 1;

  get stockState(): StockState {
    return getStockState(this.product.stock);
  }

  get stockStateLabel(): string {
    return getStockStateLabel(this.stockState);
  }

  get isOutOfStock(): boolean {
    return this.stockState === 'out-of-stock';
  }

  increase(): void {
    const max = this.product.stock && this.product.stock > 0 ? this.product.stock : 1;
    this.quantity = Math.min(max, this.quantity + 1);
  }

  decrease(): void {
    this.quantity = Math.max(1, this.quantity - 1);
  }

  addToCart(): void {
    if (this.isOutOfStock) {
      return;
    }

    this.cartService.addToCart(this.product, this.quantity);
    this.toastService.show(
      `${this.product.name} agregado al carrito (x${this.quantity}).`,
      'success',
    );
    this.cartDrawerService.open();
  }

  buyByWhatsApp(): void {
    const message = `Hola, quiero comprar ${this.product.name} (x${this.quantity}).`;
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }
}
