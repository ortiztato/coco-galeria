// Favicon: la inicial del artista a máquina (IBM Plex Mono), blanca sobre negro, subrayada con
// un trazo de lápiz rojo. Se genera en el build a partir del nombre de "Datos del sitio".
import fs from 'node:fs'
import path from 'node:path'
import opentype from 'opentype.js'

let fuente: opentype.Font | undefined

function cargarFuente() {
  if (!fuente) {
    const archivo = path.resolve('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff')
    const buffer = fs.readFileSync(archivo)
    fuente = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  }
  return fuente
}

/** SVG cuadrado de 64 × 64 con la inicial. */
export function faviconSvg(nombre: string): string {
  const inicial = (nombre.trim()[0] ?? 'A').toUpperCase()
  const glifo = cargarFuente().getPath(inicial, 0, 0, 64)
  const caja = glifo.getBoundingBox()
  const ancho = caja.x2 - caja.x1
  const alto = caja.y2 - caja.y1
  // Letra grande, un poco arriba del centro para dejar lugar al subrayado.
  const escala = Math.min((64 * 0.6) / alto, (64 * 0.62) / ancho)
  const x = (64 - ancho * escala) / 2 - caja.x1 * escala
  const y = 7 - caja.y1 * escala
  const d = glifo.toPathData(2)
  const subrayado = 'M12 54C22 51.5 32 55 42 52.5S52 51 54 52'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0B0B0A"/><path d="${d}" fill="#EDEBE5" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${escala.toFixed(4)})"/><path d="${subrayado}" fill="none" stroke="#F03A2E" stroke-width="4.5" stroke-linecap="round"/></svg>`
}
