import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input() eyebrow!: string;
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() ariaLabel = 'Cabecera de página';
}