import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MenuElement } from '../../../core/interfaces/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  menuElements: MenuElement[] = [
    { title: 'Inicio', route: '/Inicio' },
    { title: 'Servicios', route: '/Servicios' },
    { title: 'Productos', route: '/Productos' },
    { title: 'Contacto', route: '/Contacto' },
    { title: 'Blog', route: '/Blog' },
  ];
  isMenuOpen: boolean = false;
  currentPageClass: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPageClass = this.getPageClass(this.router.url);
      }
    });
  }

  ngOnInit() {}
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  getPageClass(url: string): string {
    if (url === '/Inicio') return 'homepage';
    if (url === '/Productos') return 'productspage';
    if (url === '/Servicios') return 'servicespage';
    if (url === '/Contacto') return 'contactpage';
    if (url === '/Blog') return 'blogpage';
    // Agrega más condiciones según sea necesario para otras páginas
    return '';
  }
}
