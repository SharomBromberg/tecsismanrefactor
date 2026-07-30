import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
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

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  // Corregido: Recibe el objeto Event nativo desde el template para tipado estricto
  getTextInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.inputValue = element.value;
    this.inputValueChange.emit(this.inputValue);
    this.onChange(this.inputValue);
    this.onTouched();
  }

  // ControlValueAccessor — permite usar [formControl]/[(ngModel)] desde fuera
  writeValue(value: string): void {
    this.inputValue = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
