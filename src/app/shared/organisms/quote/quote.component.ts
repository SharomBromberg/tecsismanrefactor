import { Component } from '@angular/core';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss',
})
export class QuoteComponent {
  readonly avatarUrl = '../../../../assets/pictures/team.webp';
  readonly quote =
    'Nos explicaron las reglas de filtrado en lenguaje claro y dejaron todo documentado. El acompañamiento después de la instalación fue lo que más valoramos.';
  readonly author = 'Marcela Ospina';
  readonly role = 'Gerente de operaciones';
}
