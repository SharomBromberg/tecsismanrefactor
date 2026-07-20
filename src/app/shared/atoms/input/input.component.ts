import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  private static idCounter = 0;
  readonly inputId = `app-input-${InputComponent.idCounter++}`;

  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() customStyle = '';
  @Input() customLabelStyle = '';
  @Input() isDisabled = false; // Corregido: Propiedad declarada para el [disabled]

  @Input() inputValue = '';
  @Output() inputValueChange = new EventEmitter<string>();

  // Corregido: Recibe el objeto Event nativo desde el template para tipado estricto
  getTextInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.inputValue = element.value;
    this.inputValueChange.emit(this.inputValue);
  }
}
