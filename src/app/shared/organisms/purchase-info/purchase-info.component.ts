import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from 'src/app/core/services/cart.service';
import { CartDrawerService } from 'src/app/core/services/cart-drawer.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Product } from 'src/app/core/interfaces/product';

@Component({
  selector: 'app-purchase-info',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './purchase-info.component.html',
  styleUrls: ['./purchase-info.component.scss'],
})
export class PurchaseInfoComponent {
  @Input({ required: true }) product!: Product;

  quantity = 1;

  constructor(
    private readonly cartService: CartService,
    private readonly cartDrawerService: CartDrawerService,
    private readonly toastService: ToastService,
  ) {}

  addToCart(): void {
    this.cartService.addToCart(this.product, this.quantity);
    this.toastService.show(
      `${this.product.name} agregado al carrito (x${this.quantity}).`,
      'success',
    );
    this.cartDrawerService.open();
  }

  buyByWhatsApp(): void {
    const message = encodeURIComponent(
      `Hola, quiero comprar ${this.product.name} (x${this.quantity}).`,
    );
    window.open(`https://wa.me/3239900100?text=${message}`, '_blank');
  }
}
