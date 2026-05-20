import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-dating',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dating.component.html',
  styleUrls: ['./dating.component.scss']
})
export class DatingComponent {

}
