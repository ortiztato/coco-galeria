// Convierte la respuesta de Sanity al formato que usan las páginas (src/lib/tipos.ts).
// Los campos opcionales vacíos quedan como undefined para que las páginas oculten esa parte.
import type {Acerca, Configuracion, Contenido, Obra, Vista} from '../lib/tipos'
import {fetchContenido, type SanityContenido} from './queries'
import {imagenSanity} from './imagen'

const texto = (v: string | null | undefined) => v?.trim() || undefined
const numero = (v: number | null | undefined) => (typeof v === 'number' && v > 0 ? v : undefined)

function mapear(datos: SanityContenido): Contenido {
  const obras: Obra[] = []
  for (const o of datos.obras ?? []) {
    const imagen = imagenSanity(o.imagen, {alt: `${o.titulo}, vista completa`})
    if (!imagen) continue
    let detalle = 0
    const vistas: Vista[] = (o.vistas ?? []).flatMap((v) => {
      const tipo = v.tipo ?? 'detalle'
      const alt = tipo === 'sala' ? `${o.titulo} colgada en sala` : `${o.titulo}, ${tipo === 'detalle' ? `detalle ${++detalle}` : 'otra vista'}`
      const img = imagenSanity(v, {alt})
      return img ? [{tipo, imagen: img}] : []
    })
    obras.push({
      slug: o.slug,
      titulo: o.titulo,
      anio: o.anio ?? 0,
      tecnica: texto(o.tecnica) ?? '',
      medidas: o.medidas
        ? {alto: numero(o.medidas.alto), ancho: numero(o.medidas.ancho), profundidad: numero(o.medidas.profundidad)}
        : undefined,
      descripcion: texto(o.descripcion),
      imagen,
      vistas,
      coleccion: o.coleccion ?? undefined,
    })
  }

  const a = datos.acerca ?? {}
  const acerca: Acerca = {
    foto: imagenSanity(a.foto, {alt: 'Foto del artista', aspecto: 4 / 5}),
    creditoFoto: texto(a.creditoFoto),
    lugarFoto: texto(a.lugarFoto),
    bioDestacada: texto(a.bioDestacada),
    bio: texto(a.bio),
    statementFrase: texto(a.statementFrase),
    statement: texto(a.statement),
    cv: (a.cv ?? [])
      .map((s) => ({
        titulo: texto(s.titulo) ?? '',
        entradas: (s.entradas ?? [])
          .map((e) => ({anio: texto(e.anio), texto: texto(e.texto)}))
          .filter((e) => e.anio || e.texto),
      }))
      .filter((s) => s.titulo && s.entradas.length > 0),
    cvPdfUrl: a.cvPdfUrl ? `${a.cvPdfUrl}?dl=` : undefined,
  }

  const c = datos.config ?? {}
  const config: Configuracion = {
    nombre: texto(c.nombre) ?? 'Artista',
    ciudad: texto(c.ciudad),
    pais: texto(c.pais),
    disciplinas: texto(c.disciplinas),
    email: texto(c.email),
    instagram: texto(c.instagram)?.replace(/^@/, ''),
    representacion: texto(c.representacion),
    notaTaller: texto(c.notaTaller),
    marquesina: (c.marquesina ?? []).map((t) => t.trim()).filter(Boolean),
    seoDescripcion: texto(c.seoDescripcion),
    imagenCompartir: imagenSanity(c.imagenCompartir),
  }

  const colecciones = (datos.colecciones ?? []).map((col) => ({slug: col.slug, nombre: col.nombre, texto: texto(col.texto)}))

  return {obras, colecciones, acerca, config}
}

export async function contenidoSanity(): Promise<Contenido> {
  return mapear(await fetchContenido())
}
