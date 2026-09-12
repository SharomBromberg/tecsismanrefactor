import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';

interface PurchaseStep {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  readonly steps: PurchaseStep[] = [
    {
      number: '01',
      title: 'Arma tu pedido',
      description:
        'Agrega equipos y servicios al carrito. El precio en pesos está siempre a la vista.',
    },
    {
      number: '02',
      title: 'Déjanos tus datos',
      description:
        'Completas envío y contacto en un formulario corto. Toma menos de un minuto.',
    },
    {
      number: '03',
      title: 'Un asesor te acompaña',
      description:
        'Te escribimos por WhatsApp para confirmar disponibilidad, entrega y la forma de pago que prefieras.',
    },
  ];
}
