import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a numeric rating into an array of indices for rendering star display.
 *
 * Usage:
 *   @for (star of comment.rating | appRatingStars) {
 *     <span aria-hidden="true">★</span>
 *   }
 *
 * Example:
 *   5 | appRatingStars → [0, 1, 2, 3, 4]
 *   3.7 | appRatingStars → [0, 1, 2, 3] (rounds to 4)
 */
@Pipe({
  name: 'appRatingStars',
  standalone: true,
})
export class RatingStarsPipe implements PipeTransform {
  /**
   * Converts a rating number into an array of star indices
   * @param rating - Numeric rating value (e.g., 4.5)
   * @returns Array of indices [0, 1, 2, 3, 4] for rendering stars
   */
  transform(rating: number): number[] {
    const roundedRating = Math.round(rating);
    return Array.from({ length: roundedRating }, (_, index) => index);
  }
}
