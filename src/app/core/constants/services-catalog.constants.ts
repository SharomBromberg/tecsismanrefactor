import { CardData } from '../interfaces/card-data.interface';
import { statusClassButton } from '../interfaces/buttoninterface';

export interface ServiceGroupData {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  cards: CardData[];
}

export const SERVICES_TECH_STACK: string[] = [
  'Angular',
  'TypeScript',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'Docker',
];

export const SERVICES_GROUPS: ServiceGroupData[] = [
  {
    id: 'desarrollo-web',
    eyebrow: 'Desarrollo web',
    title: 'Servicios web reales para captar clientes y vender mas',
    lead: 'Disenamos y desarrollamos plataformas digitales orientadas a conversion, posicionamiento y operacion comercial.',
    cards: [
      {
        id: 'web-corporativa',
        title: 'Paginas web corporativas',
        description:
          'Sitios profesionales para fortalecer tu marca y comunicar tu propuesta de valor con claridad.',
        imageUrl: 'assets/pictures/corporativa.jpg',
        imageAlt: 'Paginas web corporativas',
        buttonText: 'Cotizar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
      },
      {
        id: 'web-ecommerce',
        title: 'Tiendas en linea',
        description:
          'Ecommerce optimizado para compra rapida, gestion de catalogo y escalabilidad de ventas.',
        imageUrl: 'assets/pictures/ecommerce.jpg',
        imageAlt: 'Tienda en linea',
        buttonText: 'Cotizar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
        isHighlighted: true,
        badgeText: 'Alta conversion',
      },
      {
        id: 'web-blog-portales',
        title: 'Blogs y portales de contenido',
        description:
          'Portales orientados a posicionamiento SEO, contenido de valor y captacion de oportunidades.',
        imageUrl: 'assets/pictures/blogs.jpg',
        imageAlt: 'Blogs y portales',
        buttonText: 'Cotizar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
      },
      {
        id: 'web-landing-pages',
        title: 'Landing pages',
        description:
          'Paginas de aterrizaje enfocadas en conversion para campanas, anuncios y lanzamientos.',
        imageUrl: 'assets/pictures/landing.png',
        imageAlt: 'Landing pages de conversion',
        buttonText: 'Cotizar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
      },
      {
        id: 'web-portafolios',
        title: 'Portafolios creativos',
        description:
          'Presentaciones visuales para mostrar proyectos, casos de exito y diferenciales de marca.',
        imageUrl: 'assets/pictures/portfolio.png',
        imageAlt: 'Portafolios creativos',
        imageFitContain: true,
        buttonText: 'Cotizar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
      },
    ],
  },
  {
    id: 'infraestructura-redes',
    eyebrow: 'Infraestructura y conectividad',
    title: 'Implementacion tecnica para operar sin interrupciones',
    lead: 'Desplegamos infraestructura de red y seguridad para mejorar continuidad, estabilidad y control.',
    cards: [
      {
        id: 'infra-redes',
        title: 'Instalacion de redes',
        description:
          'Diseno e implementacion de redes empresariales estructuradas para conectividad estable y veloz.',
        imageUrl: 'assets/pictures/prueba.jpg',
        imageAlt: 'Instalacion de redes empresariales',
        buttonText: 'Programar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
      },
      {
        id: 'infra-seguridad',
        title: 'Sistemas de seguridad y monitoreo',
        description:
          'Instalacion de CCTV, control de acceso y monitoreo continuo para proteger activos y personas.',
        imageUrl: 'assets/pictures/seguridad.jpg',
        imageAlt: 'Sistemas de seguridad',
        buttonText: 'Programar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
        isHighlighted: true,
        badgeText: 'Alta demanda',
      },
    ],
  },
  {
    id: 'mantenimiento-soporte',
    eyebrow: 'Soporte y mantenimiento',
    title: 'Mantenimiento especializado para continuidad operativa',
    lead: 'Realizamos mantenimiento preventivo y correctivo para reducir fallas y extender la vida util de tus equipos.',
    cards: [
      {
        id: 'mantenimiento-computadores',
        title: 'Mantenimiento de computadores',
        description:
          'Diagnostico, limpieza, optimizacion y cambio de componentes en equipos de escritorio y portatiles.',
        imageUrl: 'assets/pictures/manteinance.jpg',
        imageAlt: 'Mantenimiento de computadores',
        buttonText: 'Programar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
      },
      {
        id: 'mantenimiento-medico',
        title: 'Mantenimiento de dispositivos medicos',
        description:
          'Soporte tecnico preventivo y correctivo para asegurar disponibilidad y confiabilidad de equipos medicos.',
        imageUrl: 'assets/pictures/safenetwork.jpg',
        imageAlt: 'Mantenimiento de dispositivos medicos',
        buttonText: 'Programar servicio',
        buttonVariant: statusClassButton.BUTTON_DARK_BLUE,
        isHighlighted: true,
        badgeText: 'Especializado',
      },
    ],
  },
];

export const SERVICES_FLAT_CARDS: CardData[] = SERVICES_GROUPS.flatMap(
  (group) => group.cards,
);

export const QUOTE_SERVICE_IDS: string[] = [
  'web-corporativa',
  'web-ecommerce',
  'web-blog-portales',
  'web-landing-pages',
  'web-portafolios',
];

export const BOOKING_SERVICE_IDS: string[] = [
  'mantenimiento-computadores',
  'infra-redes',
  'infra-seguridad',
];
