import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';
import { RatingStarsComponent } from '../../molecules/rating-star/rating-stars.component'; // Importa la molécula
import { CommentRequest } from 'src/app/core/interfaces/comment';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, RatingStarsComponent],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
})
export class ReviewFormComponent {
  private fb = inject(FormBuilder);
  onSubmit = output<CommentRequest>();

  form = this.fb.nonNullable.group({
    author: ['', [Validators.required, Validators.minLength(2)]],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.form.valid) {
      const comment: CommentRequest = {
        ...this.form.getRawValue(),
        createdAt: new Date(),
      };
      this.onSubmit.emit(comment);
      this.form.reset({ rating: 5 });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
