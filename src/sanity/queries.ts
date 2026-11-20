// Consultas GROQ al contenido publicado en Sanity, con los tipos de lo que devuelven.
// Todo se pide en una sola consulta durante el build.
import {sanityClient} from 'sanity:client'

// ── Tipos de la respuesta ────────────────────────────────────────────────

export interface SanityAsset {
  _id: string
  url: string
  metadata?: {
    dimensions?: {width: number; height: number}
    lqip?: string | null
    palette?: {dominant?: {background?: string} | null} | null
  }
}

export interface SanityImagen {
  alt?: string | null
  asset?: SanityAsset | null
  crop?: {top: number; bottom: number; left: number; right: number} | null
  hotspot?: {x: number; y: number; height: number; width: number} | null
}

export interface SanityVista extends SanityImagen {
  tipo?: 'detalle' | 'sala' | 'otra' | null
}

export interface SanityObra {
  slug: string
  titulo: string
  anio?: number | null
  tecnica?: string | null
  medidas?: {alto?: number | null; ancho?: number | null; profundidad?: number | null} | null
  descripcion?: string | null
  imagen: SanityImagen
  vistas?: SanityVista[] | null
  coleccion?: string | null
}

export interface SanityColeccion {
  slug: string
  nombre: string
  texto?: string | null
}

export interface SanityAcerca {
  foto?: SanityImagen | null
  creditoFoto?: string | null
  lugarFoto?: string | null
  bioDestacada?: string | null
  bio?: string | null
  statementFrase?: string | null
  statement?: string | null
  cv?: {titulo?: string | null; entradas?: {anio?: string | null; texto?: string | null}[] | null}[] | null
  cvPdfUrl?: string | null
}

export interface SanityConfiguracion {
  nombre?: string | null
  ciudad?: string | null
  pais?: string | null
  disciplinas?: string | null
  email?: string | null
  instagram?: string | null
  representacion?: string | null
  notaTaller?: string | null
  marquesina?: string[] | null
  seoDescripcion?: string | null
  imagenCompartir?: SanityImagen | null
}

export interface SanityContenido {
  obras: SanityObra[]
  colecciones: SanityColeccion[]
  acerca: SanityAcerca | null
  config: SanityConfiguracion | null
}

// ── Consulta ─────────────────────────────────────────────────────────────

const asset = `asset->{_id, url, metadata{dimensions{width, height}, lqip, palette{dominant{background}}}}`
const publicado = `!(_id in path("drafts.**"))`

export const contenidoQuery = /* groq */ `{
  "obras": *[_type == "obra" && ${publicado} && defined(slug.current) && defined(imagen.asset)] | order(orderRank asc) {
    "slug": slug.current,
    titulo,
    anio,
    tecnica,
    medidas,
    descripcion,
    imagen{alt, ${asset}},
    "vistas": vistas[defined(asset)]{tipo, alt, ${asset}},
    "coleccion": coleccion->slug.current
  },
  "colecciones": *[_type == "coleccion" && ${publicado} && defined(slug.current)] | order(orderRank asc) {
    "slug": slug.current,
    nombre,
    texto
  },
  "acerca": *[_id == "acerca"][0] {
    foto{alt, crop, hotspot, ${asset}},
    creditoFoto,
    lugarFoto,
    bioDestacada,
    bio,
    statementFrase,
    statement,
    cv[]{titulo, entradas[]{anio, texto}},
    "cvPdfUrl": cvPdf.asset->url
  },
  "config": *[_id == "configuracion"][0] {
    nombre,
    ciudad,
    pais,
    disciplinas,
    email,
    instagram,
    representacion,
    notaTaller,
    marquesina,
    seoDescripcion,
    imagenCompartir{alt, crop, hotspot, ${asset}}
  }
}`

export function fetchContenido(): Promise<SanityContenido> {
  return sanityClient.fetch<SanityContenido>(contenidoQuery)
}
