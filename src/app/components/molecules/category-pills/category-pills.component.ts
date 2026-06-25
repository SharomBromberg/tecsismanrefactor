import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/core/interfaces/categories';

@Component({
  selector: 'app-category-pills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-pills.component.html',
  styleUrls: ['./category-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPillsComponent {
  // Inputs usando Signals (Angular 17+)
  categories = input<Category[] | null>([]);
  selectedCategoryId = input<string | null>('');

  // Output para avisarle al catálogo qué se seleccionó
  categorySelected = output<string>();

  onSelect(categoryId: string): void {
    this.categorySelected.emit(categoryId);
  }

  // TrackBy para optimizar el rendimiento del @for
  trackByCategoryId(index: number, category: Category): string {
    return category._id ?? `${index}`;
  }
}
