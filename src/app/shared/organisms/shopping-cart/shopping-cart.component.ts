import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '@core/services/cart.service';
import { CartItem } from '@core/interfaces/cart-item.interface';
import { AuthService } from '@core/services/auth.service';
import { OrderService } from '@core/services/order.service';
import { PurchaseHistoryService } from '@core/services/purchase-history.service';
import { Order } from '@core/interfaces/order';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { IconComponent } from '@shared/atoms/icon/icon.component';

export interface ShippingForm {
  nombre: string;
  documento: string;
  correo: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  detalle: string;
  notas: string;
  entrega: 'domicilio' | 'tienda';
}

const TECSISMAN_WHATSAPP = '573163202647';
const TECSISMAN_EMAIL = 'administración@tecsisman.com';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AsyncPipe,
    CurrencyPipe,
    FormsModule,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly purchaseHistoryService = inject(PurchaseHistoryService);
  private readonly router = inject(Router);

  readonly items$ = this.cartService.items$;
  readonly summary$ = this.cartService.summary$;

  form: ShippingForm = {
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    ciudad: 'Bogotá D.C.',
    direccion: '',
    detalle: '',
    notas: '',
    entrega: 'domicilio',
  };

  touched = false;
  isSubmitted = false;
  submissionChannel: 'whatsapp' | 'email' | 'online' = 'whatsapp';
  submittedOrder: Order | null = null;
  checkoutMessage = '';
  checkoutError = '';

  ngOnInit(): void {
    const session = this.authService.currentSession();
    if (session) {
      if (session.displayName) {
        this.form.nombre = session.displayName;
      }
      if (session.username && session.username.includes('@')) {
        this.form.correo = session.username;
      }
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isLoggedIn('user');
  }

  getShippingCost(subtotal: number): number {
    if (this.form.entrega === 'tienda' || subtotal === 0) {
      return 0;
    }
    return subtotal >= 2000000 ? 0 : 25000;
  }

  getTotal(subtotal: number): number {
    return subtotal + this.getShippingCost(subtotal);
  }

  setDelivery(type: 'domicilio' | 'tienda'): void {
    this.form.entrega = type;
  }

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.product._id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product._id, item.quantity - 1);
    } else {
      this.remove(item);
    }
  }

  remove(item: CartItem): void {
    this.cartService.removeFromCart(item.product._id);
  }

  clear(): void {
    this.cartService.clearCart();
    this.checkoutMessage = '';
    this.checkoutError = '';
    this.touched = false;
  }

  validate(): boolean {
    this.touched = true;
    if (
      !this.form.nombre.trim() ||
      !this.form.documento.trim() ||
      !this.form.correo.trim() ||
      !this.form.telefono.trim() ||
      !this.form.ciudad.trim()
    ) {
      return false;
    }

    if (this.form.entrega === 'domicilio' && !this.form.direccion.trim()) {
      return false;
    }

    return true;
  }

  isFieldInvalid(fieldName: keyof ShippingForm): boolean {
    if (!this.touched) return false;
    if (fieldName === 'direccion' && this.form.entrega !== 'domicilio') {
      return false;
    }
    const val = this.form[fieldName];
    return typeof val === 'string' ? val.trim().length === 0 : false;
  }

  private createOrderRecord(
    items: CartItem[],
    subtotal: number,
    channel: 'whatsapp' | 'email' | 'online',
  ): Order {
    const shipping = this.getShippingCost(subtotal);
    const total = subtotal + shipping;
    const session = this.authService.currentSession();

    const username = session?.username || this.form.correo || 'guest';
    const displayName =
      session?.displayName || this.form.nombre || 'Cliente Tecsisman';

    if (session?.username) {
      this.purchaseHistoryService.recordPurchase(
        session.username,
        items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      );
    }

    const order = this.orderService.createOrder(
      { username, displayName },
      items,
      {
        subtotal,
        tax: subtotal * 0.19,
        total,
        itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
      },
    );

    return order;
  }

  private buildSummaryMessage(
    items: CartItem[],
    subtotal: number,
    shipping: number,
    total: number,
  ): string {
    const currencyFmt = (n: number) =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(n);

    const lines: string[] = ['*Nuevo Pedido — Tecsisman*', ''];

    items.forEach((i) => {
      const itemSubtotal = i.product.price * i.quantity;
      lines.push(`• ${i.quantity} × ${i.product.name} — ${currencyFmt(itemSubtotal)}`);
    });

    lines.push('');
    lines.push(`Subtotal: ${currencyFmt(subtotal)}`);
    lines.push(`Envío: ${shipping === 0 ? 'Sin costo (Gratis)' : currencyFmt(shipping)}`);
    lines.push(`*Total a pagar: ${currencyFmt(total)}*`);
    lines.push('');
    lines.push('*Datos del cliente:*');
    lines.push(`Nombre: ${this.form.nombre}`);
    lines.push(`Documento / NIT: ${this.form.documento}`);
    lines.push(`Correo: ${this.form.correo}`);
    lines.push(`Teléfono: ${this.form.telefono}`);
    lines.push(`Modalidad de entrega: ${this.form.entrega === 'tienda' ? 'Recoge en tienda (Bogotá D.C.)' : 'Envío a domicilio'}`);
    lines.push(`Ciudad: ${this.form.ciudad}`);

    if (this.form.entrega === 'domicilio') {
      const dir = this.form.direccion + (this.form.detalle ? ` (${this.form.detalle})` : '');
      lines.push(`Dirección: ${dir}`);
    }

    if (this.form.notas.trim()) {
      lines.push(`Notas adicionales: ${this.form.notas.trim()}`);
    }

    return lines.join('\n');
  }

  sendWhatsApp(items: CartItem[], subtotal: number): void {
    if (!this.validate()) {
      this.checkoutError = 'Por favor completa los datos obligatorios marcados en rojo.';
      return;
    }

    const shipping = this.getShippingCost(subtotal);
    const total = subtotal + shipping;
    const text = this.buildSummaryMessage(items, subtotal, shipping, total);

    const order = this.createOrderRecord(items, subtotal, 'whatsapp');
    this.submittedOrder = order;
    this.submissionChannel = 'whatsapp';
    this.isSubmitted = true;
    this.checkoutError = '';

    const waUrl = `https://wa.me/${TECSISMAN_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    this.cartService.clearCart();
  }

  sendEmail(items: CartItem[], subtotal: number): void {
    if (!this.validate()) {
      this.checkoutError = 'Por favor completa los datos obligatorios marcados en rojo.';
      return;
    }

    const shipping = this.getShippingCost(subtotal);
    const total = subtotal + shipping;
    const text = this.buildSummaryMessage(items, subtotal, shipping, total);

    const order = this.createOrderRecord(items, subtotal, 'email');
    this.submittedOrder = order;
    this.submissionChannel = 'email';
    this.isSubmitted = true;
    this.checkoutError = '';

    const subject = `Nuevo pedido ${order.id} — ${this.form.nombre}`;
    const mailtoUrl = `mailto:${TECSISMAN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.open(mailtoUrl, '_blank', 'noopener,noreferrer');

    this.cartService.clearCart();
  }

  sendOnline(items: CartItem[], subtotal: number): void {
    if (!this.validate()) {
      this.checkoutError = 'Por favor completa los datos obligatorios marcados en rojo.';
      return;
    }

    const order = this.createOrderRecord(items, subtotal, 'online');
    this.submittedOrder = order;
    this.submissionChannel = 'online';
    this.isSubmitted = true;
    this.checkoutError = '';
    this.cartService.clearCart();
  }

  resetOrder(): void {
    this.isSubmitted = false;
    this.submittedOrder = null;
    this.touched = false;
    this.checkoutMessage = '';
    this.checkoutError = '';
  }
}
