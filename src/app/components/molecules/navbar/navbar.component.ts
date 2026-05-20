import { Component } from '@angular/core';
import { MenuElement } from '../../../interfaces/menu';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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

  ngOnInit() {

  }
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
