import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({ 
  selector: 'app-button, button[app-button], a[app-button]',
  standalone: true, 
  template: '<ng-content></ng-content>', 
  styleUrl: './button.component.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush, 
  encapsulation: ViewEncapsulation.None 
}) 
export class ButtonComponent {} 
