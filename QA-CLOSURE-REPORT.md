# Cierre de QA — Refactor Fases A–D

**Fecha:** 2026-07-20
**Estado final:** `ng lint` ✅ 0 errores · `stylelint` ✅ 0 errores · `ng build --configuration production` ✅ exit 0

## Deuda técnica eliminada

| Área | Antes | Después |
|---|---|---|
| ESLint (TS/HTML) | 74 errores, 1 warning | 0 |
| Stylelint (SCSS) | 96 errores | 0 |
| Interfaces con índice `[key: string]` | 3 (`purchase-history.ts`, `user-favorites.ts`, `user-profile.ts`) | 0 — migradas a `Record<string, T>` |
| Interfaz huérfana sin uso (`SlideInterface`) | 1 archivo muerto | Eliminado |
| Colores hardcodeados en `.scss` | ~80 literales (hex/rgb/keyword) | 0 — todos resueltos a tokens en `assets/tokens/colors.scss` |
| DI por constructor | ~13 componentes/servicios | Migrados a `inject()` |
| `*ngIf` / `*ngFor` | 6 plantillas | Migradas a `@if` / `@for` |
| `darken()` (Sass global, deprecado) | 1 uso | `color.adjust()` vía `sass:color` |
| `word-break: break-word` (keyword deprecado) | 2 usos | `overflow-wrap: break-word` |
| `!important` | 0 (verificado) | 0 |
| `any` | 0 (verificado) | 0 |

## Cambios de API pública (breaking, propagados a sus consumidores)

- `RatingStarsComponent.onRate` → `rated`
- `ReviewFormComponent.onSubmit` → `submitted`
- `ButtonComponent` selector: se añadió alternativa de elemento `app-button` (mantiene `button[app-button]`, `a[app-button]` para no romper plantillas existentes)

## Arquitectura de tokens — nuevas secciones en `colors.scss`

Se añadieron 7 paletas nuevas, con el mismo patrón de comentario `// <Dominio> palette` ya usado por `Admin`/`Navbar`/`Catalog`, reutilizando tokens existentes por igualdad exacta de valor antes de crear uno nuevo (`$admin-accent`, `$admin-accent-deep`, `$admin-danger-strong`, `$admin-success`, `$admin-text-medium`, `$catalog-favorite-active`, `$white-00`):

- **Auth/form** (`$form-*`, `$auth-demo-text`, `$contact-*`) — login, register, contact, review-form, purchase-info
- **Product detail** (`$product-description-text`, `$purchase-info-*`, `$product-review-gate-*`)
- **Shopping cart** (`$cart-*`, 9 tokens)
- **Rating stars** (`$rating-star-inactive/active`)
- **Services** / **Services showcase** (`$services-*`, `$services-showcase-*`)
- **Review list** (`$review-list-border-shadow`)
- **User panel** (`$user-form-error/success`)

## Ajuste de tooling

`.stylelintrc.json`: se añadió `"value-keyword-case": ["lower", { "camelCaseSvgKeywords": true }]` para permitir `currentColor` (requerido por el whitelist de `scale-unlimited/declaration-strict-value`) sin relajar ninguna regla de estricta de color.

## Deuda residual conocida (no bloqueante, fuera de alcance de este cierre)

- `products.component.scss` excede el budget `anyComponentStyle` (11.12 kB vs 10 kB de warning) — build sigue en verde; requiere decisión de negocio (dividir el componente vs. subir el budget en `angular.json`).
