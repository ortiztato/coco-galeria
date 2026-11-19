// Tipos compartidos. Los datos vienen de prueba (paso 4) o de Sanity (paso 5),
// pero las páginas y componentes sólo conocen estas formas.

export interface Imagen {
  src: string
  /** srcset con varios anchos (lo arma el helper de Sanity en el paso 5). */
  srcset?: string
  width: number
  height: number
  alt: string
  /** Miniatura cuadrada recortada (sólo para los botones de vistas). */
  miniatura?: string
}

// ── Contenido (lo que se carga en el panel) ──────────────────────────────

export interface Coleccion {
  slug: string
  nombre: string
  texto?: string
}

export interface Vista {
  tipo: 'detalle' | 'sala' | 'otra'
  imagen: Imagen
}

export interface Obra {
  slug: string
  titulo: string
  anio: number
  tecnica: string
  medidas?: {alto?: number; ancho?: number; profundidad?: number}
  descripcion?: string
  imagen: Imagen
  vistas: Vista[]
  /** Slug de la colección a la que pertenece. */
  coleccion?: string
}

export interface SeccionCv {
  titulo: string
  entradas: {anio?: string; texto?: string}[]
}

export interface Acerca {
  foto?: Imagen
  creditoFoto?: string
  lugarFoto?: string
  bioDestacada?: string
  bio?: string
  statementFrase?: string
  statement?: string
  cv: SeccionCv[]
  cvPdfUrl?: string
}

export interface Configuracion {
  nombre: string
  ciudad?: string
  pais?: string
  disciplinas?: string
  email?: string
  instagram?: string
  representacion?: string
  notaTaller?: string
  marquesina: string[]
  seoDescripcion?: string
  imagenCompartir?: Imagen
}

export interface Contenido {
  /** Ya ordenadas según el orden del panel. */
  obras: Obra[]
  colecciones: Coleccion[]
  acerca: Acerca
  config: Configuracion
}

// ── Formas que usan los componentes ──────────────────────────────────────

export interface ObraResumen {
  href: string
  titulo: string
  anio: number | string
  /** Número de orden ya formateado ("01"). */
  numero?: string
  tecnica?: string
  /** Medidas compactas para la tarjeta ("160×120"). */
  medidas?: string
  coleccion?: {nombre: string; slug: string}
  imagen: Imagen
}

export type ColorFila = 'texto' | 'cian' | 'rosa'

/** Color alternado de las filas de colecciones: blanco, cian, blanco, rosa. */
export const colorFila = (i: number): ColorFila => (['texto', 'cian', 'texto', 'rosa'] as const)[i % 4]
