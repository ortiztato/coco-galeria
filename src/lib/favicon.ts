// Favicon: la inicial del artista en Six Caps, sobreimpresa en rosa y cian sobre negro.
// Se genera en el build a partir del nombre de "Datos del sitio", así cambia solo si cambia el nombre.
import fs from 'node:fs'
import path from 'node:path'
import opentype from 'opentype.js'

let fuente: opentype.Font | undefined

function cargarFuente() {
  if (!fuente) {
    const archivo = path.resolve('node_modules/@fontsource/six-caps/files/six-caps-latin-400-normal.woff')
    const buffer = fs.readFileSync(archivo)
    fuente = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  }
  return fuente
}

/** SVG cuadrado de 64 × 64 con la inicial. */
export function faviconSvg(nombre: string): string {
  const inicial = (nombre.trim()[0] ?? 'A').toUpperCase()
  const f = cargarFuente()
  const tamano = 64
  const glifo = f.getPath(inicial, 0, 0, tamano)
  const caja = glifo.getBoundingBox()
  const ancho = caja.x2 - caja.x1
  const alto = caja.y2 - caja.y1
  // Centrado, con la letra ocupando ~80 % del alto.
  const escala = (64 * 0.8) / alto
  const x = (64 - ancho * escala) / 2 - caja.x1 * escala
  const y = (64 - alto * escala) / 2 - caja.y1 * escala
  const d = glifo.toPathData(2)
  const capa = (color: string, dx: number, dy: number) =>
    `<path d="${d}" fill="${color}" transform="translate(${(x + dx).toFixed(2)} ${(y + dy).toFixed(2)}) scale(${escala.toFixed(4)})" style="mix-blend-mode:screen"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0A0A0A"/>${capa('#FF48B0', -2, -2)}${capa('#00B3FF', 2, 2)}</svg>`
}
