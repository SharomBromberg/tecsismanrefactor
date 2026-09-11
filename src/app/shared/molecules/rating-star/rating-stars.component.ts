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
  rating = input<number>(0);
  readOnly = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('lg');

  rated = output<number>();

  selectRating(value: number): void {
    if (this.readOnly()) return;
    this.rated.emit(value);
  }
}