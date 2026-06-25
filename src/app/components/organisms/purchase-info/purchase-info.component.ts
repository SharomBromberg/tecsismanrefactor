import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from 'src/app/core/interfaces/product';

@Component({
  selector: 'app-purchase-info',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './purchase-info.component.html',
  styleUrls: ['./purchase-info.component.scss'],
})
export class PurchaseInfoComponent {
  @Input({ required: true }) product!: Product;
}
