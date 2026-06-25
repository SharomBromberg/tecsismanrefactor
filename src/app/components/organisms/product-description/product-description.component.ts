import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-description',
  standalone: true,
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss'],
})
export class ProductDescriptionComponent {
  @Input({ required: true }) description!: string;
}
