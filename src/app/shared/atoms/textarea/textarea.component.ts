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
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  private static idCounter = 0;
  readonly inputId = `app-textarea-${TextareaComponent.idCounter++}`;

  @Input() label = '';
  @Input() placeholder = '';
  @Input() customStyle = '';
  @Input() customLabelStyle = '';
  @Input() isDisabled = false;
  @Input() hasError = false;
  @Input() rows = 5;

  @Input() inputValue = '';
  @Output() inputValueChange = new EventEmitter<string>();

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  getTextInput(event: Event): void {
    const element = event.target as HTMLTextAreaElement;
    this.inputValue = element.value;
    this.inputValueChange.emit(this.inputValue);
    this.onChange(this.inputValue);
    this.onTouched();
  }

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
