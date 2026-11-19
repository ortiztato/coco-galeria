// Contenido de prueba para desarrollo (paso 4): obras de content/obras-ejemplo.csv con las
// imágenes de design/assets/obras. En el paso 5 se reemplaza por Sanity.
import fs from 'node:fs'
import path from 'node:path'
import type {ImageMetadata} from 'astro'
import type {Acerca, Coleccion, Configuracion, Contenido, Imagen, Obra, Vista} from './tipos'
import {slugify} from './texto'
import {parseCsv} from './csv'

const archivos = import.meta.glob<{default: ImageMetadata}>('/design/assets/obras/*.jpg', {eager: true})

export function imagenPrueba(nombre: string, alt = ''): Imagen {
  const entrada = archivos[`/design/assets/obras/${nombre}`]
  if (!entrada) throw new Error(`No existe la imagen de prueba ${nombre}`)
  const {src, width, height} = entrada.default
  return {src, width, height, alt}
}

const existe = (nombre: string) => `/design/assets/obras/${nombre}` in archivos

/**
 * Vistas adicionales por convención de nombre: para "w01.jpg" se buscan
 * "w01_d1.jpg", "w01_d2.jpg"… (detalles) y "w01_sala.jpg" (en sala).
 */
function vistasDe(imagen: string, titulo: string): Vista[] {
  const base = imagen.replace(/\.[^.]+$/, '')
  const ext = imagen.slice(base.length)
  const vistas: Vista[] = []
  for (let n = 1; existe(`${base}_d${n}${ext}`); n++) {
    vistas.push({tipo: 'detalle', imagen: imagenPrueba(`${base}_d${n}${ext}`, `${titulo}, detalle ${n}`)})
  }
  if (existe(`${base}_sala${ext}`)) {
    vistas.push({tipo: 'sala', imagen: imagenPrueba(`${base}_sala${ext}`, `${titulo} colgada en sala, para ver la escala`)})
  }
  return vistas
}

export function contenidoPrueba(): Contenido {
  const csv = fs.readFileSync(path.resolve('content/obras-ejemplo.csv'), 'utf-8')
  const filas = parseCsv(csv)

  const colecciones: Coleccion[] = []
  for (const f of filas) {
    if (f.coleccion && !colecciones.some((c) => c.nombre === f.coleccion)) {
      colecciones.push({
        slug: slugify(f.coleccion),
        nombre: f.coleccion,
        texto:
          '[Texto de la serie: qué busca, cómo surgió, con qué materiales trabaja. Dos o tres líneas que el artista escribe para presentar la colección.]',
      })
    }
  }

  const obras: Obra[] = filas.map((f) => ({
    slug: slugify(f.titulo),
    titulo: f.titulo,
    anio: Number(f.anio),
    tecnica: f.tecnica,
    medidas: {alto: Number(f.alto_cm) || undefined, ancho: Number(f.ancho_cm) || undefined},
    descripcion: f.descripcion || undefined,
    imagen: imagenPrueba(f.imagen, `${f.titulo}, vista completa`),
    vistas: vistasDe(f.imagen, f.titulo),
    coleccion: f.coleccion ? slugify(f.coleccion) : undefined,
  }))

  const fila = (anio: string, texto: string) => ({anio, texto})
  const acerca: Acerca = {
    creditoFoto: '[Crédito]',
    lugarFoto: 'Taller, [Ciudad]',
    bioDestacada:
      '[Nombre Apellido] (n. [año], [ciudad]) es artista visual. Trabaja principalmente en pintura, papel y collage. [Formación, talleres, maestros.]',
    bio: '[Segundo párrafo: dónde vive y trabaja, exposiciones o premios destacados, colecciones públicas o privadas que tienen su obra.]',
    statementFrase: '[Una frase del artista sobre su obra, en sus palabras.]',
    statement:
      '[Texto de statement: qué investiga, qué materiales y procesos usa, qué espera que pase frente a la obra. Entre 80 y 150 palabras.]',
    cv: [
      {titulo: 'Exposiciones individuales', entradas: Array.from({length: 3}, () => fila('[Año]', '[Exposición], [Espacio], [Ciudad]'))},
      {titulo: 'Exposiciones colectivas', entradas: Array.from({length: 4}, () => fila('[Año]', '[Exposición], [Espacio], [Ciudad]'))},
      {titulo: 'Premios y residencias', entradas: Array.from({length: 2}, () => fila('[Año]', '[Premio o residencia], [Institución]'))},
      {titulo: 'Formación', entradas: [fila('[Año]', '[Estudio o taller], [Institución], [Ciudad]')]},
    ],
    // En la prueba el botón se muestra para comparar con el diseño; sin PDF real se oculta.
    cvPdfUrl: '#',
  }

  const config: Configuracion = {
    nombre: 'Nombre Apellido',
    ciudad: '[Ciudad]',
    pais: '[País]',
    disciplinas: 'Pintura / Papel / Collage',
    email: '[email@dominio.com]',
    instagram: '[usuario]',
    representacion: '[Galería, si la hay]',
    notaTaller: 'Visitas al taller con cita previa.',
    marquesina: [],
    seoDescripcion: '[Descripción del sitio para buscadores.]',
  }

  return {obras, colecciones, acerca, config}
}
