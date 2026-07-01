import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { environment } from '../../environment/environment';
import { Category } from '../interfaces/categories';
import { Product, ProductComment } from '../interfaces/product';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../mocks/product.mocks';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  // Estado Reactivo Pura Vida (Patrón Observable Data Service)
  private readonly categoriesSubject = new BehaviorSubject<Category[]>(
    MOCK_CATEGORIES,
  );
  private readonly productsSubject = new BehaviorSubject<Product[]>(
    MOCK_PRODUCTS,
  );

  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    if (!categoryId || categoryId === 'todos') return this.getProducts();
    return this.productsSubject.pipe(
      map((products) => products.filter((p) => p.categoryId === categoryId)),
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.productsSubject.pipe(
      map((products) => products.filter((p) => p.featured)),
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.productsSubject.pipe(
      map((products) =>
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            (!!p.tags &&
              p.tags.some((t) => t.toLowerCase().includes(lowerQuery))),
        ),
      ),
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.productsSubject.pipe(
      map((products) => products.find((p) => p._id === id)),
    );
  }

  addCategory(name: string): Observable<void> {
    const newCategory: Category = {
      _id: `c${new Date().getTime()}`,
      name,
    };
    this.categoriesSubject.next([...this.categoriesSubject.value, newCategory]);
    return of(undefined);
  }

  deleteCategory(id: string): Observable<void> {
    const filtered = this.categoriesSubject.value.filter((c) => c._id !== id);
    this.categoriesSubject.next(filtered);
    return of(undefined);
  }

  addProduct(product: Partial<Product>): Observable<void> {
    const newProduct: Product = {
      _id: `p${new Date().getTime()}`,
      name: product.name || '',
      description: product.description || '',
      technicalDescription: product.technicalDescription || '',
      price: product.price || 0,
      stock: product.stock || 0,
      categoryId: product.categoryId || '',
      images: product.images || [],
      rating: product.rating || 0,
      comments: [],
      featured: product.featured || false,
      tags: product.tags || [],
      filenames: product.filenames || [],
    };
    this.productsSubject.next([...this.productsSubject.value, newProduct]);
    return of(undefined);
  }

  deleteProduct(id: string): Observable<void> {
    const filtered = this.productsSubject.value.filter((p) => p._id !== id);
    this.productsSubject.next(filtered);
    return of(undefined);
  }

  addComment(productId: string, comment: any): Observable<void> {
    const updated = this.productsSubject.value.map((p) => {
      if (p._id === productId) {
        const newComment: ProductComment = {
          author: comment.author,
          text: comment.message || comment.text, // Adaptado para retrocompatibilidad
          message: comment.message || comment.text,
          rating: comment.rating,
          createdAt: new Date().toISOString(),
        };
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    this.productsSubject.next(updated);
    return of(undefined);
  }
}
