// Punto único de acceso al contenido del sitio. Se carga una sola vez por build.
// Paso 4: datos de prueba. Paso 5: se reemplaza por las consultas a Sanity.
import type {Contenido} from './tipos'
import {contenidoPrueba} from './prueba'
import {crearDerivados, type Derivados} from './derivados'

let cache: Promise<{contenido: Contenido; d: Derivados}> | undefined

/** Contenido + valores derivados (numeración, anterior/siguiente, marquesinas…). */
export function getSitio() {
  cache ??= Promise.resolve(contenidoPrueba()).then((contenido) => ({contenido, d: crearDerivados(contenido)}))
  return cache
}
