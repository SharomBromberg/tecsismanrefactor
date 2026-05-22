export interface ProductComment {
  author: string;
  text: string;
  rating: number;
  message?: string; // Mantenido por retrocompatibilidad con el HTML actual
  createdAt?: string; // Mantenido por retrocompatibilidad con el HTML actual
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  technicalDescription?: string;
  price: number;
  stock?: number;
  categoryId: string;
  images: string[];
  rating: number;
  comments: ProductComment[];
  featured?: boolean;
  tags?: string[];
  filenames?: string[];
}


export interface CatalogCardVm {
  product: Product;
  categoryName: string;
}
