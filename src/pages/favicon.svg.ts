import type {APIRoute} from 'astro'
import {getSitio} from '../lib/contenido'
import {faviconSvg} from '../lib/favicon'

export const GET: APIRoute = async () => {
  const {config} = (await getSitio()).contenido
  return new Response(faviconSvg(config.nombre), {headers: {'Content-Type': 'image/svg+xml'}})
}
