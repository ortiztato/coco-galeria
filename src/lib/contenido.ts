// Punto único de acceso al contenido del sitio. Se carga una sola vez por build.
//
// Fuente: Sanity (lo publicado en /admin). Para trabajar sin conexión o comparar con el diseño se puede
// usar el contenido de prueba (content/obras-ejemplo.csv) con CONTENIDO_PRUEBA=1 en .env.
// Nunca se cae a los datos de prueba en silencio: si Sanity está vacío, el sitio lo muestra vacío.
import type {Contenido} from './tipos'
import {crearDerivados, type Derivados} from './derivados'

const usarPrueba = import.meta.env.CONTENIDO_PRUEBA === '1' || import.meta.env.CONTENIDO_PRUEBA === 'true'

async function cargar(): Promise<Contenido> {
  if (usarPrueba) {
    const {contenidoPrueba} = await import('./prueba')
    return contenidoPrueba()
  }
  const {contenidoSanity} = await import('../sanity/contenido')
  return contenidoSanity()
}

let cache: Promise<{contenido: Contenido; d: Derivados}> | undefined
let cargadoEn = 0

/** Contenido + valores derivados (numeración, anterior/siguiente, marquesinas…). */
export function getSitio() {
  // En el build se pide una sola vez. En `npm run dev` se vuelve a pedir a los pocos segundos,
  // así lo que se publica en /admin aparece al recargar la página.
  const vencido = import.meta.env.DEV && Date.now() - cargadoEn > 3000
  if (!cache || vencido) {
    cargadoEn = Date.now()
    cache = cargar().then((contenido) => ({contenido, d: crearDerivados(contenido)}))
  }
  return cache
}
