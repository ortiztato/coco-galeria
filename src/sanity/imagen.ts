// Imágenes desde el CDN de Sanity: srcset de 400 a 2400 px con auto=format.
// Las obras nunca se recortan (fit=max, sin crop). Sólo se recortan las miniaturas
// cuadradas de las vistas y, si se pide un aspecto, la foto del artista.
import {sanityClient} from 'sanity:client'
import {createImageUrlBuilder} from '@sanity/image-url'
import type {Imagen} from '../lib/tipos'
import type {SanityImagen} from './queries'

const builder = createImageUrlBuilder(sanityClient)
const ANCHOS = [400, 800, 1200, 1600, 2000, 2400]

interface Opciones {
  /** Texto alternativo si la imagen no trae uno. */
  alt?: string
  /** Relación ancho/alto para recortar (respeta el punto de interés). Sin esto, la imagen va entera. */
  aspecto?: number
}

export function imagenSanity(img: SanityImagen | null | undefined, opciones: Opciones = {}): Imagen | undefined {
  const asset = img?.asset
  const dims = asset?.metadata?.dimensions
  if (!img || !asset || !dims) return undefined

  const {aspecto} = opciones
  const base = () => builder.image(img).auto('format')
  const anchos = ANCHOS.filter((w) => w < dims.width)
  anchos.push(Math.min(dims.width, 2400))

  const url = (w: number) =>
    aspecto ? base().width(w).height(Math.round(w / aspecto)).fit('crop').url() : base().width(w).fit('max').url()

  const width = aspecto ? Math.min(dims.width, 2400) : dims.width
  const height = aspecto ? Math.round(width / aspecto) : dims.height

  return {
    src: url(Math.min(1200, dims.width)),
    srcset: anchos.map((w) => `${url(w)} ${w}w`).join(', '),
    width,
    height,
    alt: img.alt?.trim() || opciones.alt || '',
    miniatura: base().width(160).height(160).fit('crop').url(),
    lqip: asset.metadata?.lqip ?? undefined,
    color: asset.metadata?.palette?.dominant?.background ?? undefined,
  }
}

/** URL de un tamaño fijo, para Open Graph (1200 × 630). */
export function urlCompartir(img: SanityImagen | null | undefined): string | undefined {
  if (!img?.asset) return undefined
  return builder.image(img).width(1200).height(630).fit('crop').auto('format').url()
}
