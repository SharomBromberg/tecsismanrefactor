import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemsCount: number;
}
