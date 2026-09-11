# TECSISMAN Design System

TECSISMAN is a Colombian technology-services company (`tecsisman.com`, Bogotá / es-CO). Its single web product is an Angular 21 application that acts at once as a **marketing site**, a **services catalogue**, a **B2B ecommerce store**, and a **customer account panel**, with an internal **admin dashboard** behind role guards.

The company sells three families of work, and the whole design system exists to communicate them:

1. **Desarrollo web** — corporate sites, online stores, blogs/content portals, landing pages, creative portfolios.
2. **Infraestructura y conectividad** — structured network installation, CCTV / access control / monitoring.
3. **Soporte y mantenimiento** — computer maintenance and preventive/corrective service for medical devices.

Alongside services it runs a hardware/cloud marketplace: Cloud Computing, Seguridad Informática, Redes y Telecomunicaciones, Periféricos y Accesorios. Purchases can complete in-app or continue over **WhatsApp** (+57 316 320 2647) — WhatsApp is a first-class channel, not an afterthought.

## Sources this system was built from

- GitHub: **https://github.com/SharomBromberg/tecsismanrefactor** (branch `main`) — the Angular front end. Everything here was read from that source, not from screenshots.
  - Design tokens: `src/assets/tokens/{colors,fonts,spacing,shadows,breakpoints,mixins}.scss`
  - Global CSS: `src/styles.scss`, `src/index.html`
  - Components: `src/app/shared/{atoms,molecules,organisms}/…`, layout in `src/app/layout/{navbar,footer}`
  - Screens: `src/app/features/{main,auth,admin}/pages/…`
  - Copy & data: `src/app/core/constants/{services-catalog,contact}.constants.ts`, `src/app/core/mocks/product.mocks.ts`
  - Assets: `src/assets/{logos,pictures,footer}`
- Worth exploring further: the repo's `src/app/features/admin` and `src/app/features/main/pages/user` surfaces contain additional screens beyond what this kit recreates. Reading them directly will make any admin-side design work far more accurate.

No Figma file, brand book or slide deck was provided.

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | The only stylesheet consumers link; `@import`s everything below |
| `tokens/colors.css` | Base palette, navy scale, accents, semantic aliases, gradients |
| `tokens/typography.css` | Inter/Poppins families, weights, text-role tokens |
| `tokens/spacing.css` | Spacing scale, sizes, radii, control heights, layout |
| `tokens/shadows.css` | Navy elevation pair + surface-specific shadows |
| `tokens/motion.css` | Durations, easings, hover lift/zoom transforms |
| `tokens/breakpoints.css` | The 11 named breakpoints |
| `tokens/fonts.css` | Google Fonts import for Inter + Poppins |
| `guidelines/*.html` | Foundation specimen cards (Colors, Type, Spacing, Brand) |
| `components/atoms/` | Button, Input, Icon, Logo |
| `components/molecules/` | Card, CategoryPills, SearchBox, RatingStars |
| `components/commerce/` | ProductCard, ProductGallery, PurchaseInfo, ProductDescription, ReviewList, ReviewForm, CartDrawer |
| `components/layout/` | Navbar, Footer, Hero, Toast, AccountSidebar |
| `ui_kits/tecsisman-web/` | Click-through recreation: Home, Catálogo, Detalle, Login, Mi cuenta |
| `ui_kits/tecsisman-premium/` | **Rediseño premium** (marino dominante, lima solo en CTA, sin sombras): Home, Catálogo, Detalle, Carrito + checkout |
| `assets/logos/` `assets/images/` `assets/icons/` | Real brand assets copied from the repo |
| `SKILL.md` | Agent Skills entry point |
| `github.md` | Upstream repo association + screen map |

## Components

Authored to match the repo's component inventory exactly (`shared/atoms`, `shared/molecules`, `shared/organisms`, `layout`):

**Atoms** — `Button`, `Input`, `Icon`, `Logo`
**Molecules** — `Card`, `CategoryPills`, `SearchBox`, `RatingStars`
**Commerce** — `ProductCard`, `ProductGallery`, `PurchaseInfo`, `ProductDescription`, `ReviewList`, `ReviewForm`, `CartDrawer`
**Layout** — `Navbar`, `Footer`, `Hero`, `Toast`, `AccountSidebar`

Each component directory carries `<Name>.jsx`, `<Name>.d.ts` (props contract) and `<Name>.prompt.md` (when/how to use), plus one `@dsCard` HTML showing its states.

**Not built as components** (they are page compositions in the source, reproduced inside the UI kit instead): `about`, `booking`, `quote`, `featured-products`, `services-showcase`, `shopping-cart`, and the admin-only forms (`product-form`, `category-form`, `blog-post-form`, `profile-form`).

**Intentional additions:** none. No primitive was invented that has no counterpart in the repo.

---

## CONTENT FUNDAMENTALS

**Language.** Colombian Spanish (`lang="es"`, `og:locale es_CO`). Currency is COP, formatted with no decimals (`$ 320.000`). Never mix English into user-facing copy — the only English left in the product is two legacy navbar labels ("Login", "Register"), and new work should use Spanish ("Iniciar sesión", "Crear cuenta").

**Accents are inconsistent in the source.** Marketing copy written later drops diacritics ("Satisfaccion", "cotizacion", "Tu carrito esta vacio"), while catalogue and form copy keeps them ("Categoría", "Contraseña", "Refina tu búsqueda"). Pick one per artifact and stay consistent; prefer correctly accented Spanish for anything new.

**Voice.** Second person singular, informal *tú* — "Lleva tu negocio al siguiente nivel", "Filtra y encuentra productos", "Agenda tu Cita", "Cotiza tu sitio web". The company speaks as *nosotros* ("Creamos experiencias web modernas", "Seleccionamos herramientas segun tus objetivos", "Contamos con un equipo altamente capacitado"). Never first-person singular.

**Register.** Confident, benefit-led, commercially concrete — outcomes before technology: "con foco en resultados: mejor captacion, procesos confiables y una base tecnica lista para escalar". Technical specifics live in a separate line ("4 vCPU, 8GB RAM, 100GB NVMe"), never inside the sales sentence. No hype words, no exclamation marks, no rhetorical questions except as headings ("¿Por qué elegirnos?").

**Casing.** Sentence case for body and buttons ("Agregar al carrito", "Ver catalogo completo", "Programar"). Section headings use Title Case sparingly and inconsistently in the source ("Sobre Nosotros", "Agenda tu Cita", "Nuestras Especialidades") — treat Title Case as reserved for the home page's three section headers. Eyebrows are ALL CAPS via CSS `text-transform`, never typed in caps.

**Lengths.** Eyebrow ≤ 7 words. H1 ≤ 19ch per line (the hero clamps at 19ch). Card description: one sentence, 12–25 words. Button labels: 1–4 words. Toasts: one short clause ("Producto agregado al carrito").

**Microcopy patterns.**
- Validation is direct and terminal: "El usuario es obligatorio.", "Minimo 10 caracteres.", "La contraseña es obligatoria."
- Empty states are one plain sentence, no illustration: "Tu carrito esta vacio", "Aún no hay opiniones sobre este producto.", "Todavia no hay productos marcados como destacados desde el panel administrativo."
- Helper notes reassure rather than instruct: "Los filtros se aplican al instante."
- Service CTAs use the verb of the job: **Cotizar** for web work, **Programar** for on-site services, **Agregar al carrito** for products, **Comprar por WhatsApp** for direct sales.
- The account greeting is first name only: "Hola, Ana".

**Emoji: never.** There is not one emoji anywhere in the source. Unicode is used only for functional glyphs: `×` (close), `‹ ›` (carousel arrows), `•` (footer separator), `©`.

---

## VISUAL FOUNDATIONS

**Palette.** One navy anchor (`--blue-01` #04314C) carries every dark surface: navbar, footer, cart drawer, hero. One primary blue (`--blue-00` #509FCB) carries interaction. One lime pair (`--green-00` #BDF347 → `--green-02` #9BCB3C) carries the "do it" energy: the main CTA gradient, badges, focus rings, cart totals. Everything else is a neutral (`#333` body, `#BCBEC0` borders, `#f5f5f5` page) or a narrow domain accent (orange cart badge, crimson favourite heart, amber stars, WhatsApp green). Auth and admin surfaces switch to a brighter accent blue (`--accent-600` #1f6feb) — that is the one legitimate second identity in the system. Backgrounds per page: at most the white/mist pair plus one navy section.

**Type.** Two Google fonts only. **Inter** for everything structural — body 400/1.6, subtitles 500, buttons 600 with `0.01em` tracking, titles 700 with `-0.005em`. **Poppins** 700 with `-0.01em` for display moments: hero headline (`clamp(2rem, 4.2vw, 3rem)`, line-height 1.12, max 19ch), section titles (2rem), prices, KPI numbers. Poppins never sets body copy; Inter never sets a price.

**Spacing.** 0.25rem base, t-shirt scale to 8rem. Sections breathe at `--spacing-4xl` (6rem) on desktop and `--spacing-2xl` (3rem) on mobile. Card padding `--spacing-lg`, tightened to `--spacing-md` in grid variants. Content is capped at 1200px (`.app-container`).

**Radii.** Deliberately mixed by role, not by a single global value: 5px buttons (`--radius-xs` — the brand's most distinctive metric), 8px small surfaces and review cards, 12px inputs/toasts/drawer items, 16px cards, 24px catalogue panels, pill for chips, badges and social circles.

**Cards.** White fill, 16px radius, `--elevation-1`; on hover they rise (5px for content cards, 0.35rem for product tiles), take `--elevation-2`, and the image inside zooms 4–5%. Product tiles differ: white→`--navy-050` vertical gradient, 1px navy-10% border that turns blue-35% on hover. The "highlighted" card gets a 2px `--blue-00` border and `--shadow-primary` instead of a deeper shadow. No left-border accent cards anywhere.

**Shadows.** Two elevations, both tinted with navy rather than black (`rgb(4 49 76 / 8%)` resting, `/14%` raised). Surface-specific extras: `--shadow-navbar` (0 8px 24px navy-950), `--shadow-drawer` (-14px 0 36px black-36%), `--shadow-auth-card`, and the quirky `--shadow-offset-navy` — a hard offset "stamp" shadow (`-0.56rem 0.56rem 0 -0.18rem`) behind navbar auth buttons.

**Borders.** Hairlines everywhere: 1px `--gray-01`/`--gray-02` on light, 1px white-8–24% on navy, dashed navy-200 for informational blocks (login demo credentials) and dashed navy-18% for empty states. Filter chips and the favourites toggle use 2px borders.

**Backgrounds.** Three recipes, reused verbatim:
1. *Photographic navy* — full-bleed image + lime radial (12% 18%), blue radial (88% 8%), then a 120° navy 92%→82%→#094A75 90% gradient. Used on the hero.
2. *Mist wash* — `linear-gradient(180deg, --navy-050, --white-00)` with faint lime/blue radials in the corners. Used on featured products and the account panel.
3. *Flat* — `--white-01` and `--white-00` alternating between sections.
No repeating patterns, no textures, no hand-drawn illustration.

**Transparency & blur.** Only on navy: glass cards at white 10–20% with `backdrop-filter: blur(3px)` (hero KPI strip and service cards), and the cart backdrop at navy-62% with `blur(2px)`. Never blur on light surfaces.

**Imagery.** Cool-toned corporate stock: server rooms, networks, teams, screens. Photos always sit under the navy overlay when text is on them; otherwise they fill 200px card bands (`object-fit: cover`) or 16:11 product media. `object-fit: contain` + padding only for logo-like art (the portfolio card). No grain, no duotone, no borders on photos.

**Motion.** Short and functional. 160ms for controls, 220ms for cards/backdrops/toasts, 320ms for image zoom, 260ms `cubic-bezier(0.22,1,0.36,1)` for the cart drawer. Entrances are a 12px fade-up (`hero-fade-up`, 520/620/760ms staggered; the account panel uses an 8px 240ms version). Toasts scale in from 0.98. `prefers-reduced-motion` disables hero animation in the source — keep that.

**Hover states.** Solid buttons shift fill ±10% lightness (primary darkens, navy lightens); gradient and WhatsApp buttons lift 2px instead of changing colour; ghost fills with blue-10%; outline inverts to navy fill + white text. Cards lift and deepen their shadow. Links on navy go from white-90% to `--blue-02`. Icon buttons in navy chrome go from white-8% to white-16% fill.

**Press / active states.** The source has no separate `:active` treatment — no shrink, no darkening. Active *selection* is what's styled: pills fill `--blue-00` with a primary shadow, filter chips fill `--blue-02`, account nav items get a blue-22%→14% gradient wash, gallery thumbnails get a 2px lime border.

**Focus.** Lime (`--green-02`) is the focus colour on all brand inputs — border or bottom-border swap, sometimes with a background shift. Auth/admin/review fields instead use a 2px blue ring (`rgb(31 111 235 / 26–28%)`); star buttons use a 3px amber ring. Never remove focus styling.

**Fixed & layered elements.** Navbar is `position: fixed`, 8rem tall, `z-index: 1000` — pages that start at the top must clear it (`--layout-header-clearance`, or the catalogue's `margin-top: 8rem`). Cart backdrop 1200, drawer 1300, toast 2000. Account sidebar is fixed at 1.5rem from the left on desktop and static on mobile.

**Protection.** Text over imagery is always protected by the full-page navy gradient overlay, never by a per-element capsule. Badges over photos use an opaque white-92% pill instead.

---

## ICONOGRAPHY

The product ships **its own 13-glyph line set**, hand-drawn as inline SVG in `src/app/shared/atoms/icon/icon.component.html`. There is no icon font, no sprite sheet, no Lucide/Heroicons/Font Awesome dependency. All 13 glyphs were copied verbatim into `components/atoms/Icon.jsx`:

`cart · user · search · menu · close · logout · lock · location · history · heart · heart-filled · star-filled · star-empty`

Rules read from the source:
- 24×24 viewBox, stroke `currentColor` at **1.6–1.8px**, round caps and joins, `fill="none"` except the deliberately filled pair (`heart-filled`, `star-filled`) and small dot accents.
- Three sizes only: `sm` 1rem, `md` 1.25rem, `lg` 1.75rem. Colour is always inherited — icons never carry their own hex.
- Filled glyphs signal state (favourited, rated), outline glyphs signal action.
- A wider `IconName` type exists in `core/interfaces/iconinterface.ts` (whatsapp, email, instagram, facebook, phone, edit, delete, empty-box, shopping-cart) but those cases are **not implemented** in the component — treat them as unavailable rather than inventing them.

**Social & contact marks** are separate: the footer inlines its own WhatsApp / Instagram / Facebook paths (filled, 24×24, `fill="currentColor"`) — copied into `components/layout/Footer.jsx` — and the repo also ships PNG marks, now in `assets/icons/` (`social-whatsapp.png`, `social-facebook.png`, `social-facebook-mobile.png`, `social-maps.png`, `email.png`, `whatsapp.png`). Prefer the inline paths in UI, the PNGs only where a raster is required.

**Unicode as icons**, used sparingly and deliberately: `×` for close/dismiss, `‹` `›` for carousel controls, `•` as a footer separator, `©` in the copyright. **No emoji, ever.**

## Assets & the logo

- `assets/logos/tecsisman-navbar.png` — the current mark: a sphere of blue hexagons with "TECSISMAN" knocked out. This is what the product renders at 120×40 in the navbar (`app-logo`, `navbar__logo-img`).
- `assets/logos/logo01.png` (white knockout) and `logo02.png` — light-surface variants for navy/photo backgrounds.
- `assets/logos/logo.png`, `logo2.png` — an older grey circular "◇ TECSISMAN ◇" mark, retained for archival reference only.
- `assets/images/` — the product's real photography, including `headerBackground.png` (the hero photo) and the `team/history/skills` about-section images.
- `assets/icons/` — the PNG social/contact marks.

No logo was drawn or reconstructed here; every mark is a file copied from the repo.

## Fonts — substitution note

The product loads **Inter** and **Poppins** from Google Fonts in `index.html`, and `tokens/fonts.css` does the same, so typography is exact. The repo *also* ships unused local binaries (`CODE Bold/Light.otf`, the Fira Code family) whose SCSS aliases (`$code-font`, `$fira-code-font`) are explicitly remapped to Inter — they are dead weight upstream and were intentionally not imported. If TECSISMAN has licensed display faces it actually wants used, send the files and this system will be repointed.
