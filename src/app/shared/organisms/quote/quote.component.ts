import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importamos la molécula (Asegúrate de que la ruta sea correcta según tu proyecto)
import { CardComponent } from '../../molecules/card/card.component';
import { buildWhatsAppUrl } from 'src/app/core/constants/contact.constants';

// Importamos las interfaces
import { CardData } from '../../../core/interfaces/card-data.interface';
import { statusClassButton } from '../../../core/interfaces/buttoninterface';

@Component({
  selector: 'app-quote',
  standalone: true,
  // ¡LA SOLUCIÓN ESTÁ AQUÍ! Debemos importar CardComponent para que el HTML lo reconozca
  imports: [CommonModule, CardComponent],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss',
})
export class QuoteComponent {
  servicesList = signal<CardData[]>([
    {
      id: 'corp',
      title: 'Páginas web corporativas',
      description:
        'Soluciones profesionales para impulsar la identidad digital de tu empresa.',
      imageUrl: '../../../../assets/pictures/corporativa.jpg',
      buttonText: 'Cotizar',
      buttonVariant: statusClassButton.BUTTON_WHITE_OUTLINE,
    },
    {
      id: 'ecommerce',
      title: 'Tiendas en línea',
      description:
        'Plataformas seguras y optimizadas para maximizar tus ventas digitales.',
      imageUrl: '../../../../assets/pictures/ecommerce.jpg',
      buttonText: 'Cotizar',
      buttonVariant: statusClassButton.BUTTON_WHITE_OUTLINE,
    },
    {
      id: 'blogs',
      title: 'Blogs y Portales',
      description:
        'Gestores de contenido robustos para conectar con tu audiencia.',
      imageUrl: '../../../../assets/pictures/blogs.jpg',
      buttonText: 'Cotizar',
      buttonVariant: statusClassButton.BUTTON_WHITE_OUTLINE,
    },
    {
      id: 'landing',
      title: 'Landing Pages',
      description:
        'Páginas de aterrizaje diseñadas estratégicamente para conversiones altas.',
      imageUrl: '../../../../assets/pictures/landing.png',
      buttonText: 'Cotizar',
      buttonVariant: statusClassButton.BUTTON_WHITE_OUTLINE,
    },
    {
      id: 'portfolio',
      title: 'Portafolios Creativos',
      description:
        'Muestra tu trabajo al mundo con diseños únicos y memorables.',
      imageUrl: '../../../../assets/pictures/portfolio.png',
      imageFitContain: true, // Para que esta imagen no se recorte
      buttonText: 'Cotizar',
      buttonVariant: statusClassButton.BUTTON_WHITE_OUTLINE,
    },
  ]);

  handleQuoteClick(serviceId: string | number): void {
    const whatsappUrl = buildWhatsAppUrl(
      `Hola, quiero cotizar el servicio ${serviceId.toString()}.`,
    );
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
