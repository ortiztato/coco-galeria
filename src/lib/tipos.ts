// Tipos compartidos por los componentes. Los datos vienen de prueba (paso 4) o de Sanity (paso 5),
// pero los componentes sólo conocen estas formas.

export interface Imagen {
  src: string
  /** srcset con varios anchos (lo arma el helper de Sanity en el paso 5). */
  srcset?: string
  width: number
  height: number
  alt: string
}

export interface ObraResumen {
  href: string
  titulo: string
  anio: number | string
  /** Número de orden ya formateado ("01"). */
  numero?: string
  tecnica?: string
  coleccion?: {nombre: string; slug: string}
  imagen: Imagen
}

export type ColorFila = 'texto' | 'cian' | 'rosa'

/** Color alternado de las filas de colecciones: blanco, cian, blanco, rosa. */
export const colorFila = (i: number): ColorFila => (['texto', 'cian', 'texto', 'rosa'] as const)[i % 4]
