import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface PurchaseEntry {
  productId: string;
  quantity: number;
  purchasedAt: string;
}

interface PurchaseHistoryByUser {
  [username: string]: PurchaseEntry[];
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseHistoryService {
  private readonly storageKey = 'tecsisman_purchase_history';
  private readonly historySubject = new BehaviorSubject<PurchaseHistoryByUser>(
    this.readHistory(),
  );

  recordPurchase(
    username: string,
    products: Array<{ productId: string; quantity: number }>,
  ): void {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername || products.length === 0) {
      return;
    }

    const history = this.readHistory();
    const currentEntries = history[normalizedUsername] ?? [];

    const newEntries = products
      .filter((item) => !!item.productId && item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        purchasedAt: new Date().toISOString(),
      }));

    history[normalizedUsername] = [...currentEntries, ...newEntries];
    this.writeHistory(history);
    this.historySubject.next(history);
  }

  hasPurchasedProduct(username: string, productId: string): boolean {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername || !productId) {
      return false;
    }

    const history = this.readHistory();
    const entries = history[normalizedUsername] ?? [];
    return entries.some((entry) => entry.productId === productId);
  }

  getUserPurchases(username: string): PurchaseEntry[] {
    const normalizedUsername = this.normalizeUsername(username);
    if (!normalizedUsername) {
      return [];
    }

    const history = this.historySubject.value;
    return [...(history[normalizedUsername] ?? [])].sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
    );
  }

  getUserPurchases$(username: string) {
    const normalizedUsername = this.normalizeUsername(username);
    return this.historySubject.pipe(
      map((history) => {
        if (!normalizedUsername) {
          return [];
        }

        return [...(history[normalizedUsername] ?? [])].sort(
          (a, b) =>
            new Date(b.purchasedAt).getTime() -
            new Date(a.purchasedAt).getTime(),
        );
      }),
    );
  }

  private readHistory(): PurchaseHistoryByUser {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as PurchaseHistoryByUser;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private writeHistory(history: PurchaseHistoryByUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }
}
