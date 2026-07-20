import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AdminProductCreatePayload,
  AdminProductUpdatePayload,
  SelectedLocalImage,
} from '@core/interfaces/admin-product-form.interface';
import { Category } from '@core/interfaces/categories';
import { Product } from '@core/interfaces/product';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() product: Product | null = null;
  @Output() createProduct = new EventEmitter<AdminProductCreatePayload>();
  @Output() updateProduct = new EventEmitter<AdminProductUpdatePayload>();
  @Output() cancelEdit = new EventEmitter<void>();

  private readonly fb = new FormBuilder();
  selectedLocalImages: SelectedLocalImage[] = [];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(12)]],
    categoryId: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [1, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    tags: [''],
    featured: [false],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if ('product' in changes) {
      this.syncFormWithProduct();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const manualImageUrls = (raw.imageUrl ?? '')
      .split(/[\n,]+/)
      .map((value) => value.trim())
      .filter(Boolean);
    const localImageUrls = this.selectedLocalImages.map(
      (image) => image.dataUrl,
    );
    const mergedImages = [...localImageUrls, ...manualImageUrls];

    const parsedTags = (raw.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload: AdminProductCreatePayload = {
      name: raw.name ?? '',
      description: raw.description ?? '',
      categoryId: raw.categoryId ?? '',
      price: Number(raw.price ?? 0),
      stock: Number(raw.stock ?? 0),
      images: mergedImages,
      filenames: this.selectedLocalImages.map((image) => image.name),
      featured: !!raw.featured,
      tags: parsedTags,
    };

    if (this.product) {
      this.updateProduct.emit({
        _id: this.product._id,
        ...payload,
      });
    } else {
      this.createProduct.emit(payload);
    }

    this.resetForm();
  }

  async onLocalImagesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files?.length) {
      return;
    }

    const validImages = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    );

    const encoded = await Promise.all(
      validImages.map(async (file) => ({
        name: file.name,
        dataUrl: await this.fileToDataUrl(file),
      })),
    );

    this.selectedLocalImages = [...this.selectedLocalImages, ...encoded];
    input.value = '';
  }

  removeLocalImage(index: number): void {
    this.selectedLocalImages = this.selectedLocalImages.filter(
      (_, currentIndex) => currentIndex !== index,
    );
  }

  hasError(
    controlName: keyof ReturnType<typeof this.form.getRawValue>,
    errorName: string,
  ): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category._id || `${index}`;
  }

  handleCancelEdit(): void {
    this.resetForm();
    this.cancelEdit.emit();
  }

  get isEditing(): boolean {
    return !!this.product;
  }

  get title(): string {
    return this.isEditing ? 'Editar producto' : 'Crear producto';
  }

  get submitLabel(): string {
    return this.isEditing ? 'Guardar cambios' : 'Guardar producto';
  }

  get categoryOptions(): Category[] {
    const topLevel = this.categories.filter((category) => !category.parentId);
    const subcategories = this.categories.filter(
      (category) => !!category.parentId,
    );
    return [...topLevel, ...subcategories];
  }

  resolveCategoryLabel(category: Category): string {
    if (!category.parentId) {
      return category.name;
    }

    const parent = this.categories.find(
      (item) => item._id === category.parentId,
    );
    return `${parent?.name ?? 'Subcategoria'} / ${category.name}`;
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.readAsDataURL(file);
    });
  }

  private syncFormWithProduct(): void {
    if (!this.product) {
      this.resetForm();
      return;
    }

    this.selectedLocalImages = [];
    this.form.reset({
      name: this.product.name,
      description: this.product.description,
      categoryId: this.product.categoryId,
      price: this.product.price,
      stock: this.product.stock ?? 0,
      imageUrl: this.product.images.join(', '),
      tags: (this.product.tags ?? []).join(', '),
      featured: !!this.product.featured,
    });
  }

  private resetForm(): void {
    this.selectedLocalImages = [];
    this.form.reset({
      name: '',
      description: '',
      categoryId: '',
      price: 0,
      stock: 1,
      imageUrl: '',
      tags: '',
      featured: false,
    });
  }
}
