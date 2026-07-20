import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss'],
})
export class RatingStarsComponent {
  // Recibe la calificación actual
  rating = input<number>(0);

  // Emite el cambio al componente padre (el formulario)
  rated = output<number>();

  selectRating(value: number): void {
    this.rated.emit(value);
  }
}
