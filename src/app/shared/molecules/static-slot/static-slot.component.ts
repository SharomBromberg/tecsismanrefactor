import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-static-slot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './static-slot.component.html',
  styleUrls: ['./static-slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StaticSlotComponent {
  @Input({ required: true }) id!: string;
  @Input() alt: string = '';
  @Input() compact: boolean = false;

  readonly url = signal<string | null>(null);
}
