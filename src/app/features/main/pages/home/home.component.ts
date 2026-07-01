import { Component } from '@angular/core';
import { HeroComponent } from 'src/app/shared/organisms/hero/hero.component';
import { AboutComponent } from 'src/app/shared/organisms/about/about.component';
import { BookingComponent } from 'src/app/shared/organisms/booking/booking.component';
import { QuoteComponent } from 'src/app/shared/organisms/quote/quote.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, BookingComponent, QuoteComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
