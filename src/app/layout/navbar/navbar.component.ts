import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { MenuElement } from '../../core/interfaces/menu';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/atoms/icon/icon.component';
import { CartService } from '../../core/services/cart.service';
import { CartDrawerService } from '../../core/services/cart-drawer.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly cartDrawerService = inject(CartDrawerService);

  menuElements: MenuElement[] = [
    { title: 'Inicio', route: '/Inicio' },
    { title: 'Servicios', route: '/Servicios' },
    { title: 'Productos', route: '/Productos' },
    { title: 'Contacto', route: '/Contacto' },
    { title: 'Blog', route: '/Blog' },
  ];
  isMenuOpen = false;
  readonly cartItemsCount$ = this.cartService.summary$.pipe(
    map((summary) => summary.itemsCount),
  );

  private routeSub?: Subscription;

  ngOnInit(): void {
    this.routeSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  get accountRoute(): string {
    const role = this.authService.currentSession()?.role;
    return role === 'admin' ? '/admin' : '/user';
  }

  get greetingName(): string {
    const fullName =
      this.authService.currentSession()?.displayName?.trim() || '';
    if (!fullName) {
      return 'Usuario';
    }

    return fullName.split(' ')[0];
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  openCartDrawer(): void {
    this.closeMenu();
    this.cartDrawerService.open();
  }

  onViewportResize(): void {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    void this.router.navigate(['/Inicio']);
  }
}
