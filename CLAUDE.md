# Sitio de artista — "Cartel"

Sitio de **exhibición** (no de venta) para un artista plástico. El arte es el protagonista; la UI es fuerte pero nunca tapa ni recorta una obra. El cliente no es técnico y edita todo el contenido desde un panel (Sanity Studio en `/admin`).

## Stack

- **Astro** (última versión estable), `output: 'static'`.
- **Sanity** como CMS, con la integración oficial **`@sanity/astro`** y el Studio embebido en `/admin` (`studioBasePath: '/admin'`). Con salida estática el Studio usa ruteo por hash y no necesita servidor.
- **`@astrojs/react`**: sólo lo necesita el Studio. El sitio público no usa React.
- **`@sanity/image-url`** para las imágenes (tamaños y formatos desde el CDN de Sanity).
- **`@sanity/orderable-document-list`** para que el cliente ordene obras y colecciones arrastrando.
- **CSS propio** con custom properties (sin Tailwind ni frameworks de UI). Estilos con scope por componente de Astro + un `global.css` con los tokens.
- **Fuentes autoalojadas** con `@fontsource-variable/archivo` (eje de ancho, usada extendida al 125 %) y `@fontsource/ibm-plex-mono` (400 y 500).
- **Formulario de contacto:** Web3Forms (o Formspree): POST desde el navegador, sin backend.
- **Hosting:** Netlify (plan gratuito, `netlify.toml`), publicado desde la rama `main` de GitHub. Un webhook de Sanity llama al build hook al publicar.

## Fuente de verdad del diseño

El diseño actual es **"Hoja de contacto"**: negro de película con grano, blanco papel, metadatos a máquina, títulos en una grotesca extendida, marcas de corte alrededor de las obras y trazos de lápiz rojo hechos a mano. Leé `design/DESIGN.md` antes de tocar cualquier vista: ahí están los tokens, la tipografía, los componentes y cada página. Los valores viven en `src/styles/global.css` y en `src/components/`.

- `design/prototype/*.html` y `design/screenshots/*.png` son del **diseño original** ("Cartel": rosa, cian y verde ácido). Quedan sólo como referencia de estructura y contenido; **no copies sus estilos**.
- `design/assets/`: imágenes de prueba (`obras/w01.jpg`…) y la textura de grano (copiada a `public/grano.png`).

Si algo no está diseñado, resolvelo con los mismos tokens y componentes (`Marca`, `.corte`, `ObraGrid`, `FilterChips`, `ListRow`, `DataList`, `Button`).

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

En la navegación, "OBRAS" apunta a `/`. La columna "Prototipo" es la maqueta original de cada página (sólo estructura, ver arriba).

## Modelo de contenido (Sanity)

Hay un borrador listo en `reference/sanity/` (schemas + estructura del Studio). Usalo como base.

- **obra**: título, slug, año, técnica, alto/ancho/profundidad (cm), descripción, imagen principal (con texto alternativo), vistas adicionales (detalle / en sala / otra, cada una con alt), colección (referencia), orden.
- **coleccion**: nombre, slug, texto de presentación, orden. El período ("2020—2023") y la cantidad de obras **se calculan** a partir de sus obras; no se cargan a mano.
- **acerca** (documento único): foto, crédito de foto, bio, frase del statement, statement, secciones del CV (título + entradas año/texto), PDF del CV.
- **configuracion** (documento único): nombre del artista, ciudad, disciplinas, email, Instagram, representación, nota del taller, avisos (barra superior opcional; el campo se llama `marquesina` por compatibilidad), descripción e imagen para SEO.

Valores derivados que se calculan en build: numeración de obras (01, 02…) según el orden, anterior/siguiente en la página de obra, "Más de esta colección", períodos y contadores de los filtros. De cada imagen se usan también el color dominante y el LQIP que calcula Sanity.

## Reglas

- **Las obras nunca se recortan ni se deforman.** En las grillas cada obra ocupa el ancho que le da su proporción real (filas de alto común, ver `ObraGrid`); en la página de obra va centrada en un panel con `max-width/max-height`. Las miniaturas cuadradas de las vistas sí pueden usar `object-fit: cover`. La UI nunca tapa una obra: las marcas de corte y los trazos rojos van por fuera.
- Las imágenes se piden al CDN de Sanity con ancho acorde y `auto=format`, con `srcset`/`sizes`, `loading="lazy"` salvo la primera, y `width`/`height` para evitar saltos de layout.
- Los trazos de lápiz rojo (`Marca`) y las marcas de corte son **decorativos**: van con `aria-hidden`, nunca reemplazan un texto ni un estado (`aria-current` / `aria-pressed` siguen siendo la fuente de verdad) y respetan `prefers-reduced-motion`.
- El rojo (`--rojo`) es el único color de interfaz y se usa en trazos, no en superficies. Nada de neón, degradés ni marquesinas animadas.
- Accesibilidad: contraste AA, foco visible (`outline` rojo de 2px), botones de al menos 44 px, `aria-pressed` en filtros y vistas, `alt` obligatorio en el schema.
- Interacciones (filtro de la home, vistas de la obra, menú mobile, formulario) con JavaScript mínimo en `<script>` de Astro. Nada de frameworks en el sitio público.
- Textos de interfaz en español rioplatense ("Escribí", "tocá"). El contenido viene de Sanity.
- El sitio no vende: no hay precios ni carrito. "Consultar por esta obra" lleva a `/contacto?obra=<slug>` y precarga el campo.
- No subir claves al repo: `.env` con `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` y `PUBLIC_WEB3FORMS_KEY` (es pública por diseño de Web3Forms). Opcionales: `SANITY_WRITE_TOKEN` (sólo para `npm run importar`) y `CONTENIDO_PRUEBA=1` (usa el CSV de ejemplo en vez de Sanity; nunca en producción).

## Comandos

```
npm run dev        # sitio en http://localhost:4321 y Studio en /admin
npm run build
npm run preview
npm run importar   # carga obras desde un CSV a Sanity (ver scripts/importar.ts)
```

## Flujo de publicación

El cliente edita en `/admin` y toca "Publish". Un webhook de Sanity (filtro: `_type in ["obra","coleccion","acerca","configuracion"]`) llama al deploy hook del hosting, el sitio se regenera y queda online en uno o dos minutos. En sanity.io/manage hay que agregar como CORS origins `http://localhost:4321` y el dominio de producción, con "Allow credentials".
