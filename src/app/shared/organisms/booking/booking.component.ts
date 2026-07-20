import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../molecules/card/card.component';
import { CardData } from '../../../core/interfaces/card-data.interface';
import { statusClassButton } from '../../../core/interfaces/buttoninterface';
import { buildWhatsAppUrl } from '@core/constants/contact.constants';
import {
  BOOKING_SERVICE_IDS,
  SERVICES_FLAT_CARDS,
} from '@core/constants/services-catalog.constants';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  appointmentServices = signal<CardData[]>(
    SERVICES_FLAT_CARDS.filter(
      (service) =>
        typeof service.id === 'string' &&
        BOOKING_SERVICE_IDS.includes(service.id),
    ).map((service) => ({
      ...service,
      buttonText: 'Programar',
      buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
    })),
  );

  handleBookingClick(serviceId: string | number): void {
    const whatsappUrl = buildWhatsAppUrl(
      `Hola, quiero agendar el servicio ${serviceId.toString()}.`,
    );
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
