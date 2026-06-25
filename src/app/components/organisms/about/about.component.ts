import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../molecules/card/card.component';
import { CardData } from '../../../core/interfaces/card-data.interface';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  aboutItems: CardData[] = [
    {
      id: 'team',
      title: 'Nuestro equipo',
      description:
        'Contamos con un equipo altamente capacitado y comprometido, listo para abordar tus necesidades de manera ágil y eficiente. Nuestra prioridad es brindarte soluciones efectivas y satisfactorias.',
      imageUrl: '../../../../assets/pictures/team.webp',
      imageAlt: 'Equipo de TECSISMAN',
    },
    {
      id: 'history',
      title: '¿Por qué elegirnos?',
      description:
        'Somos apasionados por la tecnología y la excelencia. Con una visión centrada en el cliente, elevamos tu presencia digital al siguiente nivel con soluciones a medida.',
      imageUrl: '../../../../assets/pictures/history.webp',
      imageAlt: 'Razones para elegir TECSISMAN',
    },
    {
      id: 'skills',
      title: 'Nuestras Especialidades',
      description:
        'Desarrollo web a medida, instalación de redes y sistemas de seguridad, y venta de tecnología. Todo lo que necesitas en un solo lugar.',
      imageUrl: '../../../../assets/pictures/skills.webp',
      imageAlt: 'Especialidades de TECSISMAN',
    },
  ];
}
