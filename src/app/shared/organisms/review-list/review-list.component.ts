import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingStarsComponent } from '../../molecules/rating-star/rating-stars.component';
import { CommentRequest } from 'src/app/core/interfaces/comment';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, RatingStarsComponent], // Añadido aquí
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent {
  comments = input.required<CommentRequest[]>();
}
