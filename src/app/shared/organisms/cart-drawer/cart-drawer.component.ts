import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PurchaseHistoryService } from 'src/app/core/services/purchase-history.service';
import { CartDrawerService } from 'src/app/core/services/cart-drawer.service';
import { CartItem } from 'src/app/core/interfaces/cart-item.interface';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AsyncPipe,
    CurrencyPipe,
    IconComponent,
    ButtonComponent,
  ],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss'],
})
export class CartDrawerComponent implements OnDestroy {
  readonly isOpen$ = this.cartDrawerService.isOpen$;
  readonly items$ = this.cartService.items$;
  readonly summary$ = this.cartService.summary$;
  isOpen = false;

  checkoutMessage = '';
  checkoutError = '';

  private readonly openStateSub: Subscription;

  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly purchaseHistoryService: PurchaseHistoryService,
    private readonly cartDrawerService: CartDrawerService,
  ) {
    this.openStateSub = this.isOpen$.subscribe((isOpen) => {
      this.isOpen = isOpen;
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  ngOnDestroy(): void {
    this.openStateSub.unsubscribe();
    document.body.style.overflow = '';
  }

  close(): void {
    this.cartDrawerService.close();
  }

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
