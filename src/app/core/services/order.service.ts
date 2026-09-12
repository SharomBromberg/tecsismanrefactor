import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem, CartSummary } from '../interfaces/cart-item.interface';
import { Order, OrderItem, OrderStatus } from '../interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly storageKey = 'tecsisman_orders';
  private readonly ordersSubject = new BehaviorSubject<Order[]>(
    this.readOrders(),
  );

  readonly orders$ = this.ordersSubject.asObservable();

  createOrder(
    customer: { username: string; displayName: string },
    items: CartItem[],
    summary: CartSummary,
  ): Order {
    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }));

    const now = new Date().toISOString();
    const order: Order = {
      id: `ORD-${Date.now()}`,
      username: customer.username,
      customerDisplayName: customer.displayName,
      items: orderItems,
      subtotal: summary.subtotal,
      tax: summary.tax,
      total: summary.total,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    this.writeOrders([order, ...this.ordersSubject.value]);
    return order;
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    const updated = this.ordersSubject.value.map((order) =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order,
    );
    this.writeOrders(updated);
    return of(undefined);
  }

  private readOrders(): Order[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as Order[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeOrders(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }
}
