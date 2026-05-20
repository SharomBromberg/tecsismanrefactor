import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() customStyle: string = '';
  @Input() variant: 'primary' | 'outline' | 'light' | 'dark' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() block: boolean = false;
  @Input() disabled: boolean = false;

  get classes(): string {
    const base: string[] = ['app-btn'];
    switch (this.variant) {
      case 'primary': base.push('app-btn--primary'); break;
      case 'outline': base.push('app-btn--outline'); break;
      case 'light': base.push('app-btn--light'); break;
      case 'dark': base.push('app-btn--dark'); break;
    }
    switch (this.size) {
      case 'lg': base.push('app-btn--lg'); break;
      case 'sm': base.push('app-btn--sm'); break;
    }
    if (this.block) base.push('app-btn--block');
    if (this.customStyle) base.push(this.customStyle);
    return base.join(' ');
  }
}
