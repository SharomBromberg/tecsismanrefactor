import { Product } from '@core/interfaces/product';

export interface Subcategory { id: string; name: string; }
export interface Category { id: string; name: string; tint: string; subcategories: Subcategory[]; }

export const CATEGORIES: Category[] = [
    { id: 'cloud', name: 'Cloud', tint: '#123a63', subcategories: [{ id: 'servidores', name: 'Servidores' }, { id: 'almacenamiento', name: 'Almacenamiento' }] },
    { id: 'seguridad', name: 'Seguridad', tint: '#04314C', subcategories: [{ id: 'camaras', name: 'Cámaras' }, { id: 'firewalls', name: 'Firewalls y control' }] },
    { id: 'redes', name: 'Redes', tint: '#1a4874', subcategories: [{ id: 'switches', name: 'Switches' }, { id: 'wifi', name: 'WiFi y routers' }] },
    { id: 'perifericos', name: 'Periféricos', tint: '#325782', subcategories: [{ id: 'monitores', name: 'Monitores' }, { id: 'accesorios', name: 'Accesorios' }] },
];

export const PRODUCTS: Product[] = [
    { _id: 'p1', name: 'Servidor VPS Linux Pro', description: 'Instancia virtual de alto rendimiento para aplicaciones críticas. 4 vCPU · 8 GB RAM · 100 GB NVMe · 1 Gbps', price: 119900, categoryId: 'cloud', subcategoryId: 'servidores', stock: 99, featured: true, rating: 4.6, images: [], comments: [] },
    { _id: 'p2', name: 'Almacenamiento Cloud 1 TB', description: 'Respaldo corporativo redundante y cifrado. 1 TB · AES-256 en reposo · 99.9% uptime', price: 34900, categoryId: 'cloud', subcategoryId: 'almacenamiento', stock: 200, featured: false, rating: 4.2, images: [], comments: [] },
    { _id: 'p3', name: 'Firewall Perimetral', description: 'Protección avanzada contra amenazas de red. 5 Gbps · Filtrado web · Control de aplicaciones', price: 3400000, categoryId: 'seguridad', subcategoryId: 'firewalls', stock: 15, featured: true, rating: 4.8, images: [], comments: [] },
    { _id: 'p4', name: 'Cámara IP Domo 4K', description: 'Vigilancia de ultra alta definición para interiores. Varifocal motorizado · Visión nocturna 30 m · PoE', price: 480000, categoryId: 'seguridad', subcategoryId: 'camaras', stock: 45, featured: false, rating: 4.4, images: [], comments: [] },
    { _id: 'p5', name: 'Switch Gestionable 24 Puertos', description: 'Capa 2/3 para montaje en rack. 24 × 1 GbE · 4 × SFP 1G · Gestión web', price: 1280000, categoryId: 'redes', subcategoryId: 'switches', stock: 25, featured: true, rating: 4.5, images: [], comments: [] },
    { _id: 'p6', name: 'Router WiFi 6 Enterprise', description: 'Inalámbrico de alto rendimiento AX3000. MU-MIMO · OFDMA · WPA3', price: 600000, categoryId: 'redes', subcategoryId: 'wifi', stock: 60, featured: false, rating: 4.3, images: [], comments: [] },
    { _id: 'p7', name: 'Monitor UltraWide 34" Curvo', description: 'Superficie amplia para trabajo técnico. IPS · WQHD · sRGB 99% · 144 Hz', price: 1680000, categoryId: 'perifericos', subcategoryId: 'monitores', stock: 20, featured: true, rating: 4.7, images: [], comments: [] },
    { _id: 'p8', name: 'Teclado Mecánico Inalámbrico', description: 'Switches premium para jornadas largas. Brown · Bluetooth / 2.4 GHz · 4000 mAh', price: 540000, categoryId: 'perifericos', subcategoryId: 'accesorios', stock: 35, featured: false, rating: 4.1, images: [], comments: [] },
];