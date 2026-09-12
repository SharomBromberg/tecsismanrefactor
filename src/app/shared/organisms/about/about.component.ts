import { Component } from '@angular/core';

interface AboutValuePoint {
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  readonly imageUrl = '../../../../assets/pictures/team.webp';
  readonly imageAlt = 'Equipo Tecsisman';

  readonly valuePoints: AboutValuePoint[] = [
    {
      title: 'Experiencia real',
      description:
        'Tres años resolviendo infraestructura, redes y seguridad para empresas en Colombia.',
    },
    {
      title: 'A la medida',
      description: 'Cada solución se adapta a tu proceso, no al revés.',
    },
    {
      title: 'Trato directo',
      description:
        'Hablas con quien ejecuta, sin intermediarios ni tickets perdidos.',
    },
  ];
}
