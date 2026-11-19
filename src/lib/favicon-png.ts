// Versiones PNG del favicon (navegadores sin SVG e ícono de iOS).
import sharp from 'sharp'
import {getSitio} from './contenido'
import {faviconSvg} from './favicon'

export async function faviconPng(tamano: number): Promise<Response> {
  const {config} = (await getSitio()).contenido
  const png = await sharp(Buffer.from(faviconSvg(config.nombre)), {density: Math.max(72, tamano * 4)})
    .resize(tamano, tamano)
    .png()
    .toBuffer()
  return new Response(new Uint8Array(png), {headers: {'Content-Type': 'image/png'}})
}
