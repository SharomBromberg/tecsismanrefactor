import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AdminProductCreatePayload,
  SelectedLocalImage,
} from 'src/app/core/interfaces/admin-product-form.interface';
import { Category } from 'src/app/core/interfaces/categories';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  @Input() categories: Category[] = [];
  @Output() createProduct = new EventEmitter<AdminProductCreatePayload>();

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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const manualImageUrl = raw.imageUrl?.trim() ?? '';
    const localImageUrls = this.selectedLocalImages.map(
      (image) => image.dataUrl,
    );
    const mergedImages = manualImageUrl
      ? [...localImageUrls, manualImageUrl]
      : localImageUrls;

    const parsedTags = (raw.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    this.createProduct.emit({
      name: raw.name ?? '',
      description: raw.description ?? '',
      categoryId: raw.categoryId ?? '',
      price: Number(raw.price ?? 0),
      stock: Number(raw.stock ?? 0),
      images: mergedImages,
      filenames: this.selectedLocalImages.map((image) => image.name),
      featured: !!raw.featured,
      tags: parsedTags,
    });

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

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.readAsDataURL(file);
    });
  }
}
