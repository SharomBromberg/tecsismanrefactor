import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from 'src/app/core/interfaces/categories';

@Component({
  selector: 'app-admin-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent {
  @Input() categories: Category[] = [];
  @Output() createCategory = new EventEmitter<string>();
  @Output() deleteCategory = new EventEmitter<Category>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.getRawValue().name?.trim() ?? '';
    this.createCategory.emit(name);
    this.form.reset();
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
}
