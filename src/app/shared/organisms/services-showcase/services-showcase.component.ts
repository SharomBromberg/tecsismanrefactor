import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../molecules/card/card.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import {
  SERVICES_GROUPS,
  SERVICES_TECH_STACK,
  ServiceGroupData,
} from '../../../core/constants/services-catalog.constants';
import { statusClassButton } from '../../../core/interfaces/buttoninterface';

interface HomeTeaserService {
  id: string;
  number: string;
  title: string;
  text: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
}

@Component({
  selector: 'app-services-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  templateUrl: './services-showcase.component.html',
  styleUrls: ['./services-showcase.component.scss'],
})
export class ServicesShowcaseComponent {
  /**
   * 'full': grid completo de tarjetas por grupo (usado en /servicios).
   * 'home-teaser': lista compacta numerada con thumbnail (usada en Home).
   */
  @Input() variant: 'full' | 'home-teaser' = 'full';

  readonly stack = signal<string[]>(SERVICES_TECH_STACK);
  readonly serviceGroups = signal<ServiceGroupData[]>(
    SERVICES_GROUPS.map((group) => {
      if (group.id !== 'mantenimiento-soporte') {
        return group;
      }

      return {
        ...group,
        cards: [
          {
            id: 'mantenimiento-preventivo',
            title: 'Mantenimiento preventivo',
            description:
              'Revisiones programadas para anticipar fallas, mejorar rendimiento y alargar la vida util de tus equipos.',
            imageUrl: 'assets/pictures/manteinance.jpg',
            imageAlt: 'Mantenimiento preventivo',
            buttonText: 'Programar servicio',
            buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
            isHighlighted: true,
            badgeText: 'Recomendado',
          },
          {
            id: 'mantenimiento-correctivo',
            title: 'Mantenimiento correctivo',
            description:
              'Intervencion tecnica para resolver fallas y recuperar operacion con tiempos de respuesta efectivos.',
            imageUrl: 'assets/pictures/seguridad.jpg',
            imageAlt: 'Mantenimiento correctivo',
            buttonText: 'Programar servicio',
            buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
          },
          {
            id: 'mantenimiento-diagnostico',
            title: 'Diagnostico tecnico',
            description:
              'Evaluacion detallada de hardware, red y configuraciones para definir acciones de mejora con precision.',
            imageUrl: 'assets/pictures/prueba.jpg',
            imageAlt: 'Diagnostico tecnico',
            buttonText: 'Programar servicio',
            buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
          },
        ],
      };
    }),
  );

  /**
   * Vista derivada de serviceGroups() para el teaser de Home: un item por
   * grupo (no duplica el contenido de SERVICES_GROUPS, solo lo resume).
   */
  readonly homeTeaserServices = computed<HomeTeaserService[]>(() =>
    this.serviceGroups().map((group, index) => ({
      id: group.id,
      number: String(index + 1).padStart(2, '0'),
      title: group.eyebrow,
      text: group.lead,
      thumbnailUrl: group.cards[0]?.imageUrl ?? '',
      thumbnailAlt: group.cards[0]?.imageAlt ?? group.eyebrow,
    })),
  );
}
