// Datos del sitio de prueba. En el paso 5 se reemplazan por el documento "configuracion" de Sanity
// y los totales se calculan a partir de las obras y colecciones.
export const sitio = {
  nombre: 'Nombre Apellido',
  ciudad: '[Ciudad]',
  pais: '[País]',
  disciplinas: 'Pintura / Papel / Collage',
  email: '[email@dominio.com]',
  instagram: '[usuario]',
  totalObras: 12,
  totalColecciones: 4,
}

export type Seccion = 'obras' | 'colecciones' | 'acerca' | 'contacto'

export const navegacion: {id: Seccion; label: string; href: string}[] = [
  {id: 'obras', label: 'Obras', href: '/'},
  {id: 'colecciones', label: 'Colecciones', href: '/colecciones'},
  {id: 'acerca', label: 'Acerca de', href: '/acerca'},
  {id: 'contacto', label: 'Contacto', href: '/contacto'},
]

export const instagramUrl = (usuario: string) => `https://www.instagram.com/${usuario.replace(/^@/, '')}/`
