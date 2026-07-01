import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../molecules/card/card.component';
import { CardData } from '../../../core/interfaces/card-data.interface';
import { statusClassButton } from '../../../core/interfaces/buttoninterface';

interface ServiceGroup {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  cards: CardData[];
}

@Component({
  selector: 'app-services-showcase',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './services-showcase.component.html',
  styleUrls: ['./services-showcase.component.scss'],
})
export class ServicesShowcaseComponent {
  readonly stack = signal<string[]>([
    'Angular',
    'TypeScript',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'Docker',
  ]);

  readonly serviceGroups = signal<ServiceGroup[]>([
    {
      id: 'development',
      eyebrow: 'Desarrollo web',
      title: 'Experiencias digitales que convierten visitantes en clientes',
      lead: 'Construimos sitios y plataformas con foco en conversion, posicionamiento y operacion eficiente.',
      cards: [
        {
          id: 'dev-corporative',
          title: 'Paginas web corporativas',
          description:
            'Sitios que proyectan credibilidad y comunican valor con claridad para apoyar tus objetivos comerciales.',
          imageUrl: 'assets/pictures/corporativa.jpg',
          imageAlt: 'Paginas web corporativas',
          buttonText: 'Quiero una web corporativa',
          buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
        },
        {
          id: 'dev-ecommerce',
          title: 'Tiendas en linea',
          description:
            'E-commerce optimizado para compra rapida, control de catalogo y crecimiento sostenible de ingresos.',
          imageUrl: 'assets/pictures/ecommerce.jpg',
          imageAlt: 'Tienda en linea',
          buttonText: 'Quiero vender en linea',
          buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
          isHighlighted: true,
          badgeText: 'Alta conversion',
        },
        {
          id: 'dev-content',
          title: 'Blogs y portales de contenido',
          description:
            'Plataformas editoriales para posicionar tu marca, atraer trafico de calidad y generar oportunidades.',
          imageUrl: 'assets/pictures/blogs.jpg',
          imageAlt: 'Blogs y portales',
          buttonText: 'Impulsar mi contenido',
          buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
        },
      ],
    },
    {
      id: 'networks',
      eyebrow: 'Infraestructura y conectividad',
      title: 'Redes estables para operar sin interrupciones',
      lead: 'Implementamos redes seguras y escalables para que tu equipo trabaje con velocidad y continuidad.',
      cards: [
        {
          id: 'network-security',
          title: 'Sistemas de seguridad y monitoreo',
          description:
            'Diseno e instalacion de CCTV, control de acceso y monitoreo para proteger tus activos.',
          imageUrl: 'assets/pictures/seguridad.jpg',
          imageAlt: 'Sistemas de seguridad',
          buttonText: 'Proteger mi operacion',
          buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
          isHighlighted: true,
          badgeText: 'Alta demanda',
        },
        {
          id: 'network-cabling',
          title: 'Cableado estructurado',
          description:
            'Infraestructura ordenada y escalable para mejorar velocidad, estabilidad y mantenimiento.',
          imageUrl: 'assets/pictures/prueba.jpg',
          imageAlt: 'Cableado estructurado',
          buttonText: 'Optimizar mi red',
          buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
        },
      ],
    },
    {
      id: 'support',
      eyebrow: 'Soporte y mantenimiento',
      title: 'Protege tu operacion con soporte tecnico oportuno',
      lead: 'Reducimos tiempos de caida y extendemos la vida util de tus equipos con intervenciones preventivas y correctivas.',
      cards: [
        {
          id: 'support-pc',
          title: 'Mantenimiento de computadores',
          description:
            'Diagnostico, limpieza, optimizacion y reemplazo de componentes para escritorio y portatiles.',
          imageUrl: 'assets/pictures/seguridad.jpg',
          imageAlt: 'Mantenimiento de computadores',
          buttonText: 'Agendar mantenimiento',
          buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
        },
        {
          id: 'support-medical',
          title: 'Mantenimiento de dispositivos medicos',
          description:
            'Atencion preventiva y correctiva con enfoque en continuidad operativa y confiabilidad del equipo.',
          imageUrl: 'assets/pictures/seguridad.jpg',
          imageAlt: 'Mantenimiento de dispositivos medicos',
          buttonText: 'Solicitar soporte tecnico',
          buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
          isHighlighted: true,
          badgeText: 'Especializado',
        },
      ],
    },
  ]);
}
