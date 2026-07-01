import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  posts = [
    { title: 'Cómo optimizar tu app Angular', excerpt: 'Mejores prácticas de rendimiento, lazy-loading y prefetch.', image: 'assets/logos/4.png' },
    { title: 'Guía de seguridad para APIs', excerpt: 'Autenticación, autorización y protección contra amenazas comunes.', image: 'assets/logos/3.png' },
    { title: 'Diseño profesional en la web', excerpt: 'Tipografía, contraste y espaciado para UI de alto nivel.', image: 'assets/logos/2.png' }
  ];

  ngOnInit(): void {}
}
