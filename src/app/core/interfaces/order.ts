export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  username: string;
  customerDisplayName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  city?: string;
  shippingAddress?: string;
}
