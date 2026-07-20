import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { environment } from '../../environment/environment';
import { Category } from '../interfaces/categories';
import { Product, ProductComment } from '../interfaces/product';
import { CommentRequest } from '../interfaces/comment';
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

  addCategory(name: string, parentId?: string | null): Observable<void> {
    const newCategory: Category = {
      _id: `c${new Date().getTime()}`,
      name,
      parentId: parentId ?? null,
    };
    this.categoriesSubject.next([...this.categoriesSubject.value, newCategory]);
    return of(undefined);
  }

  updateCategory(
    id: string,
    payload: Pick<Category, 'name' | 'parentId'>,
  ): Observable<void> {
    const updated = this.categoriesSubject.value.map((category) =>
      category._id === id
        ? {
            ...category,
            name: payload.name,
            parentId: payload.parentId ?? null,
          }
        : category,
    );
    this.categoriesSubject.next(updated);
    return of(undefined);
  }

  deleteCategory(id: string): Observable<void> {
    const removedIds = new Set<string>([id]);
    this.categoriesSubject.value.forEach((category) => {
      if (category.parentId === id) {
        removedIds.add(category._id);
      }
    });

    const filtered = this.categoriesSubject.value.filter(
      (c) => !removedIds.has(c._id),
    );
    this.categoriesSubject.next(filtered);

    const normalizedProducts = this.productsSubject.value.map((product) =>
      removedIds.has(product.categoryId)
        ? { ...product, categoryId: '' }
        : product,
    );
    this.productsSubject.next(normalizedProducts);
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

  updateProduct(
    productId: string,
    payload: Partial<Product>,
  ): Observable<void> {
    const updated = this.productsSubject.value.map((product) =>
      product._id === productId
        ? {
            ...product,
            ...payload,
            _id: product._id,
          }
        : product,
    );
    this.productsSubject.next(updated);
    return of(undefined);
  }

  deleteProduct(id: string): Observable<void> {
    const filtered = this.productsSubject.value.filter((p) => p._id !== id);
    this.productsSubject.next(filtered);
    return of(undefined);
  }

  setProductFeatured(productId: string, featured: boolean): Observable<void> {
    const updated = this.productsSubject.value.map((product) =>
      product._id === productId ? { ...product, featured } : product,
    );
    this.productsSubject.next(updated);
    return of(undefined);
  }

  addComment(productId: string, comment: CommentRequest): Observable<void> {
    const updated = this.productsSubject.value.map((p) => {
      if (p._id === productId) {
        const newComment: ProductComment = {
          author: comment.author,
          text: comment.message,
          message: comment.message,
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
