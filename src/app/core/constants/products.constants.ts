import { Product } from '@core/interfaces/product';

export interface Subcategory { id: string; name: string; }
export interface Category { id: string; name: string; tint: string; subcategories: Subcategory[]; }

export const CATEGORIES: Category[] = [
    { 
        id: 'computadores', 
        name: 'Computadores', 
        tint: '#123a63', 
        subcategories: [
            { id: 'portatiles', name: 'Portátiles' }, 
            { id: 'escritorio', name: 'Escritorio y All-in-One' }
        ] 
    },
    { 
        id: 'accesorios', 
        name: 'Accesorios', 
        tint: '#325782', 
        subcategories: [
            { id: 'monitores', name: 'Monitores' }, 
            { id: 'perifericos', name: 'Mouse y Teclados' },
            { id: 'audio-video', name: 'Cámaras web y Audio' }
        ] 
    },
    { 
        id: 'hardware', 
        name: 'Componentes y Repuestos', 
        tint: '#1a4874', 
        subcategories: [
            { id: 'almacenamiento', name: 'Almacenamiento y RAM' }, 
            { id: 'cableado', name: 'Cableado y Conectores' },
            { id: 'partes', name: 'Procesadores y Placas' }
        ] 
    },
    { 
        id: 'redes-seguridad', 
        name: 'Redes y Seguridad', 
        tint: '#04314C', 
        subcategories: [
            { id: 'switches', name: 'Switches y Routers' }, 
            { id: 'camaras', name: 'Cámaras de Seguridad' },
            { id: 'biometria', name: 'Biométricos y Control' }
        ] 
    },
];

export const PRODUCTS: Product[] = [
    // --- COMPUTADORES ---
    { 
        _id: 'p1', 
        name: 'Laptop Lenovo ThinkPad T14 Gen 3', 
        description: 'Potencia empresarial duradera. Intel Core i7 12va Gen, 16GB RAM DDR4, 512GB SSD PCIe. Pantalla 14" FHD Antirreflejo. Chasis ultraligero y resistente con certificación militar.', 
        price: 5299000, 
        categoryId: 'computadores', 
        subcategoryId: 'portatiles', 
        stock: 12, 
        featured: true, 
        rating: 4.8, 
        images: [
            'https://loremflickr.com/600/600/laptop,lenovo?lock=1',
            'https://loremflickr.com/600/600/laptop,lenovo?lock=2',
            'https://loremflickr.com/600/600/laptop,lenovo?lock=3'
        ], 
        comments: [] 
    },
    { 
        _id: 'p2', 
        name: 'MacBook Pro 16" M3 Max', 
        description: 'Para profesionales creativos. Chip Apple M3 Max con CPU de 14 núcleos, GPU de 30 núcleos, 36GB de memoria unificada y 1TB SSD. Liquid Retina XDR.', 
        price: 15990000, 
        categoryId: 'computadores', 
        subcategoryId: 'portatiles', 
        stock: 4, 
        featured: true, 
        rating: 4.9, 
        images: [
            'https://loremflickr.com/600/600/macbook,apple?lock=4',
            'https://loremflickr.com/600/600/macbook,apple?lock=5'
        ], 
        comments: [] 
    },
    { 
        _id: 'p3', 
        name: 'PC de Escritorio HP EliteDesk 800 G9', 
        description: 'Estación de trabajo corporativa SFF. Intel Core i5 13500, 16GB RAM, 512GB NVMe. Ideal para oficinas y trabajo intensivo de bases de datos.', 
        price: 3150000, 
        categoryId: 'computadores', 
        subcategoryId: 'escritorio', 
        stock: 25, 
        featured: false, 
        rating: 4.6, 
        images: [
            'https://loremflickr.com/600/600/desktop,computer,hp?lock=6',
            'https://loremflickr.com/600/600/desktop,computer,hp?lock=7'
        ], 
        comments: [] 
    },
    { 
        _id: 'p4', 
        name: 'All-in-One Dell OptiPlex 7410 24"', 
        description: 'Todo en uno elegante y potente. Pantalla 24" FHD Táctil, Intel Core i7 13700, 16GB RAM, 1TB SSD. Cámara retráctil de 5MP.', 
        price: 4890000, 
        categoryId: 'computadores', 
        subcategoryId: 'escritorio', 
        stock: 8, 
        featured: false, 
        rating: 4.7, 
        images: [
            'https://loremflickr.com/600/600/allinone,dell?lock=8',
            'https://loremflickr.com/600/600/allinone,dell?lock=9'
        ], 
        comments: [] 
    },

    // --- ACCESORIOS ---
    { 
        _id: 'p5', 
        name: 'Monitor LG UltraWide 34" Curvo WQHD', 
        description: 'Pantalla curva 34" IPS con resolución WQHD (3440 x 1440). sRGB 99%, HDR10. Tasa de refresco 160Hz. Perfecto para multitarea y edición de video.', 
        price: 1850000, 
        categoryId: 'accesorios', 
        subcategoryId: 'monitores', 
        stock: 15, 
        featured: true, 
        rating: 4.8, 
        images: [
            'https://loremflickr.com/600/600/monitor,screen?lock=10',
            'https://loremflickr.com/600/600/monitor,screen?lock=11'
        ], 
        comments: [] 
    },
    { 
        _id: 'p6', 
        name: 'Teclado Mecánico Logitech MX Mechanical', 
        description: 'Teclado de perfil bajo, switches táctiles silenciosos, retroiluminación inteligente y conectividad multidispositivo (Bluetooth/Logi Bolt).', 
        price: 729000, 
        categoryId: 'accesorios', 
        subcategoryId: 'perifericos', 
        stock: 45, 
        featured: false, 
        rating: 4.9, 
        images: [
            'https://loremflickr.com/600/600/keyboard,logitech?lock=12',
            'https://loremflickr.com/600/600/keyboard,logitech?lock=13'
        ], 
        comments: [] 
    },
    { 
        _id: 'p7', 
        name: 'Mouse Ergonómico Logitech MX Master 3S', 
        description: 'El mejor mouse de productividad. Sensor óptico 8000 DPI, clics ultra silenciosos, rueda MagSpeed electromagnética. Autonomía de 70 días.', 
        price: 499000, 
        categoryId: 'accesorios', 
        subcategoryId: 'perifericos', 
        stock: 60, 
        featured: true, 
        rating: 5.0, 
        images: [
            'https://loremflickr.com/600/600/mouse,computer?lock=14',
            'https://loremflickr.com/600/600/mouse,computer?lock=15'
        ], 
        comments: [] 
    },
    { 
        _id: 'p8', 
        name: 'Cámara Web Poly Studio P5', 
        description: 'Webcam profesional 1080p con óptica excepcional. Micrófono direccional optimizado para voces. Obturador de privacidad integrado.', 
        price: 320000, 
        categoryId: 'accesorios', 
        subcategoryId: 'audio-video', 
        stock: 30, 
        featured: false, 
        rating: 4.5, 
        images: [
            'https://loremflickr.com/600/600/webcam,camera?lock=16',
            'https://loremflickr.com/600/600/webcam,camera?lock=17'
        ], 
        comments: [] 
    },

    // --- HARDWARE Y REPUESTOS ---
    { 
        _id: 'p9', 
        name: 'Disco de Estado Sólido (SSD) Samsung 990 PRO 2TB', 
        description: 'Rendimiento extremo con tecnología PCIe 4.0 NVMe. Velocidades de lectura de hasta 7450 MB/s. Ideal para servidores y estaciones de trabajo pesadas.', 
        price: 850000, 
        categoryId: 'hardware', 
        subcategoryId: 'almacenamiento', 
        stock: 55, 
        featured: false, 
        rating: 4.9, 
        images: [
            'https://loremflickr.com/600/600/ssd,harddrive?lock=18',
            'https://loremflickr.com/600/600/ssd,harddrive?lock=19'
        ], 
        comments: [] 
    },
    { 
        _id: 'p10', 
        name: 'Memoria RAM Corsair Vengeance DDR5 32GB (2x16GB)', 
        description: 'Kit de memoria de alto rendimiento, 6000MHz C36. Optimizada para placas base Intel de última generación. Difusor térmico de aluminio puro.', 
        price: 520000, 
        categoryId: 'hardware', 
        subcategoryId: 'almacenamiento', 
        stock: 40, 
        featured: false, 
        rating: 4.7, 
        images: [
            'https://loremflickr.com/600/600/ram,computer?lock=20',
            'https://loremflickr.com/600/600/ram,computer?lock=21'
        ], 
        comments: [] 
    },
    { 
        _id: 'p11', 
        name: 'Bobina Cable UTP Cat 6A Nexxt (305m)', 
        description: 'Cable de red trenzado sin apantallar. 100% cobre sólido. Chaqueta LSZH color azul. Soporta transmisiones de hasta 10 Gigabits (10GBASE-T).', 
        price: 680000, 
        categoryId: 'hardware', 
        subcategoryId: 'cableado', 
        stock: 18, 
        featured: true, 
        rating: 4.8, 
        images: [
            'https://loremflickr.com/600/600/network,cable?lock=22',
            'https://loremflickr.com/600/600/network,cable?lock=23'
        ], 
        comments: [] 
    },
    { 
        _id: 'p12', 
        name: 'Procesador AMD Ryzen 9 7950X', 
        description: 'Procesador para entusiastas y creadores. 16 núcleos, 32 hilos, hasta 5.7 GHz. Arquitectura Zen 4, Socket AM5. Potencia desmesurada para render y compilación.', 
        price: 2850000, 
        categoryId: 'hardware', 
        subcategoryId: 'partes', 
        stock: 5, 
        featured: false, 
        rating: 5.0, 
        images: [
            'https://loremflickr.com/600/600/cpu,processor?lock=24',
            'https://loremflickr.com/600/600/cpu,processor?lock=25'
        ], 
        comments: [] 
    },

    // --- REDES Y SEGURIDAD ---
    { 
        _id: 'p13', 
        name: 'Cámara IP Domo PTZ Hikvision 4MP DarkFighter', 
        description: 'Cámara domo de seguridad motorizada con zoom óptico 25x. Tecnología DarkFighter para excelente visión nocturna. WDR 120dB, IP66.', 
        price: 1950000, 
        categoryId: 'redes-seguridad', 
        subcategoryId: 'camaras', 
        stock: 12, 
        featured: true, 
        rating: 4.7, 
        images: [
            'https://loremflickr.com/600/600/cctv,camera?lock=26',
            'https://loremflickr.com/600/600/cctv,camera?lock=27'
        ], 
        comments: [] 
    },
    { 
        _id: 'p14', 
        name: 'Kit 4 Cámaras Bala Dahua 1080p + DVR 4CH', 
        description: 'Sistema completo de videovigilancia. 4 cámaras de exterior metálicas 2MP (Infrarrojo 20m), DVR Pentahíbrido con soporte de visualización en app.', 
        price: 650000, 
        categoryId: 'redes-seguridad', 
        subcategoryId: 'camaras', 
        stock: 35, 
        featured: false, 
        rating: 4.4, 
        images: [
            'https://loremflickr.com/600/600/security,camera?lock=28',
            'https://loremflickr.com/600/600/security,camera?lock=29'
        ], 
        comments: [] 
    },
    { 
        _id: 'p15', 
        name: 'Switch Cisco Catalyst C1000-24T-4G-L', 
        description: 'Switch gestionable de capa 2 para pequeñas empresas. 24 puertos Gigabit Ethernet 10/100/1000 y 4 enlaces ascendentes SFP de 1G.', 
        price: 2150000, 
        categoryId: 'redes-seguridad', 
        subcategoryId: 'switches', 
        stock: 9, 
        featured: true, 
        rating: 4.9, 
        images: [
            'https://loremflickr.com/600/600/switch,network?lock=30',
            'https://loremflickr.com/600/600/switch,network?lock=31'
        ], 
        comments: [] 
    },
    { 
        _id: 'p16', 
        name: 'Router Ubiquiti UniFi Dream Machine Pro', 
        description: 'Consola de red todo en uno. Gateway de seguridad empresarial (IPS/IDS), switch Gigabit de 8 puertos y bahía para disco duro (UniFi Protect).', 
        price: 1850000, 
        categoryId: 'redes-seguridad', 
        subcategoryId: 'switches', 
        stock: 14, 
        featured: false, 
        rating: 4.8, 
        images: [
            'https://loremflickr.com/600/600/router,ubiquiti?lock=32',
            'https://loremflickr.com/600/600/router,ubiquiti?lock=33'
        ], 
        comments: [] 
    },
    { 
        _id: 'p17', 
        name: 'Control de Acceso Biométrico ZKTeco F22', 
        description: 'Lector biométrico de huellas dactilares ultradelgado con sensor BioID y Wi-Fi, ofrece un rendimiento inigualable con un algoritmo avanzado.', 
        price: 780000, 
        categoryId: 'redes-seguridad', 
        subcategoryId: 'biometria', 
        stock: 22, 
        featured: false, 
        rating: 4.5, 
        images: [
            'https://loremflickr.com/600/600/biometric,fingerprint?lock=34',
            'https://loremflickr.com/600/600/biometric,fingerprint?lock=35'
        ], 
        comments: [] 
    },
    { 
        _id: 'p18', 
        name: 'Patch Panel Cat 6 de 24 Puertos Panduit', 
        description: 'Panel de parcheo de alto rendimiento y alta densidad de 1 RU. Supera los estándares ANSI/TIA-568.2-D Categoría 6.', 
        price: 245000, 
        categoryId: 'hardware', 
        subcategoryId: 'cableado', 
        stock: 45, 
        featured: false, 
        rating: 4.6, 
        images: [
            'https://loremflickr.com/600/600/patchpanel,network?lock=36',
            'https://loremflickr.com/600/600/patchpanel,network?lock=37'
        ], 
        comments: [] 
    },
    { 
        _id: 'p19', 
        name: 'Base Enfriadora para Portátil Trust GXT 1125', 
        description: 'Soporte de refrigeración iluminado para portátiles de hasta 17.3". 5 ventiladores, 5 niveles de inclinación y panel de malla metálica resistente.', 
        price: 135000, 
        categoryId: 'accesorios', 
        subcategoryId: 'perifericos', 
        stock: 80, 
        featured: false, 
        rating: 4.3, 
        images: [
            'https://loremflickr.com/600/600/laptop,cooler?lock=38',
            'https://loremflickr.com/600/600/laptop,cooler?lock=39'
        ], 
        comments: [] 
    },
    { 
        _id: 'p20', 
        name: 'Hub USB-C Multipuerto Anker PowerExpand 8-en-1', 
        description: 'Hub de expansión con puerto HDMI 4K a 60Hz, 2 puertos USB-A a 10Gbps, puerto Ethernet, ranuras SD/MicroSD, y USB-C con suministro de energía de 100W.', 
        price: 320000, 
        categoryId: 'accesorios', 
        subcategoryId: 'perifericos', 
        stock: 120, 
        featured: true, 
        rating: 4.8, 
        images: [
            'https://loremflickr.com/600/600/usbc,hub?lock=40',
            'https://loremflickr.com/600/600/usbc,hub?lock=41'
        ], 
        comments: [] 
    }
];