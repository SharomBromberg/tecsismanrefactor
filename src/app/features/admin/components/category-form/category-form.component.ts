import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '@core/interfaces/categories';
import {
  CategoryPayload,
  CategoryUpdatePayload,
} from '@core/interfaces/category.interface';

@Component({
  selector: 'app-admin-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent {
  @Input() categories: Category[] = [];
  @Output() createCategory = new EventEmitter<CategoryPayload>();
  @Output() updateCategory = new EventEmitter<CategoryUpdatePayload>();
  @Output() deleteCategory = new EventEmitter<Category>();

  private readonly fb = new FormBuilder();
  editingCategoryId: string | null = null;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    parentId: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: CategoryPayload = {
      name: raw.name?.trim() ?? '',
      parentId: raw.parentId?.trim() || null,
    };

    if (this.editingCategoryId) {
      this.updateCategory.emit({
        categoryId: this.editingCategoryId,
        ...payload,
      });
    } else {
      this.createCategory.emit(payload);
    }

    this.resetForm();
  }

  edit(category: Category): void {
    this.editingCategoryId = category._id;
    this.form.patchValue({
      name: category.name,
      parentId: category.parentId ?? '',
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  remove(category: Category): void {
    this.deleteCategory.emit(category);
  }

  hasError(errorName: string): boolean {
    const control = this.form.get('name');
    return !!control && control.touched && control.hasError(errorName);
  }

  trackByCategoryId(index: number, category: Category): string {
    return category._id || `${index}`;
  }

  get parentCategoryOptions(): Category[] {
    return this.categories.filter(
      (category) =>
        !category.parentId && category._id !== this.editingCategoryId,
    );
  }

  get submitLabel(): string {
    return this.editingCategoryId ? 'Guardar cambios' : 'Crear categoria';
  }

  get title(): string {
    return this.editingCategoryId ? 'Editar categoria' : 'Crear categoria';
  }

  resolveParentName(category: Category): string {
    if (!category.parentId) {
      return 'Principal';
    }

    return (
      this.categories.find((item) => item._id === category.parentId)?.name ??
      'Subcategoria'
    );
  }

  private resetForm(): void {
    this.editingCategoryId = null;
    this.form.reset({
      name: '',
      parentId: '',
    });
  }
}
