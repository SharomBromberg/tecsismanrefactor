import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../molecules/card/card.component';
import { CardData } from '../../../core/interfaces/card-data.interface';
import { statusClassButton } from '../../../core/interfaces/buttoninterface';
import { buildWhatsAppUrl } from 'src/app/core/constants/contact.constants';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  // Transformamos tus datos para que encajen perfectamente en la molécula Card
  appointmentServices = signal<CardData[]>([
    {
      id: 'mantenimiento',
      title: 'Mantenimiento preventivo/correctivo',
      description:
        'Agenda una revisión técnica experta para optimizar el rendimiento y alargar la vida útil de tus equipos.', // Añadí un texto dummy para que la tarjeta no quede vacía
      imageUrl: '../../../../assets/pictures/manteinance.jpg',
      imageAlt: 'Mantenimiento preventivo y correctivo',
      buttonText: 'Programar',
      buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
    },
    {
      id: 'redes',
      title: 'Instalación de redes',
      description:
        'Diseño e implementación de redes empresariales estructuradas para garantizar conectividad estable y veloz.',
      imageUrl: '../../../../assets/pictures/prueba.jpg',
      imageAlt: 'Instalación de redes empresariales',
      buttonText: 'Programar',
      buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
    },
    {
      id: 'seguridad',
      title: 'Sistemas de seguridad',
      description:
        'Protege tu negocio con nuestros sistemas avanzados de videovigilancia y control de acceso.',
      imageUrl: '../../../../assets/pictures/safenetwork.jpg',
      imageAlt: 'Instalación de sistemas de seguridad',
      buttonText: 'Programar',
      buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
    },
  ]);

  // Esta función intercepta el evento (click) de la molécula Card
  handleBookingClick(serviceId: string | number): void {
    const whatsappUrl = buildWhatsAppUrl(
      `Hola, quiero agendar el servicio ${serviceId.toString()}.`,
    );
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
