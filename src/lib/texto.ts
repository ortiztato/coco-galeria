// Utilidades de texto.

/** "Jardín de noviembre" → "jardin-de-noviembre" */
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Número de dos cifras: 4 → "04". */
export const dosCifras = (n: number) => String(n).padStart(2, '0')

/**
 * Parte un texto en dos líneas lo más parejas posible (para heros en mobile).
 * "Nombre Apellido" → ["Nombre", "Apellido"]; "Campos de color" → ["Campos", "de color"].
 */
export function partirEnDos(texto: string): string[] {
  const palabras = texto.trim().split(/\s+/)
  if (palabras.length < 2) return [texto]
  let mejor: string[] = [texto]
  let mejorMax = Infinity
  for (let i = 1; i < palabras.length; i++) {
    const a = palabras.slice(0, i).join(' ')
    const b = palabras.slice(i).join(' ')
    const max = Math.max(a.length, b.length)
    if (max < mejorMax) {
      mejorMax = max
      mejor = [a, b]
    }
  }
  return mejor
}
