import { Category } from '@core/interfaces/categories';
import { Product } from '@core/interfaces/product';
import { CATEGORIES, PRODUCTS } from '../constants/products.constants';

export const MOCK_CATEGORIES: Category[] = CATEGORIES.map((c) => ({
  _id: c.id,
  name: c.name,
}));

export const MOCK_PRODUCTS: Product[] = PRODUCTS;
