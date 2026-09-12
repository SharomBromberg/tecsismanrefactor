import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';

interface HeroFact {
  value: string;
  label: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
  readonly facts: HeroFact[] = [
    {
      value: '3 años',
      label: 'De experiencia acompañando empresas en Colombia',
    },
    {
      value: '100% a la medida',
      label: 'Cada solución se adapta a tu proceso, no al revés',
    },
    {
      value: 'Trato directo',
      label: 'Hablas con quien ejecuta, sin intermediarios',
    },
  ];
}
