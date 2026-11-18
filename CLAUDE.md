# Sitio de artista — "Cartel"

Sitio de **exhibición** (no de venta) para un artista plástico. El arte es el protagonista; la UI es fuerte pero nunca tapa ni recorta una obra. El cliente no es técnico y edita todo el contenido desde un panel (Sanity Studio en `/admin`).

## Stack

- **Astro** (última versión estable), `output: 'static'`.
- **Sanity** como CMS, con la integración oficial **`@sanity/astro`** y el Studio embebido en `/admin` (`studioBasePath: '/admin'`). Con salida estática el Studio usa ruteo por hash y no necesita servidor.
- **`@astrojs/react`**: sólo lo necesita el Studio. El sitio público no usa React.
- **`@sanity/image-url`** para las imágenes (tamaños y formatos desde el CDN de Sanity).
- **`@sanity/orderable-document-list`** para que el cliente ordene obras y colecciones arrastrando.
- **CSS propio** con custom properties (sin Tailwind ni frameworks de UI). Estilos con scope por componente de Astro + un `global.css` con los tokens.
- **Fuentes autoalojadas** con `@fontsource/six-caps` y `@fontsource/jetbrains-mono` (400 y 700).
- **Formulario de contacto:** Web3Forms (o Formspree): POST desde el navegador, sin backend.
- **Hosting:** Vercel o Netlify (plan gratuito). Un webhook de Sanity llama al deploy hook al publicar.

## Fuente de verdad del diseño

Todo está en `/design`. Leé `design/DESIGN.md` antes de tocar cualquier vista.

- `design/screenshots/*.png`: cómo tiene que verse cada página (desktop 1440 px y tableros mobile 390 px).
- `design/prototype/*.html`: el markup y los estilos exactos, con la interacción (filtros, cambio de vistas, menú mobile, estados del formulario). Son maquetas: usan `{{huecos}}`, `<sc-for>` y una clase `Component` con `renderVals()`. Se abren en el navegador con un servidor estático (`npx serve design`). **No se copian tal cual al sitio:** se traducen a componentes de Astro.
- `design/assets/`: imágenes de prueba (`obras/w01.jpg`…) y la textura `grain.png`.

Copiá valores (colores, tamaños, espaciados, bordes) de los prototipos, no los inventes. Si algo no está diseñado, resolvelo con los mismos tokens y componentes.

## Rutas

| Ruta | Página | Prototipo |
|---|---|---|
| `/` | Home: hero + filtro por colección + grilla de todas las obras | `home.html` |
| `/colecciones` | Listado de colecciones | `colecciones.html` |
| `/colecciones/[slug]` | Una colección con sus obras | `coleccion.html` |
| `/obras/[slug]` | Página de obra | `obra.html` |
| `/acerca` | Bio, statement, trayectoria | `acerca.html` |
| `/contacto` | Datos + formulario | `contacto.html` |
| `/admin` | Sanity Studio | — |

En la navegación, "OBRAS" apunta a `/`. Mobile: `mobile-1.html` (home, colecciones, obra) y `mobile-2.html` (colección + menú abierto, acerca, contacto).

## Modelo de contenido (Sanity)

Hay un borrador listo en `reference/sanity/` (schemas + estructura del Studio). Usalo como base.

- **obra**: título, slug, año, técnica, alto/ancho/profundidad (cm), descripción, imagen principal (con texto alternativo), vistas adicionales (detalle / en sala / otra, cada una con alt), colección (referencia), orden.
- **coleccion**: nombre, slug, texto de presentación, orden. El período ("2020—2023") y la cantidad de obras **se calculan** a partir de sus obras; no se cargan a mano.
- **acerca** (documento único): foto, crédito de foto, bio, frase del statement, statement, secciones del CV (título + entradas año/texto), PDF del CV.
- **configuracion** (documento único): nombre del artista, ciudad, disciplinas, email, Instagram, representación, nota del taller, textos de la marquesina, descripción e imagen para SEO.

Valores derivados que se calculan en build: numeración de obras (01, 02…) según el orden, anterior/siguiente en la página de obra, "Más de esta colección", contadores de los filtros y el texto de la marquesina de cada página.

## Reglas

- **Las obras nunca se recortan.** En grillas y en la página de obra la imagen va dentro de un marco de alto fijo (`#121212`), centrada, con `max-width/max-height: 100%`. Las miniaturas cuadradas de las vistas sí pueden usar `object-fit: cover`.
- Las imágenes se piden al CDN de Sanity con ancho acorde y `auto=format`, con `srcset`/`sizes`, `loading="lazy"` salvo la primera, y `width`/`height` para evitar saltos de layout.
- El efecto de sobreimpresión (texto rosa + cian con `mix-blend-mode: screen`) es **decorativo**: el texto real va una sola vez y la copia lleva `aria-hidden="true"`.
- Las alturas de los títulos sobreimpresos se calculan según el tamaño de fuente (ver DESIGN.md) para que nunca se monten sobre lo que sigue.
- Accesibilidad: contraste AA, foco visible (`outline` ácido `#C6FF00`), botones de al menos 44 px, `aria-pressed` en filtros y vistas, `alt` obligatorio en el schema.
- Interacciones (filtro de la home, vistas de la obra, menú mobile, formulario) con JavaScript mínimo en `<script>` de Astro. Nada de frameworks en el sitio público.
- Textos de interfaz en español rioplatense ("Escribí", "tocá"). El contenido viene de Sanity.
- El sitio no vende: no hay precios ni carrito. "Consultar por esta obra" lleva a `/contacto?obra=<slug>` y precarga el campo.
- No subir claves al repo: `.env` con `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` y `PUBLIC_WEB3FORMS_KEY` (es pública por diseño de Web3Forms).

## Comandos

```
npm run dev        # sitio en http://localhost:4321 y Studio en /admin
npm run build
npm run preview
```

## Flujo de publicación

El cliente edita en `/admin` y toca "Publish". Un webhook de Sanity (filtro: `_type in ["obra","coleccion","acerca","configuracion"]`) llama al deploy hook del hosting, el sitio se regenera y queda online en uno o dos minutos. En sanity.io/manage hay que agregar como CORS origins `http://localhost:4321` y el dominio de producción, con "Allow credentials".
