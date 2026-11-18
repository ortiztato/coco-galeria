// Imágenes de prueba tomadas de design/assets/obras (sólo para desarrollo, pasos 3 y 4).
import type {ImageMetadata} from 'astro'
import type {Imagen} from './tipos'

const archivos = import.meta.glob<{default: ImageMetadata}>('/design/assets/obras/*.jpg', {eager: true})

export function imagenPrueba(nombre: string, alt = ''): Imagen {
  const entrada = archivos[`/design/assets/obras/${nombre}`]
  if (!entrada) throw new Error(`No existe la imagen de prueba ${nombre}`)
  const {src, width, height} = entrada.default
  return {src, width, height, alt}
}
