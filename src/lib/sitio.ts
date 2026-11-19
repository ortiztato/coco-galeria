// Navegación y helpers de enlaces del sitio.

export type Seccion = 'obras' | 'colecciones' | 'acerca' | 'contacto'

export const navegacion: {id: Seccion; label: string; href: string}[] = [
  {id: 'obras', label: 'Obras', href: '/'},
  {id: 'colecciones', label: 'Colecciones', href: '/colecciones'},
  {id: 'acerca', label: 'Acerca de', href: '/acerca'},
  {id: 'contacto', label: 'Contacto', href: '/contacto'},
]

export const instagramUrl = (usuario: string) => `https://www.instagram.com/${usuario.replace(/^@/, '')}/`
