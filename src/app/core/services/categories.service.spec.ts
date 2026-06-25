import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories.service';
import { environment } from '../../environment/environment';
import { Category } from '../interfaces/categories';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CategoriesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
