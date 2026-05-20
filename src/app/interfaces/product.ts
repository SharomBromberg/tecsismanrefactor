import { Category } from "./categories";

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: Category;  // Utilizando la interfaz Category directamente
  filenames: string[];
  createdAt?: Date;
  updatedAt?: Date;
}