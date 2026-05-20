import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-quotate',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './quotate.component.html',
  styleUrls: ['./quotate.component.scss']
})
export class QuotateComponent {

}
