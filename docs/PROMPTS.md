# Prompts para Claude Code, paso a paso

Pegá uno por vez. Revisá el resultado (en el navegador y en el diff) antes de pasar al siguiente. Si algo no queda igual al diseño, pedile que lo compare con la captura correspondiente de `design/screenshots/`.

Antes de empezar:
1. Creá el proyecto en [sanity.io/manage](https://www.sanity.io/manage) (o con `npm create sanity@latest` y salir sin generar Studio) y anotá el **Project ID**. Dataset: `production`.
2. Creá una cuenta en [web3forms.com](https://web3forms.com) con el email del artista y anotá la **Access Key**.

---

## 0. Orientación

> Leé `CLAUDE.md` y `design/DESIGN.md`, y mirá todas las capturas de `design/screenshots/`. Después resumime en pocas líneas qué vas a construir y qué dudas tenés. Todavía no escribas código.

## 1. Proyecto base

> Inicializá en esta carpeta un proyecto Astro (última versión estable, TypeScript estricto, `output: 'static'`) sin borrar `design/`, `reference/`, `content/` ni `docs/`. Instalá y configurá `@sanity/astro` con el Studio embebido en `/admin`, `@astrojs/react`, `@sanity/image-url`, `@sanity/orderable-document-list`, `@fontsource/six-caps` y `@fontsource/jetbrains-mono`. Creá `.env.example` con `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` y `PUBLIC_WEB3FORMS_KEY`, y agregá `.env` al `.gitignore`. Copiá `reference/sanity/` a su lugar (`sanity.config.ts` en la raíz y los schemas en `src/sanity/`). Al terminar, `npm run dev` tiene que levantar y `/admin` tiene que mostrar el Studio con Obras, Colecciones, Acerca de y Datos del sitio.

*(Vos: completá `.env` con el Project ID y agregá `http://localhost:4321` en CORS origins de Sanity, con "Allow credentials".)*

## 2. Tokens y layout

> Creá `src/styles/global.css` con los tokens de `design/DESIGN.md`, la clase `.grain` (copiá `design/assets/grain.png` a `public/`), las fuentes y estilos base (foco visible, reset mínimo). Armá `src/layouts/Base.astro` con marquesina, header (nav con estado activo y menú mobile según `design/prototype/mobile-2.html`) y footer. Hacé una página `/` vacía con ese layout y comparala con `design/screenshots/home.png`.

## 3. Componentes

> Creá los componentes reutilizables de DESIGN.md: `Overprint` (título sobreimpreso, con la copia en `aria-hidden` y el alto calculado según tamaño y líneas), `Marquee`, `ObraCard`, `ObraGrid`, `FilterChips`, `ListRow`, `DataList` (datos de obra) y `Button`. Hacé una página temporal `/dev/componentes` que los muestre todos, como `design/screenshots/sistema.png`.

## 4. Páginas con datos de prueba

> Armá todas las páginas de la tabla de rutas de `CLAUDE.md`, con datos de prueba tomados de `content/obras-ejemplo.csv` y las imágenes de `design/assets/obras/`. Cada página tiene que verse igual a su captura en desktop (1440 px) y a los tableros mobile en 390 px. Incluí las interacciones: filtro de la home sin recargar, cambio de vistas en la obra, menú mobile, motivo del formulario y estado "enviado". Usá JavaScript mínimo en `<script>` de Astro. Al terminar, sacá capturas con Playwright a 1440 y 390 px y comparalas con `design/screenshots/`.

## 5. Conectar Sanity

> Reemplazá los datos de prueba por consultas GROQ a Sanity en `src/sanity/queries.ts`, con tipos. Ordená obras y colecciones por `orderRank`. Calculá en build la numeración, anterior/siguiente, "Más de esta colección", la cantidad de obras y el período de cada colección y los contadores del filtro. Las imágenes van con `@sanity/image-url`: `srcset` de 400 a 2400 px, `auto=format`, `width`/`height` reales y nunca recortadas, salvo las miniaturas cuadradas de las vistas. Si un campo opcional viene vacío, ocultá esa parte sin romper el diseño.

## 6. Importar contenido

> Escribí un script `scripts/importar.ts` que lea `content/obras-ejemplo.csv` (o el CSV que yo te pase con el mismo formato), suba las imágenes de una carpeta que le indique, cree las colecciones que falten y las obras con su referencia a la colección, y cree los documentos únicos `acerca` y `configuracion` con textos entre corchetes. Usá un token de escritura desde `SANITY_WRITE_TOKEN` en `.env` (nunca en el código). Tiene que poder correrse dos veces sin duplicar nada (usá IDs determinísticos).

*(Vos: creá el token en sanity.io/manage → API → Tokens, con permiso Editor, y borralo cuando termines de importar.)*

## 7. Contacto

> Conectá el formulario de `/contacto` a Web3Forms con `PUBLIC_WEB3FORMS_KEY`: envío con `fetch`, honeypot antispam, validación nativa, estados enviando / enviado / error. El motivo y la obra viajan en el asunto del email. Si la URL trae `?obra=<slug>`, precargá el motivo "Consulta por una obra" y el título de la obra.

## 8. SEO y detalles

> Agregá `<title>` y meta descripción por página, Open Graph con la imagen de la obra (o la de "Datos del sitio"), `sitemap` con `@astrojs/sitemap`, `robots.txt`, favicon simple con la inicial en Six Caps sobre negro, página 404 con el estilo del sitio y `prefers-reduced-motion` para la marquesina. Corré Lighthouse en home y en una obra y corregí lo que baje de 90.

## 9. Deploy

> Preparame el deploy en Vercel (o Netlify): build `npm run build`, salida `dist`, variables de entorno. Explicame paso a paso cómo crear el deploy hook en el hosting y el webhook en Sanity (sanity.io/manage → API → Webhooks) para que publicar en `/admin` dispare un rebuild. El filtro del webhook es `_type in ["obra","coleccion","acerca","configuracion"]`. Recordame agregar el dominio de producción en CORS origins.

## 10. Entrega al cliente

> Escribí `docs/GUIA-CLIENTE.md` en lenguaje simple, para alguien no técnico: cómo entrar a `/admin`, cargar una obra nueva (fotos recomendadas, texto alternativo), ordenar obras arrastrando, crear una colección, editar Acerca de y Datos del sitio, y cuánto tarda en verse un cambio publicado.

*(Vos: invitá al cliente al proyecto de Sanity con rol Editor.)*
