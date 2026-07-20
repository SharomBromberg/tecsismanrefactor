export interface PurchaseEntry {
  productId: string;
  quantity: number;
  purchasedAt: string;
}

export type PurchaseHistoryByUser = Record<string, PurchaseEntry[]>;
