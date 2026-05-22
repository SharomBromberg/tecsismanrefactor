import { Category } from "src/app/interfaces/categories";
import { Product, ProductComment } from "src/app/interfaces/product";


export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Cloud Computing' },
  { id: 'c2', name: 'Seguridad Informática' },
  { id: 'c3', name: 'Redes y Telecomunicaciones' },
  { id: 'c4', name: 'Periféricos y Accesorios' }
];

const defaultComments: ProductComment[] = [
  { author: 'Carlos Mendoza', text: 'Excelente producto, superó mis expectativas.', message: 'Excelente producto, superó mis expectativas.', rating: 5, createdAt: '2025-10-12T10:00:00Z' },
  { author: 'Ana Silva', text: 'Muy buena relación calidad-precio. Recomendado.', message: 'Muy buena relación calidad-precio. Recomendado.', rating: 4, createdAt: '2026-01-05T14:30:00Z' }
];

export const MOCK_PRODUCTS: Product[] = [
  // --- CATEGORÍA 1: Cloud Computing ---
  {
    id: 'p1',
    name: 'Servidor VPS Linux Pro',
    description: 'Instancia virtual de alto rendimiento ideal para aplicaciones críticas.',
    technicalDescription: '4 vCPU, 8GB RAM, 100GB NVMe, Ancho de banda 1Gbps.',
    price: 29.99,
    stock: 99,
    categoryId: 'c1',
    images: [
      'https://picsum.photos/seed/vps-1/600/600',
      'https://picsum.photos/seed/vps-2/600/600',
      'https://picsum.photos/seed/vps-3/600/600',
      'https://picsum.photos/seed/vps-4/600/600'
    ],
    rating: 4.8,
    comments: defaultComments,
    featured: true,
    tags: ['vps', 'linux', 'cloud']
  },
  {
    id: 'p2',
    name: 'Hosting Web Empresarial',
    description: 'Alojamiento para webs de alto tráfico con panel de control incluido.',
    technicalDescription: 'Ancho de banda ilimitado, cPanel, Certificado SSL gratis.',
    price: 15.00,
    stock: 500,
    categoryId: 'c1',
    images: [
      'https://picsum.photos/seed/host-1/600/600',
      'https://picsum.photos/seed/host-2/600/600',
      'https://picsum.photos/seed/host-3/600/600',
      'https://picsum.photos/seed/host-4/600/600'
    ],
    rating: 4.5,
    comments: defaultComments
  },
  {
    id: 'p3',
    name: 'Almacenamiento Cloud S3 1TB',
    description: 'Almacenamiento seguro y redundante para respaldos corporativos.',
    technicalDescription: '1TB de espacio, Encriptación AES-256 en reposo, 99.9% uptime.',
    price: 8.50,
    stock: 200,
    categoryId: 'c1',
    images: [
      'https://picsum.photos/seed/s3-1/600/600',
      'https://picsum.photos/seed/s3-2/600/600',
      'https://picsum.photos/seed/s3-3/600/600',
      'https://picsum.photos/seed/s3-4/600/600'
    ],
    rating: 4.9,
    comments: defaultComments
  },
  {
    id: 'p4',
    name: 'Base de Datos MySQL Gestionada',
    description: 'Cluster de DB con backups diarios automatizados.',
    technicalDescription: 'MySQL 8, 50GB storage, 2 vCPU dedicados.',
    price: 45.00,
    stock: 50,
    categoryId: 'c1',
    images: [
      'https://picsum.photos/seed/sql-1/600/600',
      'https://picsum.photos/seed/sql-2/600/600',
      'https://picsum.photos/seed/sql-3/600/600',
      'https://picsum.photos/seed/sql-4/600/600'
    ],
    rating: 4.7,
    comments: defaultComments
  },
  {
    id: 'p5',
    name: 'Dominio .COM.MX',
    description: 'Registro de dominio anual para empresas en México.',
    technicalDescription: 'Gestión DNS avanzada incluida, Protección WHOIS opcional.',
    price: 12.00,
    stock: 999,
    categoryId: 'c1',
    images: [
      'https://picsum.photos/seed/dom-1/600/600',
      'https://picsum.photos/seed/dom-2/600/600',
      'https://picsum.photos/seed/dom-3/600/600',
      'https://picsum.photos/seed/dom-4/600/600'
    ],
    rating: 4.2,
    comments: defaultComments
  },

  // --- CATEGORÍA 2: Seguridad Informática ---
  {
    id: 'p6',
    name: 'Firewall Perimetral Fortinet',
    description: 'Protección avanzada contra amenazas de red.',
    technicalDescription: 'Throughput 5 Gbps, Filtrado Web, Control de aplicaciones.',
    price: 850.00,
    stock: 15,
    categoryId: 'c2',
    images: [
      'https://picsum.photos/seed/fw-1/600/600',
      'https://picsum.photos/seed/fw-2/600/600',
      'https://picsum.photos/seed/fw-3/600/600',
      'https://picsum.photos/seed/fw-4/600/600'
    ],
    rating: 5.0,
    comments: defaultComments,
    featured: true,
    tags: ['seguridad', 'firewall', 'fortinet']
  },
  {
    id: 'p7',
    name: 'Antivirus Corporativo (50 Licencias)',
    description: 'Seguridad endpoint gestionada desde la nube.',
    technicalDescription: 'Motor heurístico AI, protección anti-ransomware.',
    price: 299.00,
    stock: 100,
    categoryId: 'c2',
    images: [
      'https://picsum.photos/seed/av-1/600/600',
      'https://picsum.photos/seed/av-2/600/600',
      'https://picsum.photos/seed/av-3/600/600',
      'https://picsum.photos/seed/av-4/600/600'
    ],
    rating: 4.6,
    comments: defaultComments
  },
  {
    id: 'p8',
    name: 'Cámara IP Domo 4K',
    description: 'Vigilancia de ultra alta definición para interiores.',
    technicalDescription: 'Lente varifocal motorizado, visión nocturna 30m, PoE.',
    price: 120.00,
    stock: 45,
    categoryId: 'c2',
    images: [
      'https://picsum.photos/seed/cam-1/600/600',
      'https://picsum.photos/seed/cam-2/600/600',
      'https://picsum.photos/seed/cam-3/600/600',
      'https://picsum.photos/seed/cam-4/600/600'
    ],
    rating: 4.4,
    comments: defaultComments
  },
  {
    id: 'p9',
    name: 'Control de Acceso Biométrico',
    description: 'Terminal de lectura de huella, rostro y tarjeta RFID.',
    technicalDescription: 'Conexión TCP/IP, capacidad para 3000 usuarios, salida de relé.',
    price: 340.00,
    stock: 10,
    categoryId: 'c2',
    images: [
      'https://picsum.photos/seed/bio-1/600/600',
      'https://picsum.photos/seed/bio-2/600/600',
      'https://picsum.photos/seed/bio-3/600/600',
      'https://picsum.photos/seed/bio-4/600/600'
    ],
    rating: 4.8,
    comments: defaultComments
  },
  {
    id: 'p10',
    name: 'Auditoría de Seguridad (Pentest)',
    description: 'Servicio integral de hacking ético para infraestructura web.',
    technicalDescription: 'Análisis de caja negra y blanca, reporte de vulnerabilidades OWASP.',
    price: 1500.00,
    stock: 5,
    categoryId: 'c2',
    images: [
      'https://picsum.photos/seed/pen-1/600/600',
      'https://picsum.photos/seed/pen-2/600/600',
      'https://picsum.photos/seed/pen-3/600/600',
      'https://picsum.photos/seed/pen-4/600/600'
    ],
    rating: 5.0,
    comments: defaultComments
  },

  // --- CATEGORÍA 3: Redes y Telecomunicaciones ---
  {
    id: 'p11',
    name: 'Switch Gestionable 24 Puertos Gigabit',
    description: 'Switch capa 2/3 ideal para montajes en rack.',
    technicalDescription: '24 x 10/100/1000 Mbps, 4 puertos SFP 1G.',
    price: 320.00,
    stock: 25,
    categoryId: 'c3',
    images: [
      'https://picsum.photos/seed/sw-1/600/600',
      'https://picsum.photos/seed/sw-2/600/600',
      'https://picsum.photos/seed/sw-3/600/600',
      'https://picsum.photos/seed/sw-4/600/600'
    ],
    rating: 4.7,
    comments: defaultComments,
    featured: true,
    tags: ['switch', 'redes', 'cisco']
  },
  {
    id: 'p12',
    name: 'Router WiFi 6 Enterprise',
    description: 'Router inalámbrico de alto rendimiento AX3000.',
    technicalDescription: 'MU-MIMO, OFDMA, Seguridad WPA3.',
    price: 150.00,
    stock: 60,
    categoryId: 'c3',
    images: [
      'https://picsum.photos/seed/rt-1/600/600',
      'https://picsum.photos/seed/rt-2/600/600',
      'https://picsum.photos/seed/rt-3/600/600',
      'https://picsum.photos/seed/rt-4/600/600'
    ],
    rating: 4.5,
    comments: defaultComments
  },
  {
    id: 'p13',
    name: 'Bobina de Cable UTP Cat 6 (305m)',
    description: 'Cableado estructurado de cobre puro para redes gigabit.',
    technicalDescription: '100% Cobre, chaqueta LSZH ignífuga.',
    price: 115.00,
    stock: 120,
    categoryId: 'c3',
    images: [
      'https://picsum.photos/seed/utp-1/600/600',
      'https://picsum.photos/seed/utp-2/600/600',
      'https://picsum.photos/seed/utp-3/600/600',
      'https://picsum.photos/seed/utp-4/600/600'
    ],
    rating: 4.9,
    comments: defaultComments
  },
  {
    id: 'p14',
    name: 'Access Point Exterior Largo Alcance',
    description: 'Cobertura WiFi para espacios abiertos y campus.',
    technicalDescription: 'Certificación IP67, soporte PoE, Antenas Direccionales.',
    price: 210.00,
    stock: 18,
    categoryId: 'c3',
    images: [
      'https://picsum.photos/seed/ap-1/600/600',
      'https://picsum.photos/seed/ap-2/600/600',
      'https://picsum.photos/seed/ap-3/600/600',
      'https://picsum.photos/seed/ap-4/600/600'
    ],
    rating: 4.6,
    comments: defaultComments
  },
  {
    id: 'p15',
    name: 'Gabinete Rack de Piso 42U',
    description: 'Gabinete cerrado para servidores y equipos de telecomunicaciones.',
    technicalDescription: 'Acero SPCC, Puerta frontal de vidrio templado, Ruedas integradas.',
    price: 650.00,
    stock: 4,
    categoryId: 'c3',
    images: [
      'https://picsum.photos/seed/rack-1/600/600',
      'https://picsum.photos/seed/rack-2/600/600',
      'https://picsum.photos/seed/rack-3/600/600',
      'https://picsum.photos/seed/rack-4/600/600'
    ],
    rating: 4.8,
    comments: defaultComments
  },

  // --- CATEGORÍA 4: Periféricos y Accesorios ---
  {
    id: 'p16',
    name: 'Monitor UltraWide 34" Curvo',
    description: 'Monitor curvo ideal para programación y productividad extrema.',
    technicalDescription: 'Panel IPS, Resolución WQHD, sRGB 99%, 144Hz.',
    price: 420.00,
    stock: 20,
    categoryId: 'c4',
    images: [
      'https://picsum.photos/seed/mon-1/600/600',
      'https://picsum.photos/seed/mon-2/600/600',
      'https://picsum.photos/seed/mon-3/600/600',
      'https://picsum.photos/seed/mon-4/600/600'
    ],
    rating: 4.8,
    comments: defaultComments,
    featured: true,
    tags: ['monitor', 'perifericos', 'display']
  },
  {
    id: 'p17',
    name: 'Teclado Mecánico Inalámbrico Pro',
    description: 'Teclado táctil para desarrolladores con switches premium.',
    technicalDescription: 'Switches Brown, Conexión Bluetooth/2.4Ghz, Batería 4000mAh.',
    price: 135.00,
    stock: 35,
    categoryId: 'c4',
    images: [
      'https://picsum.photos/seed/kb-1/600/600',
      'https://picsum.photos/seed/kb-2/600/600',
      'https://picsum.photos/seed/kb-3/600/600',
      'https://picsum.photos/seed/kb-4/600/600'
    ],
    rating: 4.9,
    comments: defaultComments
  },
  {
    id: 'p18',
    name: 'Mouse Ergonómico Vertical',
    description: 'Ratón diseñado para reducir la tensión en la muñeca.',
    technicalDescription: 'Sensor óptico 4000 DPI, Batería recargable USB-C.',
    price: 45.00,
    stock: 80,
    categoryId: 'c4',
    images: [
      'https://picsum.photos/seed/ms-1/600/600',
      'https://picsum.photos/seed/ms-2/600/600',
      'https://picsum.photos/seed/ms-3/600/600',
      'https://picsum.photos/seed/ms-4/600/600'
    ],
    rating: 4.7,
    comments: defaultComments
  },
  {
    id: 'p19',
    name: 'Auriculares con Cancelación de Ruido',
    description: 'Auriculares de diadema perfectos para oficina y videollamadas.',
    technicalDescription: 'ANC Activo, Micrófono direccional, Bluetooth 5.2.',
    price: 210.00,
    stock: 15,
    categoryId: 'c4',
    images: [
      'https://picsum.photos/seed/hs-1/600/600',
      'https://picsum.photos/seed/hs-2/600/600',
      'https://picsum.photos/seed/hs-3/600/600',
      'https://picsum.photos/seed/hs-4/600/600'
    ],
    rating: 5.0,
    comments: defaultComments
  },
  {
    id: 'p20',
    name: 'Webcam Profesional 4K',
    description: 'Cámara web de alta fidelidad para streaming y conferencias.',
    technicalDescription: 'Sensor Sony 4K, Autoenfoque, Micrófonos duales estéreo.',
    price: 180.00,
    stock: 22,
    categoryId: 'c4',
    images: [
      'https://picsum.photos/seed/wc-1/600/600',
      'https://picsum.photos/seed/wc-2/600/600',
      'https://picsum.photos/seed/wc-3/600/600',
      'https://picsum.photos/seed/wc-4/600/600'
    ],
    rating: 4.6,
    comments: defaultComments
  }
];
