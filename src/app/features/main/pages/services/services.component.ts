import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { ServicesShowcaseComponent } from '@shared/organisms/services-showcase/services-showcase.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, ButtonComponent, ServicesShowcaseComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {}
