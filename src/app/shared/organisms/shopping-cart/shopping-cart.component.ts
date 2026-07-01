import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { CartService } from 'src/app/core/services/cart.service';
import { CartItem } from 'src/app/core/interfaces/cart-item.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { PurchaseHistoryService } from 'src/app/core/services/purchase-history.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, CurrencyPipe],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent {
  readonly items$ = this.cartService.items$;
  readonly summary$ = this.cartService.summary$;
  checkoutMessage = '';
  checkoutError = '';

  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly purchaseHistoryService: PurchaseHistoryService,
  ) {}

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.product._id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    this.cartService.updateQuantity(item.product._id, item.quantity - 1);
  }

  remove(item: CartItem): void {
    this.cartService.removeFromCart(item.product._id);
  }

  clear(): void {
    this.cartService.clearCart();
    this.checkoutMessage = '';
    this.checkoutError = '';
  }

  checkout(items: CartItem[]): void {
    this.checkoutMessage = '';
    this.checkoutError = '';

    const session = this.authService.currentSession();
    if (!session || session.role !== 'user') {
      this.checkoutError =
        'Debes iniciar sesion como usuario para finalizar la compra.';
      return;
    }

    this.purchaseHistoryService.recordPurchase(
      session.username,
      items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
    );

    this.cartService.clearCart();
    this.checkoutMessage =
      'Compra registrada con exito. Ya puedes calificar estos productos.';
  }
}
