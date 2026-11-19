// Importa obras desde un CSV a Sanity: sube las imágenes, crea las colecciones que falten,
// crea o actualiza las obras y crea "Acerca de" y "Datos del sitio" si todavía no existen.
//
// Uso:
//   npm run importar
//   npm run importar -- --csv ruta/obras.csv --imagenes ruta/carpeta-de-fotos
//
// Por defecto usa content/obras-ejemplo.csv y design/assets/obras.
// Necesita en .env: PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET y SANITY_WRITE_TOKEN (permiso Editor).
//
// Se puede correr varias veces sin duplicar nada:
// - los IDs son determinísticos (obra-<slug>, coleccion-<slug>) y si ya existe una obra o colección
//   con el mismo slug se reutiliza su documento;
// - las imágenes no se vuelven a subir si ya están (se buscan por su hash);
// - en las obras se actualizan sólo los campos que vienen del CSV; el orden y los textos alternativos
//   que el cliente haya editado se conservan;
// - las colecciones, "Acerca de" y "Datos del sitio" sólo se crean si no existen (nunca se pisan).
//
// Formato del CSV (encabezados): titulo, anio, tecnica, alto_cm, ancho_cm, coleccion, imagen, descripcion
// Opcionales: profundidad_cm, alt (texto alternativo de la imagen principal).
// Vistas adicionales por nombre de archivo: para "w01.jpg" se suben "w01_d1.jpg", "w01_d2.jpg"… (detalles)
// y "w01_sala.jpg" (en sala) si están en la carpeta.

import fs from 'node:fs'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {createClient, type SanityClient} from '@sanity/client'
import {LexoRank} from 'lexorank'
import {parseCsv} from '../src/lib/csv.ts'
import {slugify} from '../src/lib/texto.ts'

// ── Configuración ────────────────────────────────────────────────────────

function argumento(nombre: string, porDefecto: string): string {
  const i = process.argv.indexOf(`--${nombre}`)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto
}

const rutaCsv = path.resolve(argumento('csv', 'content/obras-ejemplo.csv'))
const carpetaImagenes = path.resolve(argumento('imagenes', 'design/assets/obras'))

if (fs.existsSync('.env')) process.loadEnvFile('.env')
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

function salir(mensaje: string): never {
  console.error(`\n✖ ${mensaje}\n`)
  process.exit(1)
}

if (!projectId) salir('Falta PUBLIC_SANITY_PROJECT_ID en .env.')
if (!token) salir('Falta SANITY_WRITE_TOKEN en .env (sanity.io/manage → API → Tokens, permiso Editor).')
if (!fs.existsSync(rutaCsv)) salir(`No encuentro el CSV: ${rutaCsv}`)
if (!fs.existsSync(carpetaImagenes)) salir(`No encuentro la carpeta de imágenes: ${carpetaImagenes}`)

const client: SanityClient = createClient({projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false})

// ── Utilidades ───────────────────────────────────────────────────────────

const ref = (_ref: string) => ({_type: 'reference', _ref})
const numero = (v: string | undefined) => {
  const n = Number(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : undefined
}

/** Siguiente rango para el orden por arrastre, después del último existente. */
function generadorDeRangos(ultimo: string | undefined) {
  let rango = ultimo ? LexoRank.parse(ultimo) : LexoRank.min()
  return () => {
    rango = rango.genNext().genNext()
    return rango.toString()
  }
}

const subidas = {nuevas: 0, existentes: 0}
const cacheAssets = new Map<string, string>()

/** Sube una imagen (o reutiliza la que ya está, buscándola por hash) y devuelve el ID del asset. */
async function subirImagen(archivo: string): Promise<string> {
  const ruta = path.join(carpetaImagenes, archivo)
  const contenido = fs.readFileSync(ruta)
  const sha1 = createHash('sha1').update(contenido).digest('hex')
  const enCache = cacheAssets.get(sha1)
  if (enCache) return enCache

  const existente = await client.fetch<string | null>(`*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]._id`, {sha1})
  if (existente) {
    subidas.existentes++
    cacheAssets.set(sha1, existente)
    return existente
  }
  const asset = await client.assets.upload('image', contenido, {filename: archivo})
  subidas.nuevas++
  cacheAssets.set(sha1, asset._id)
  return asset._id
}

/** Vistas por convención de nombre: base_d1, base_d2… y base_sala. */
function archivosDeVistas(imagen: string): {archivo: string; tipo: 'detalle' | 'sala'; key: string}[] {
  const ext = path.extname(imagen)
  const base = imagen.slice(0, -ext.length)
  const existe = (f: string) => fs.existsSync(path.join(carpetaImagenes, f))
  const vistas: {archivo: string; tipo: 'detalle' | 'sala'; key: string}[] = []
  for (let n = 1; existe(`${base}_d${n}${ext}`); n++) vistas.push({archivo: `${base}_d${n}${ext}`, tipo: 'detalle', key: `d${n}`})
  if (existe(`${base}_sala${ext}`)) vistas.push({archivo: `${base}_sala${ext}`, tipo: 'sala', key: 'sala'})
  return vistas
}

// ── Textos de ejemplo para los documentos únicos ─────────────────────────

const entrada = (anio: string, texto: string, i: number) => ({_type: 'entradaCv', _key: `e${i}`, anio, texto})
const acercaEjemplo = {
  _id: 'acerca',
  _type: 'acerca',
  creditoFoto: '[Crédito]',
  lugarFoto: 'Taller, [Ciudad]',
  bioDestacada:
    '[Nombre Apellido] (n. [año], [ciudad]) es artista visual. Trabaja principalmente en pintura, papel y collage. [Formación, talleres, maestros.]',
  bio: '[Segundo párrafo: dónde vive y trabaja, exposiciones o premios destacados, colecciones públicas o privadas que tienen su obra.]',
  statementFrase: '[Una frase del artista sobre su obra, en sus palabras.]',
  statement:
    '[Texto de statement: qué investiga, qué materiales y procesos usa, qué espera que pase frente a la obra. Entre 80 y 150 palabras.]',
  cv: [
    {titulo: 'Exposiciones individuales', n: 3, texto: '[Exposición], [Espacio], [Ciudad]'},
    {titulo: 'Exposiciones colectivas', n: 3, texto: '[Exposición], [Espacio], [Ciudad]'},
    {titulo: 'Premios y residencias', n: 2, texto: '[Premio o residencia], [Institución]'},
    {titulo: 'Formación', n: 1, texto: '[Estudio o taller], [Institución], [Ciudad]'},
  ].map((s, i) => ({
    _type: 'seccionCv',
    _key: `s${i}`,
    titulo: s.titulo,
    entradas: Array.from({length: s.n}, (_, j) => entrada('[Año]', s.texto, j)),
  })),
}

const configuracionEjemplo = {
  _id: 'configuracion',
  _type: 'configuracion',
  nombre: '[Nombre Apellido]',
  ciudad: '[Ciudad]',
  pais: '[País]',
  disciplinas: '[Pintura / Papel / Collage]',
  email: 'email@dominio.com',
  instagram: '[usuario]',
  representacion: '[Galería, si la hay]',
  notaTaller: '[Visitas al taller con cita previa.]',
  marquesina: [],
  seoDescripcion: '[Descripción del sitio para buscadores: quién es el artista y qué hace, en una o dos oraciones.]',
}

// ── Importación ──────────────────────────────────────────────────────────

interface Existente {
  _id: string
  _type: 'obra' | 'coleccion'
  slug?: string
  orderRank?: string
  altPrincipal?: string
  vistas?: {_key: string; alt?: string}[]
}

async function main() {
  console.log(`\nImportando a ${projectId}/${dataset}`)
  console.log(`  CSV:      ${path.relative(process.cwd(), rutaCsv)}`)
  console.log(`  Imágenes: ${path.relative(process.cwd(), carpetaImagenes)}\n`)

  const filas = parseCsv(fs.readFileSync(rutaCsv, 'utf-8').replace(/^﻿/, ''))
  const faltan = ['titulo', 'anio', 'tecnica', 'imagen'].filter((h) => filas.length && !(h in filas[0]))
  if (faltan.length) salir(`Al CSV le faltan columnas: ${faltan.join(', ')}`)

  // Filas válidas: con título y con la imagen principal en la carpeta.
  const validas = filas.filter((f, i) => {
    const linea = i + 2
    if (!f.titulo) return console.warn(`  ⚠ Fila ${linea}: sin título, se saltea.`), false
    if (!f.imagen || !fs.existsSync(path.join(carpetaImagenes, f.imagen))) {
      return console.warn(`  ⚠ Fila ${linea} (${f.titulo}): no encuentro la imagen "${f.imagen}", se saltea.`), false
    }
    return true
  })

  const existentes = await client.fetch<Existente[]>(
    `*[_type in ["obra", "coleccion"] && !(_id in path("drafts.**"))]{
      _id, _type, "slug": slug.current, orderRank, "altPrincipal": imagen.alt, "vistas": vistas[]{_key, alt}
    }`,
  )
  const porSlug = (tipo: Existente['_type'], slug: string) => existentes.find((e) => e._type === tipo && e.slug === slug)
  const ultimoRango = (tipo: Existente['_type']) =>
    existentes
      .filter((e) => e._type === tipo && e.orderRank)
      .map((e) => e.orderRank!)
      .sort()
      .at(-1)

  const tx = client.transaction()
  const resumen = {coleccionesNuevas: 0, obrasNuevas: 0, obrasActualizadas: 0}

  // Colecciones: sólo se crean las que faltan.
  const rangoColeccion = generadorDeRangos(ultimoRango('coleccion'))
  const idColeccion = new Map<string, string>()
  for (const nombre of [...new Set(validas.map((f) => f.coleccion).filter(Boolean))]) {
    const slug = slugify(nombre)
    const existente = porSlug('coleccion', slug)
    if (existente) {
      idColeccion.set(nombre, existente._id)
      continue
    }
    const _id = `coleccion-${slug}`
    idColeccion.set(nombre, _id)
    resumen.coleccionesNuevas++
    tx.createIfNotExists({
      _id,
      _type: 'coleccion',
      orderRank: rangoColeccion(),
      nombre,
      slug: {_type: 'slug', current: slug},
      texto: '[Texto de la serie: qué busca, cómo surgió, con qué materiales trabaja. Dos o tres líneas.]',
    })
  }

  // Obras: se crean con su lugar en el orden y se actualizan los campos del CSV.
  const rangoObra = generadorDeRangos(ultimoRango('obra'))
  for (const f of validas) {
    const slug = slugify(f.titulo)
    const existente = porSlug('obra', slug)
    const _id = existente?._id ?? `obra-${slug}`
    process.stdout.write(`  · ${f.titulo}… `)

    const assetPrincipal = await subirImagen(f.imagen)
    const vistas = []
    for (const v of archivosDeVistas(f.imagen)) {
      const altPrevio = existente?.vistas?.find((x) => x._key === v.key)?.alt
      vistas.push({
        _type: 'image',
        _key: v.key,
        asset: ref(await subirImagen(v.archivo)),
        tipo: v.tipo,
        alt: altPrevio || (v.tipo === 'sala' ? `${f.titulo} colgada en una sala` : `${f.titulo}, detalle ${v.key.slice(1)}`),
      })
    }

    const campos: Record<string, unknown> = {
      titulo: f.titulo,
      slug: {_type: 'slug', current: slug},
      anio: numero(f.anio),
      tecnica: f.tecnica,
      medidas: {alto: numero(f.alto_cm), ancho: numero(f.ancho_cm), profundidad: numero(f.profundidad_cm)},
      imagen: {
        _type: 'image',
        asset: ref(assetPrincipal),
        alt: f.alt || existente?.altPrincipal || `${f.titulo} (${f.tecnica}, ${f.anio})`,
      },
    }
    if (vistas.length) campos.vistas = vistas
    if (f.descripcion) campos.descripcion = f.descripcion
    if (f.coleccion) campos.coleccion = ref(idColeccion.get(f.coleccion)!)

    if (existente) resumen.obrasActualizadas++
    else {
      resumen.obrasNuevas++
      tx.createIfNotExists({_id, _type: 'obra', orderRank: rangoObra()})
    }
    tx.patch(_id, (p) => p.set(campos))
    console.log(existente ? 'actualizada' : 'nueva')
  }

  // Documentos únicos: sólo si no existen.
  tx.createIfNotExists(acercaEjemplo)
  tx.createIfNotExists(configuracionEjemplo)

  await tx.commit({visibility: 'sync'})

  console.log(`
✔ Listo.
  Obras nuevas:        ${resumen.obrasNuevas}
  Obras actualizadas:  ${resumen.obrasActualizadas}
  Colecciones nuevas:  ${resumen.coleccionesNuevas}
  Imágenes subidas:    ${subidas.nuevas} (ya estaban: ${subidas.existentes})
  "Acerca de" y "Datos del sitio": se crean sólo si no existían.
`)
}

main().catch((error) => salir(error instanceof Error ? error.message : String(error)))
