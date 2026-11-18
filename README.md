# Paquete de arranque — sitio "Cartel"

Todo lo necesario para construir el sitio con Claude Code: diseño, reglas del proyecto, modelo de contenido y los prompts en orden.

## Cómo usarlo

1. Descomprimí esta carpeta donde quieras tener el proyecto e inicializá git (`git init`).
2. Abrí una terminal en la carpeta y corré `claude`. Claude Code lee `CLAUDE.md` solo.
3. Seguí `docs/PROMPTS.md` paso por paso.

Para ver las maquetas funcionando, abrí `design/prototype/home.html` en el navegador (o `npx serve design` y entrá a `/prototype/home.html`). Los links entre páginas, el filtro, las vistas de la obra, el menú mobile y el formulario funcionan.

## Qué hay

```
CLAUDE.md                  reglas del proyecto, stack, rutas, modelo de contenido
design/
  DESIGN.md                tokens, tipografía, componentes, página por página
  screenshots/             cómo tiene que verse cada página (desktop + mobile)
  prototype/               las 9 maquetas interactivas (HTML + support.js)
  assets/                  imágenes de prueba y textura de grano
reference/sanity/          borrador de schemas, estructura y config del Studio
content/obras-ejemplo.csv  formato para cargar obras en bloque (12 de prueba)
docs/PROMPTS.md            los prompts para Claude Code, en orden
```

## Antes de entregar

Todo lo que está entre [corchetes] es contenido de ejemplo: nombre, ciudad, bio, statement, CV, email, Instagram, textos de las colecciones. Las 12 obras y sus imágenes son de prueba y se reemplazan por las reales desde `/admin` o con el script de importación (paso 6).
