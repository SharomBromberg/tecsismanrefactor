import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGalleryComponent {
  images = input.required<string[]>();
  name = input.required<string>();

  selectedImageIndex = 0;

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
}
