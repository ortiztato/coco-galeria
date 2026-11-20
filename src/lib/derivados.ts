// Valores que se calculan en el build a partir del contenido: numeración, anterior/siguiente,
// obras por colección, período y conteos.
import type {Coleccion, Contenido, Obra, ObraResumen} from './tipos'
import {dosCifras} from './texto'

export const hrefObra = (slug: string) => `/obras/${slug}`
export const hrefColeccion = (slug: string) => `/colecciones/${slug}`

/** "2020–2023", o "2021" si todas son del mismo año. */
export function periodo(obras: Obra[]): string {
  const anios = obras.map((o) => o.anio).filter((a) => a > 0)
  if (anios.length === 0) return ''
  const min = Math.min(...anios)
  const max = Math.max(...anios)
  return min === max ? String(min) : `${min}–${max}`
}

/** "160 × 120 cm" (+ profundidad si la hay). */
export function medidasTexto(obra: Obra): string | undefined {
  const {alto, ancho, profundidad} = obra.medidas ?? {}
  const partes = [alto, ancho, profundidad].filter((n): n is number => typeof n === 'number' && n > 0)
  return partes.length ? `${partes.join(' × ')} cm` : undefined
}

/** "1 obra", "4 obras". */
export const conteo = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

export function crearDerivados(c: Contenido) {
  const {obras, colecciones} = c
  const total = obras.length
  const coleccionPorSlug = new Map(colecciones.map((col) => [col.slug, col]))
  const indicePorSlug = new Map(obras.map((o, i) => [o.slug, i]))

  const numero = (obra: Obra) => dosCifras((indicePorSlug.get(obra.slug) ?? 0) + 1)
  const coleccionDe = (obra: Obra): Coleccion | undefined => (obra.coleccion ? coleccionPorSlug.get(obra.coleccion) : undefined)
  const obrasDe = (slug: string) => obras.filter((o) => o.coleccion === slug)

  // Sólo las colecciones con al menos una obra se muestran.
  const coleccionesConObras = colecciones.filter((col) => obrasDe(col.slug).length > 0)
  const numeroColeccion = (col: Coleccion) => dosCifras(coleccionesConObras.findIndex((x) => x.slug === col.slug) + 1)

  const resumen = (obra: Obra): ObraResumen => {
    const col = coleccionDe(obra)
    return {
      href: hrefObra(obra.slug),
      titulo: obra.titulo,
      anio: obra.anio,
      numero: numero(obra),
      tecnica: obra.tecnica,
      medidas: medidasTexto(obra),
      coleccion: col ? {nombre: col.nombre, slug: col.slug} : undefined,
      imagen: obra.imagen,
    }
  }

  /** Anterior y siguiente en el orden general, en círculo (la primera va después de la última). */
  const vecinas = (obra: Obra) => {
    const i = indicePorSlug.get(obra.slug) ?? 0
    return {
      anterior: total > 1 ? obras[(i - 1 + total) % total] : undefined,
      siguiente: total > 1 ? obras[(i + 1) % total] : undefined,
    }
  }

  return {
    total,
    numero,
    coleccionDe,
    obrasDe,
    coleccionesConObras,
    numeroColeccion,
    resumen,
    vecinas,
    periodoGeneral: periodo(obras),
  }
}

export type Derivados = ReturnType<typeof crearDerivados>
