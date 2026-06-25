import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CardData } from '../../../core/interfaces/card-data.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input({ required: true }) data!: CardData;

  @Output() actionClick = new EventEmitter<string | number>();

  onActionClick(): void {
    this.actionClick.emit(this.data.id);
  }
}
