# Sistema visual — "Cartel"

Negro con grano, dos tintas sobreimpresas (rosa + cian) y un verde ácido para señalar. Tipografía de cartel muy condensada para todo lo grande y monoespaciada para todo lo chico. La obra siempre va limpia sobre un marco oscuro.

Ver `screenshots/sistema.png` para el resumen visual.

## Tokens

```css
:root {
  --bg: #0A0A0A;          /* fondo, siempre con la textura grain.png encima */
  --frame: #121212;       /* marco de las obras */
  --surface: #141414;     /* miniaturas, placeholders */
  --line: #262626;        /* separadores de 1px */
  --line-strong: #3A3A3A; /* borde de chips y campos inactivos */
  --text: #F2F2F2;        /* texto y líneas de 2px */
  --text-body: #D4D4D4;   /* párrafos largos */
  --muted: #A3A3A3;       /* etiquetas, metadatos */
  --placeholder: #6B6B6B;
  --pink: #FF48B0;        /* tinta 1 · estado activo · CTA */
  --cyan: #00B3FF;        /* tinta 2 · nombre de colección */
  --acid: #C6FF00;        /* señal: marquesina, nav activa, botón primario, flechas */

  --font-display: 'Six Caps', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --gutter: clamp(20px, 3vw, 40px);  /* padding lateral de toda la página */
}
.grain { background-color: var(--bg); background-image: url(grain.png); background-size: 300px 300px; }
```

Sobre fondo rosa o ácido, el texto va en `--bg` (negro), nunca en blanco.

## Tipografía

| Uso | Fuente | Tamaño | Notas |
|---|---|---|---|
| Hero de página (nombre, COLECCIONES, ACERCA DE…) | Six Caps | `clamp(210px, 26–28vw, 380–410px)` | sobreimpreso, una línea, `white-space: nowrap` |
| Título de obra (página de obra) | Six Caps | 160 px desktop / 100 px mobile | sobreimpreso, puede ir en 2 líneas, `line-height: .95` |
| Nombre de colección en listado | Six Caps | `clamp(96px, 10vw, 150px)` | color alternado por fila: blanco, cian, blanco, rosa |
| Título en tarjeta de obra | Six Caps | 62 px home / 72 px colección / 36 px mobile | `line-height: .95` |
| Datos grandes (año, técnica, medidas) | Six Caps | 48 px desktop / 36 px mobile | |
| Logo / nombre en header | Six Caps | 44 px desktop / 34 px mobile | |
| Navegación, etiquetas, chips, botones | JetBrains Mono 700 | 12–14 px | MAYÚSCULAS |
| Texto corrido | JetBrains Mono 400 | 15 px desktop / 13 px mobile | `line-height: 1.7`, color `--text-body`, ancho máx. ~680 px |

Six Caps se usa siempre en mayúsculas (`text-transform: uppercase` o el texto ya en mayúsculas).

## Componentes

### Marquesina
Barra superior de ancho completo, fondo `--acid`, texto negro Mono 700 13 px, `padding: 7px 0`, una línea que corta con `overflow: hidden`. Contenido: frases separadas por "★". Es decorativa (`aria-hidden`). Opcional: animarla con un desplazamiento lento, respetando `prefers-reduced-motion`.

### Header
`padding: 16px var(--gutter)`, `border-bottom: 2px solid var(--text)`. A la izquierda el nombre en Six Caps; a la derecha la nav en Mono 700 14 px con `gap: 24px`. La página activa va en `--acid` y entre corchetes: `[OBRAS]`. En mobile la nav se reemplaza por un botón "MENÚ" (fondo ácido, alto 44 px) que abre un panel a pantalla completa con los 4 ítems en Six Caps de 120 px (ver `mobile-2.html`).

### Título sobreimpreso
Dos `span` absolutos con el mismo texto dentro de un contenedor `position: relative`:
- capa 1: `color: var(--pink)`, en `left: 0; top: 0`
- capa 2: `color: var(--cyan)`, desplazada `left: 16px; top: 12px` (desktop) u `8px / 7px` (mobile); lleva `aria-hidden="true"`
- ambas con `mix-blend-mode: screen` y `line-height: .78` (una línea) o `.95` (dos líneas).

**Alto del contenedor:** Six Caps ocupa unos 0.92 × font-size de alto. Contenedor = `0.92 × font-size × líneas + desplazamiento`. Valores usados: home `clamp(210px, 27.5vw, 400px)`; colección, acerca y contacto `clamp(210px, 25.5vw, 370px)`; colecciones `clamp(190px, 20vw, 290px)`; footer `clamp(140px, 14.6vw, 212px)`. Debajo del hero va una línea de 2px `--text`.

### Tarjeta de obra
- Marco de imagen: alto fijo (360 px home, 520 px colección, 280 px "más de", 180 px mobile), fondo `--frame`, padding 36–48 px, imagen centrada sin recorte.
- Pie: número + año en Mono 12 px `--muted`, título en Six Caps, colección en Mono 12 px `--cyan`.
- Grilla: `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))` (home) o `minmax(440px, 1fr)` (colección), `gap: 0`. Las líneas son `border-right` + `border-bottom: 1px solid var(--line)` en cada tarjeta, así las celdas vacías quedan negras. Mobile: 2 columnas.
- Hover: el título pasa a `--pink`.

### Chip de filtro / selector
Alto mín. 44 px, `padding: 0 16px`, Mono 700 13 px. Inactivo: borde 1px `--line-strong`, fondo transparente. Activo: fondo `--pink`, texto negro, `aria-pressed="true"`. Muestra el conteo entre paréntesis con opacidad .7.

### Fila de listado (colecciones, "otras colecciones", trayectoria)
Ancho completo, separadas por `1px solid var(--line)`. Número en Mono `--muted`, nombre en Six Caps grande, metadatos en Mono 13 px, miniaturas de 110 px (82 px mobile) y flecha "→" en Six Caps `--acid` al final.

### Botones
- Primario: fondo `--acid` o `--pink`, texto negro Mono 700 13–14 px, alto 48–56 px, sin borde ni radio.
- Secundario: borde 1px `--text`, fondo transparente.
- Sin `border-radius` en ningún lado (sólo los marcos de teléfono de las maquetas lo tienen).

### Sombra de registro
`box-shadow: 14px 14px 0 var(--cyan), -14px -14px 0 var(--pink)` (8px en mobile). **Sólo** en la imagen principal de la página de obra (vista "obra completa") y en la foto del artista. Las demás imágenes van limpias.

### Datos de la obra
Lista `<dl>` con `border-top: 2px solid var(--text)`. Cada fila: etiqueta Mono 12 px `--muted` a la izquierda y valor en Six Caps 48 px a la derecha, separadas por `1px solid var(--line)`.

### Formulario
Campos sin caja: sólo `border-bottom: 2px solid var(--line-strong)`, que pasa a `--acid` con foco. Etiqueta Mono 700 12 px `--muted` arriba del campo. Texto del campo en Mono 16 px (evita el zoom de iOS). El estado "enviado" reemplaza el formulario por "GRACIAS ★" sobreimpreso + texto + dos botones.

### Footer
"CONTACTO →" sobreimpreso grande con link a `/contacto`, y a la derecha Instagram, email y © en Mono 13 px. En la página de contacto se usa una versión corta en una sola línea.

## Página por página

- **Home:** marquesina, header, hero con el nombre, línea con "ARTISTA VISUAL · [CIUDAD] | OBRA 2020—2024 | DISCIPLINAS", barra de filtros por colección (+ "VER COLECCIONES →"), grilla de todas las obras y footer. El filtro funciona en el cliente y no recarga la página.
- **Colecciones:** hero "COLECCIONES" con texto corto a la derecha, filas por colección con miniaturas de todas sus obras.
- **Colección:** migas (COLECCIONES / NOMBRE), hero con el nombre, cantidad de obras y período en Six Caps, texto de la serie, grilla de obras, "OTRAS COLECCIONES" en filas y footer.
- **Obra:** migas + anterior/siguiente + "01 / 12"; a la izquierda el marco grande con la vista activa y los botones de vistas (miniatura + etiqueta); a la derecha (sticky) N.º y colección, título sobreimpreso, datos, descripción y "CONSULTAR POR ESTA OBRA →". Abajo, "MÁS DE [COLECCIÓN]" con las otras obras de la serie. En mobile todo va en una columna y anterior/siguiente pasa al final.
- **Acerca de:** hero, foto con sombra de registro + crédito, BIO (primer párrafo a 22 px), STATEMENT (frase en Six Caps 64 px + texto), botones de contacto y CV, y TRAYECTORIA en filas por sección.
- **Contacto:** hero; a la izquierda email, Instagram, taller y representación en Six Caps 64 px; a la derecha el formulario con motivo (consulta por una obra / exposiciones / prensa). El tercer campo cambia de etiqueta según el motivo (OBRA / ESPACIO o PROYECTO / MEDIO).

## Responsive

- Breakpoint principal alrededor de 768 px: la nav pasa a "MENÚ", las columnas de obra, acerca y contacto se apilan, la grilla pasa a 2 columnas.
- Los heros multilínea en mobile se parten a mano en 2 líneas ("NOMBRE / APELLIDO", "CAMPOS / DE COLOR") con `line-height: .95`.
- El gutter lateral baja a 16 px en mobile.
