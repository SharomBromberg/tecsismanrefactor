import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/atoms/button/button.component';
import { CardComponent } from '../../../../shared/molecules/card/card.component';
import {
  PREMIUM_SERVICES,
  PremiumServiceData,
  SERVICES_GROUPS,
  ServiceGroupData,
} from '../../../../core/constants/services-catalog.constants';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {
  private readonly router = inject(Router);

  readonly services: PremiumServiceData[] = PREMIUM_SERVICES;
  readonly serviceGroups: ServiceGroupData[] = SERVICES_GROUPS;

  requestQuote(serviceName?: string): void {
    void this.router.navigate(['/Contacto'], {
      queryParams: serviceName ? { service: serviceName } : {},
    });
  }

  onCardAction(serviceId: string | number): void {
    void this.router.navigate(['/Contacto'], {
      queryParams: { service: serviceId },
    });
  }
}
