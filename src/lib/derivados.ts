// Valores que se calculan en el build a partir del contenido: numeración, anterior/siguiente,
// obras por colección, período, conteos y textos de la marquesina.
import type {Coleccion, Contenido, Obra, ObraResumen} from './tipos'
import {dosCifras} from './texto'

export const hrefObra = (slug: string) => `/obras/${slug}`
export const hrefColeccion = (slug: string) => `/colecciones/${slug}`

/** "2020—2023", o "2021" si todas son del mismo año. */
export function periodo(obras: Obra[]): string {
  if (obras.length === 0) return ''
  const anios = obras.map((o) => o.anio).filter((a) => a > 0)
  if (anios.length === 0) return ''
  const min = Math.min(...anios)
  const max = Math.max(...anios)
  return min === max ? String(min) : `${min}—${max}`
}

/** "160 × 120 cm" (+ profundidad si la hay). */
export function medidasTexto(obra: Obra): string | undefined {
  const {alto, ancho, profundidad} = obra.medidas ?? {}
  const partes = [alto, ancho, profundidad].filter((n): n is number => typeof n === 'number' && n > 0)
  return partes.length ? `${partes.join(' × ')} cm` : undefined
}

export function crearDerivados(c: Contenido) {
  const {obras, colecciones, config} = c
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
      medidas: medidasTexto(obra)?.replace(/ × /g, '×').replace(/ cm$/, ''),
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

  const periodoGeneral = periodo(obras)
  const conteo = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`
  const obrasTxt = conteo(total, 'obra', 'obras')
  const coleccionesTxt = conteo(coleccionesConObras.length, 'colección', 'colecciones')

  const marquesina = {
    home: config.marquesina.length
      ? config.marquesina
      : [config.nombre, periodoGeneral && `Obra ${periodoGeneral}`, `${obrasTxt} · ${coleccionesTxt}`].filter(Boolean),
    colecciones: [coleccionesTxt, obrasTxt, periodoGeneral].filter(Boolean),
    coleccion: (col: Coleccion) => {
      const lista = obrasDe(col.slug)
      return [`Colección ${numeroColeccion(col)}`, col.nombre, conteo(lista.length, 'obra', 'obras'), periodo(lista)].filter(Boolean)
    },
    obra: (obra: Obra) =>
      [`Obra ${numero(obra)} / ${dosCifras(total)}`, obra.titulo, obra.anio ? String(obra.anio) : '', obra.tecnica, medidasTexto(obra)].filter(
        (t): t is string => Boolean(t),
      ),
    acerca: [config.nombre, 'Artista visual', config.ciudad].filter((t): t is string => Boolean(t)),
    contacto: ['Escribime', 'Consultas por obra', 'Exposiciones', 'Prensa'],
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
    periodoGeneral,
    marquesina,
  }
}

export type Derivados = ReturnType<typeof crearDerivados>
