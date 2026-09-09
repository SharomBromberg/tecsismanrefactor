# ESPECIFICACIONES TÉCNICAS Y DIRECTRICES DE FRONTEND - TECSISMAN

## 1. Stack Tecnológico Base

- **Frontend:** Angular 21 (Componentes Standalone únicamente, sin NgModules).
- **Estilos:** SCSS Modular con arquitectura basada en Design Tokens globales.
- **Arquitectura Visual:** Metodología Atomic Design (Átomos, Moléculas, Organismos, Plantillas/Páginas).
- **Herramientas de Calidad (Activas):** ESLint (Reglas estrictas de TypeScript) y Stylelint (Validación de estilos).

## 2. Líneas Rojas y Reglas Inquebrantables (Criterios de Aceptación)

Todo código generado para este repositorio debe pasar los linters sin errores cumpliendo las siguientes reglas:

- **Metodología BEM Pura:** Nomenclatura estricta `bloque__elemento--modificador`. Prohibida la cascada CSS profunda o selectores planos fuera de su bloque principal.
- **Cero Valores Hardcodeados:** Prohibido usar píxeles (`px`), colores Hex, RGB o valores crudos directamente en los componentes. Uso exclusivo de Design Tokens (variables SCSS) para color, `border-radius`, espaciado (`padding`/`margin`), sombras y tipografía.
- **Media Queries Centralizadas:** Queda prohibido escribir `@media (max-width: ...)` manual. Toda responsividad debe implementarse obligatoriamente mediante el mixin global `respond-to`.
- **Tipado TypeScript Estricto:** CERO uso de `any`. Toda propiedad, parámetro, evento o respuesta debe estar fuertemente tipada mediante interfaces o tipos personalizados.
- **Buenas Prácticas SCSS:** Prohibido usar `!important`. No duplicar escalas de diseño ni crear sistemas de espaciado paralelos.

## 3. Estrategia de Maquetación y Mockeo (Pre-Backend)

El proyecto se encuentra en fase de frontend puro. La conexión al backend en NestJS se realizará en el futuro.

- **Simulación Reactiva (Mocks):** Toda la reactividad de la UI (añadir productos, conteos, interacciones, cambios de rol) debe ser simulada localmente en el cliente utilizando **Angular Signals** y propiedades reactivas dentro de los componentes standalone.
- **Internacionalización (i18n):** Se debe reservar el espacio físico y estructural en el HTML/CSS (dentro del Navbar/Header) mediante placeholders limpios para los futuros selectores de idioma, región y moneda.
- **Flujo de Pago Temporal:** El checkout del Carrito de Compras (`Shopping Cart`) debe procesar los pedidos mediante una **"Compra por Contacto Directo"**, habilitando un botón que simule la confirmación de la compra redirigiendo al usuario a un canal de soporte o WhatsApp con el resumen de su pedido.

## 4. Identidad Visual, Roles y Comportamiento UI

- **Color de Acento (Lima):** El uso del color Lima se restringe exclusivamente para llamados a la acción (CTAs) de altísima prioridad y conversión (ej. botones principales de compra o registro).
- **Panel de Usuario (Cliente):** Interfaz limpia y profesional enfocada en la navegación de páginas públicas (Inicio, Servicios, Productos, Contacto, Blog con sección participativa de comentarios) y el flujo del carrito de compras.
- **Panel de Administrador (Admin):** Debe lucir altamente profesional utilizando la paleta de **Azul Brillante** identificada en la auditoría. Este panel debe contener las maquetas de los formularios avanzados de control, herramientas de moderación de comentarios del blog y simulación de métricas del marketplace.

## 5. Protocolo de Ejecución (MEJORAR, NO DAÑAR)

- **Preservación Funcional:** Al refactorizar o rediseñar estéticamente una vista, se deben respetar y mantener intactos los bindings existentes de Angular (`@if`, `@for`, directivas o signals). Está prohibido eliminar o romper lógica funcional o de control bajo el pretexto de mejoras visuales.
