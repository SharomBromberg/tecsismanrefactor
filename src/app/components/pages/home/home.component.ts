import { Component } from '@angular/core';
import { HeroComponent } from '../../organisms/hero/hero.component';
import { AboutComponent } from '../../organisms/about/about.component';
import { BookingComponent } from '../../organisms/booking/booking.component';
import { QuoteComponent } from '../../organisms/quote/quote.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, BookingComponent, QuoteComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
