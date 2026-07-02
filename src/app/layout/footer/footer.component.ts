import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  buildWhatsAppUrl,
  WHATSAPP_DISPLAY_NUMBER,
} from 'src/app/core/constants/contact.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  readonly whatsappNumber = WHATSAPP_DISPLAY_NUMBER;
  readonly whatsappUrl = buildWhatsAppUrl();
}
