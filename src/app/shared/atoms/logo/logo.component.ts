import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

const SOURCES: Record<string, string> = {
  primary: 'assets/pictures/Tecsisman.png',
  white: 'assets/logos/logo01.png',
  mono: 'assets/logos/logo2.png',
};

@Component({
  selector: 'app-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  @Input() variant: 'primary' | 'white' | 'mono' = 'primary';
  @Input() height = 40;
  @Input() alt = 'Tecsisman';

  get src(): string {
    return SOURCES[this.variant] ?? SOURCES['primary'];
  }
}