import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { environment } from '../../environment/environment';
import { Product } from '../interfaces/product';
import { Category } from '../interfaces/categories';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllProducts without category should call /products', () => {
    const mock: Product[] = [];
    service.getAllProducts().subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getAllProducts with category should call /products/category/:cat', () => {
    const mock: Product[] = [];
    service.getAllProducts('abc').subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/products/category/abc`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getProductById should call /products/:id', () => {
    const mock = { name: 'p' } as unknown as Product;
    service.getProductById('1').subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('createProduct should POST FormData to /products/create', () => {
    const fd = new FormData();
    const mock = {} as Product;
    service.createProduct(fd).subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/products/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });

  it('updateProduct should PUT to /products/update/:id', () => {
    const mock = { name: 'p' } as unknown as Product;
    service
      .updateProduct('1', mock)
      .subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/products/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mock);
  });

  it('deleteProduct should DELETE /products/:id', () => {
    const mock = {} as Product;
    service.deleteProduct('1').subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mock);
  });

  it('getProductsByCategory should GET /products/byCategory/:id', () => {
    const mock: Product[] = [];
    service
      .getProductsByCategory('1')
      .subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/products/byCategory/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getAllCategories should GET /categories', () => {
    const mock: Category[] = [];
    service.getAllCategories().subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('createCategory should POST /categories/create', () => {
    const mock = { _id: '1', name: 'c' } as Category;
    service.createCategory(mock).subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/categories/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });

  it('updateCategory should PUT /categories/:id', () => {
    const mock = { _id: '1', name: 'c' } as Category;
    service
      .updateCategory('1', mock)
      .subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/categories/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mock);
  });

  it('deleteCategory should DELETE /categories/:id', () => {
    const mock = { _id: '1', name: 'c' } as Category;
    service.deleteCategory('1').subscribe((res) => expect(res).toEqual(mock));
    const req = http.expectOne(`${environment.apiUrl}/categories/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mock);
  });
});
