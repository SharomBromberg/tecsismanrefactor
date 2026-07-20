import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importamos la molécula (Asegúrate de que la ruta sea correcta según tu proyecto)
import { CardComponent } from '../../molecules/card/card.component';
import { buildWhatsAppUrl } from '@core/constants/contact.constants';
import {
  QUOTE_SERVICE_IDS,
  SERVICES_FLAT_CARDS,
} from '@core/constants/services-catalog.constants';

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
  servicesList = signal<CardData[]>(
    SERVICES_FLAT_CARDS.filter(
      (service) =>
        typeof service.id === 'string' &&
        QUOTE_SERVICE_IDS.includes(service.id),
    ).map((service) => ({
      ...service,
      buttonText: 'Cotizar',
      buttonVariant: statusClassButton.BUTTON_WHITE_OUTLINE,
    })),
  );

  handleQuoteClick(serviceId: string | number): void {
    const whatsappUrl = buildWhatsAppUrl(
      `Hola, quiero cotizar el servicio ${serviceId.toString()}.`,
    );
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}
