# Sistema visual — "Hoja de contacto"

En el cuarto oscuro, el fotógrafo imprime todos sus negativos en una hoja y marca con lápiz graso rojo las tomas que elige. El sitio toma ese clima de taller, archivo y fotocopia: negro de película con grano, blanco papel, metadatos a máquina, títulos en una grotesca extendida y pesada, marcas de corte alrededor de las obras y trazos rojos hechos a mano que señalan lo elegido.

Es un sitio de artista under, no un flyer: nada de neón, degradés, marquesinas animadas ni efectos de color sobre el texto. El único color de interfaz es el rojo del lápiz, y se usa en trazos, no en superficies.

> Las maquetas de `design/prototype/` y las capturas de `design/screenshots/` corresponden al diseño original ("Cartel", rosa/cian/ácido) y quedan sólo como referencia histórica de estructura y contenido. **La fuente de verdad del diseño actual es este documento y el código** (`src/styles/global.css` y `src/components/`).

## Tokens

Definidos en `src/styles/global.css`:

```css
:root {
  --negro: #0b0b0a;        /* fondo, siempre con public/grano.png encima (300 × 300) */
  --negro-2: #141412;      /* paneles (pared de la obra) */
  --negro-3: #1d1c1a;      /* miniaturas, placeholders */
  --linea: #2b2a27;        /* filetes de 1px */
  --linea-fuerte: #4a4843; /* bordes de campos */

  --blanco: #edebe5;       /* texto principal */
  --gris: #b3afa6;         /* párrafos */
  --tenue: #8a867e;        /* etiquetas y metadatos (AA sobre --negro) */

  --rojo: #f03a2e;         /* lápiz graso: trazos, foco, selección */
  --corte: rgb(237 235 229 / 0.55); /* marcas de corte */

  --grotesca: 'Archivo Variable';   /* font-stretch 125%, weight 800, mayúsculas */
  --mono: 'IBM Plex Mono';          /* 400 / 500 */

  --gutter: clamp(20px, 3.4vw, 56px);
  --ancho: 1560px;
}
```

El rojo nunca va como fondo de bloques grandes ni como color de texto corrido. Sólo en: trazos de `Marca`, el punto de "grabando" (`.punto`), los separadores ▸ del borde de película, el foco de teclado, la selección de texto y el hover del botón primario.

## Tipografía

| Uso | Fuente | Tamaño | Notas |
|---|---|---|---|
| Nombre en la home | Archivo 800, stretch 125% | `clamp(52px, 10.4vw, 184px)` | mayúsculas, `line-height: .86`, tracking −0.035em |
| Título de página (`.titulo-pagina`) | Archivo 800, stretch 125% | `clamp(44px, 7.4vw, 132px)` | mayúsculas, `line-height: .9` |
| Título de sección (`.titulo-seccion`) | Archivo 800, stretch 125% | `clamp(30px, 3.4vw, 52px)` | mayúsculas |
| Título de obra (página de obra) | Archivo 800, stretch 125% | `clamp(34px, 3.6vw, 60px)` | mayúsculas |
| Título de obra en grilla | Archivo 700, stretch 118% | 14 px (16 en colección, 12.5 mobile) | mayúsculas |
| Logo / nombre en header | Archivo 800, stretch 125% | 17 px (15 mobile) | mayúsculas |
| Navegación, filtros, botones | IBM Plex Mono 500 | 12–12.5 px | mayúsculas, tracking 0.05–0.06em |
| Etiquetas y metadatos (`.etiqueta`) | IBM Plex Mono 500 | 11–12 px | mayúsculas, color `--tenue` |
| Texto corrido (`.parrafo`) | IBM Plex Mono 400 | 15 px | `line-height: 1.75`, color `--gris`, máx. 66ch |
| Bio destacada | Archivo 500, stretch 100% | `clamp(24px, 2.4vw, 34px)` | caja normal |

Los números (años, conteos, numeración) van con `.num` (`tabular-nums`).

## Componentes

### Marca (`src/components/Marca.astro`)
Trazo de lápiz rojo hecho a mano, en SVG decorativo (`aria-hidden`). Su padre lleva la clase global `con-marca` (position: relative).

- `tipo`: `circulo` (encierra un texto), `subrayado`, `recuadro` (alrededor de una obra), `cruz` (tacha) y `flecha` (en línea).
- `modo="fija"`: siempre visible; se dibuja con un barrido de izquierda a derecha al aparecer (0,6 s).
- `modo="hover"`: aparece con el mouse o el foco de teclado sobre el padre.
- Con `prefers-reduced-motion` aparecen sin animación.
- Dónde se usa: sección activa del menú (círculo), filtro / motivo elegido (círculo), obra "Selección" de la home y vista elegida en la obra (recuadro), obras de la grilla al pasar el mouse (recuadro), links de colecciones y "Escribime" (subrayado al pasar), flechas de "Ver la obra" y del footer, "GRACIAS" del formulario (círculo) y el 404 (cruz).

### Marcas de corte (`.corte`)
Esquinas en L de 1px alrededor de una obra, por fuera de la imagen (`inset: -10px`, −7px en mobile). No ocupan lugar ni tapan nada. Se usan en las obras de la grilla, la obra seleccionada, la vista grande de la página de obra y la foto del artista.

### Grilla de obras (`ObraGrid` + `ObraCard`)
Como una hoja de contacto: cada fila tiene un alto común y cada obra ocupa el ancho que le da su proporción real (`--r = ancho / alto`). **Nunca se recorta ni se deforma.**

- `flex: var(--r) 1 calc(var(--r) * var(--alto-fila))` y `max-width: calc(var(--r) * var(--alto-fila) * var(--crecer, 1.6))`.
- Un relleno final (`flex-grow` enorme) evita que la última fila se agrande.
- Alto de fila: home 300 px, colección 360 px (con `--crecer: 1.35`), "más de" 220 px; mobile 190 / 160 px.
- Debajo de cada obra, su ficha: número + muestra del color dominante + año, título, técnica — medidas.
- Hover: recuadro rojo alrededor de la imagen y título subrayado en rojo.
- La imagen se pide al CDN de Sanity con `srcset` y muestra el LQIP mientras carga.

### Filtros / selector (`FilterChips`)
Botones de texto a máquina con `aria-pressed`. El elegido queda encerrado con un círculo rojo. En mobile se deslizan de costado (o bajan de línea con `envolver`). Disparan el evento `chips:cambio`.

### Filas de listado (`ListRow`)
- `coleccion`: número, nombre gigante en la grotesca, "4 obras — 2020—2023", tira con todas sus obras (enteras, a 84 px de alto) y flecha roja que aparece al pasar el mouse.
- `compacta`: "Otras colecciones", nombre y conteo.

### Ficha técnica (`DataList`)
`<dl>` a máquina: rótulo chico a la izquierda (112 px) y dato a la derecha, separados por filetes.

### Botones (`Button`)
Mono 500, mayúsculas, sin bordes redondeados. `primario`: fondo blanco papel y texto negro (al pasar el mouse, rojo). `secundario`: filete de 1px blanco, fondo transparente (al pasar, se invierte). Alto 48 px (`lg`: 56 px).

### Aviso (`Aviso`)
Barra arriba de todo, sólo si "Datos del sitio → Avisos" tiene frases. Mono 12 px mayúsculas, punto rojo de "en vivo", frases separadas por "/". Estática, sin animación.

### Header
Logo (nombre) a la izquierda en la grotesca; navegación a máquina a la derecha. La sección actual lleva `aria-current` y un círculo rojo; las demás, un subrayado rojo al pasar el mouse. En mobile, botón "MENÚ" con borde que abre un panel a pantalla completa con los ítems numerados (01–04) en la grotesca a 30 px y los conteos de obras y colecciones.

### Footer
"Consultas · exposiciones · prensa" + "ESCRIBIME" gigante con flecha roja (link a contacto). Debajo, una línea de borde de película (nombre ▸ artista visual ▸ ciudad ▸ obra 2020—2024) y la línea final con © , email e Instagram. En contacto se usa sólo la línea final.

## Página por página

- **Home:** línea de borde de película con los datos (artista visual ▸ ciudad ▸ disciplinas ▸ período ▸ cantidad de obras), el nombre enorme y la obra "Selección" (la primera del orden) recuadrada en rojo, con su ficha a la izquierda y un texto vertical de borde de película al costado. Abajo, "OBRAS" con el conteo en rojo, el filtro por colección y la grilla.
- **Colecciones:** "N series", título, texto corto y una fila por colección.
- **Colección:** migas, "Colección 01", nombre gigante, obras y período en la grotesca, texto de la serie, grilla grande y "Otras colecciones".
- **Obra:** migas y "01 / 12"; a la izquierda la obra sobre un panel (`--negro-2`) con marcas de corte y el código de cuadro (▸ 01A); debajo las vistas como cuadros de una tira (01A obra completa, 01B detalle…), la elegida recuadrada en rojo. A la derecha (sticky): Nº, muestra de color, colección, título, ficha técnica, descripción y "Consultar por esta obra →". Abajo, anterior / siguiente y "Más de [colección]".
- **Acerca de:** foto del artista en blanco y negro (`grayscale`, como fotocopia) con marcas de corte, bio destacada, bio, statement (frase en la grotesca), botones y trayectoria a máquina.
- **Contacto:** datos (email, Instagram, taller, representación) en la grotesca; formulario a máquina con campos subrayados (rojo con foco), motivo con círculo rojo y estado "GRACIAS" encerrado en rojo.
- **404:** "404" gigante tachado con una cruz roja.

## Responsive

- Breakpoint principal en 768 px: la navegación pasa a "MENÚ", la ficha y las columnas se apilan y la grilla baja el alto de fila.
- Entre 768 y 1024 px, la obra seleccionada de la home y la página de obra pasan a una columna.
- Gutter lateral: `clamp(20px, 3.4vw, 56px)`.
- Ninguna página debe tener scroll horizontal a 390 px (cuidado con títulos largos en la grotesca extendida).

## Favicon

Generado en el build (`src/lib/favicon.ts`): la inicial del nombre en IBM Plex Mono 600, blanca sobre negro, subrayada con un trazo rojo. No usar un círculo alrededor de la letra (con la "C" se lee como ©).
