import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {}
