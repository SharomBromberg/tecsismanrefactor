import { ProductAttributes } from './product';

export interface SelectedLocalImage {
  name: string;
  dataUrl: string;
}

export interface AdminProductCreatePayload {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  images: string[];
  filenames: string[];
  featured: boolean;
  tags: string[];
  attributes: ProductAttributes;
}

export interface AdminProductUpdatePayload extends AdminProductCreatePayload {
  _id: string;
}
