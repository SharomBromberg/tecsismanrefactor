import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from 'src/app/shared/atoms/icon/icon.component';
import { InputComponent } from 'src/app/shared/atoms/input/input.component';

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
}
