import { Component } from '@angular/core';
import { HeroComponent } from '@shared/organisms/hero/hero.component';
import { AboutComponent } from '@shared/organisms/about/about.component';
import { BookingComponent } from '@shared/organisms/booking/booking.component';
import { FeaturedProductsComponent } from '@shared/organisms/featured-products/featured-products.component';
import { QuoteComponent } from '@shared/organisms/quote/quote.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    FeaturedProductsComponent,
    BookingComponent,
    QuoteComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
