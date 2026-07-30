import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@shared/atoms/icon/icon.component';
import { InputComponent } from '@shared/atoms/input/input.component';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, IconComponent],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  // Recibimos el FormControl directamente del padre
  control = input.required<FormControl<string>>();

  // Hacemos el placeholder dinámico por si quieres reusarlo en otro lado
  placeholder = input<string>('Buscar productos, marcas y más...');

  // Variante del átomo app-input a usar ('dark-00' para fondos oscuros,
  // 'light-00' para fondos blancos como el topbar del catálogo)
  variant = input<'dark-00' | 'light-00'>('dark-00');
}
