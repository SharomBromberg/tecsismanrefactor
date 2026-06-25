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
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() customStyle: string = '';
  @Input() customLabelStyle: string = '';
  @Input() isDisabled: boolean = false; // Corregido: Propiedad declarada para el [disabled]

  @Input() inputValue: string = '';
  @Output() inputValueChange = new EventEmitter<string>();

  // Corregido: Recibe el objeto Event nativo desde el template para tipado estricto
  getTextInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.inputValue = element.value;
    this.inputValueChange.emit(this.inputValue);
  }
}
