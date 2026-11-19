// Parser de CSV mínimo, sin dependencias. Lo usan el contenido de prueba y scripts/importar.ts.

/** Parser de CSV mínimo: comas, comillas dobles y saltos de línea dentro de comillas. */
export function parseCsv(texto: string): Record<string, string>[] {
  const filas: string[][] = []
  let fila: string[] = []
  let campo = ''
  let comillas = false
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') {
        campo += '"'
        i++
      } else if (c === '"') comillas = false
      else campo += c
    } else if (c === '"') comillas = true
    else if (c === ',') {
      fila.push(campo)
      campo = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++
      fila.push(campo)
      filas.push(fila)
      fila = []
      campo = ''
    } else campo += c
  }
  if (campo || fila.length) {
    fila.push(campo)
    filas.push(fila)
  }
  const [encabezado, ...datos] = filas.filter((f) => f.some((v) => v.trim() !== ''))
  return datos.map((f) => Object.fromEntries(encabezado.map((h, i) => [h.trim(), (f[i] ?? '').trim()])))
}
