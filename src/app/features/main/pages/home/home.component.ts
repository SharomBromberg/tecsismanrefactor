import { Component } from '@angular/core';
import { HeroComponent } from '@shared/organisms/hero/hero.component';
import { AboutComponent } from '@shared/organisms/about/about.component';
import { ServicesShowcaseComponent } from '@shared/organisms/services-showcase/services-showcase.component';
import { FeaturedProductsComponent } from '@shared/organisms/featured-products/featured-products.component';
import { QuoteComponent } from '@shared/organisms/quote/quote.component';
import { BookingComponent } from '@shared/organisms/booking/booking.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ServicesShowcaseComponent,
    FeaturedProductsComponent,
    QuoteComponent,
    BookingComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
