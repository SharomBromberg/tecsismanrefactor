import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '@core/services/cart.service';
import { CartDrawerService } from '@core/services/cart-drawer.service';
import { ToastService } from '@core/services/toast.service';
import { Product } from '@core/interfaces/product';
import { buildWhatsAppUrl } from '@core/constants/contact.constants';

@Component({
  selector: 'app-purchase-info',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './purchase-info.component.html',
  styleUrls: ['./purchase-info.component.scss'],
})
export class PurchaseInfoComponent {
  @Input({ required: true }) product!: Product;

  private readonly cartService = inject(CartService);
  private readonly cartDrawerService = inject(CartDrawerService);
  private readonly toastService = inject(ToastService);

  quantity = 1;

  addToCart(): void {
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
