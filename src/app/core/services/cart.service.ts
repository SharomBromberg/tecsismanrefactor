import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem, CartSummary } from '../interfaces/cart-item.interface';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'tecsisman_cart';
  private readonly taxRate = 0.19;

  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(
    this.readStoredItems(),
  );

  readonly items$ = this.itemsSubject.asObservable();

  readonly summary$ = this.items$.pipe(
    map((items) => {
      const subtotal = items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      );
      const tax = subtotal * this.taxRate;
      const total = subtotal + tax;
      const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

      const summary: CartSummary = { subtotal, tax, total, itemsCount };
      return summary;
    }),
  );

  addToCart(product: Product, quantity = 1): void {
    if (quantity <= 0) {
      return;
    }

    const current = this.itemsSubject.value;
    const existingIndex = current.findIndex(
      (item) => item.product._id === product._id,
    );

    let updated: CartItem[];

    if (existingIndex >= 0) {
      updated = current.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      updated = [...current, { product, quantity }];
    }

    this.writeItems(updated);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updated = this.itemsSubject.value.map((item) =>
      item.product._id === productId ? { ...item, quantity } : item,
    );
    this.writeItems(updated);
  }

  removeFromCart(productId: string): void {
    const updated = this.itemsSubject.value.filter(
      (item) => item.product._id !== productId,
    );
    this.writeItems(updated);
  }

  clearCart(): void {
    this.writeItems([]);
  }

  private readStoredItems(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      return parsed.filter((item) => !!item.product?._id && item.quantity > 0);
    } catch {
      return [];
    }
  }

  private writeItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
