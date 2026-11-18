import {defineArrayMember, defineField, defineType} from 'sanity'

// Documento único (ver structure.ts): siempre se edita el mismo.
export const acerca = defineType({
  name: 'acerca',
  title: 'Acerca de',
  type: 'document',
  fields: [
    defineField({
      name: 'foto',
      title: 'Foto del artista',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Descripción de la imagen', type: 'string'})],
    }),
    defineField({name: 'creditoFoto', title: 'Crédito de la foto', type: 'string'}),
    defineField({name: 'lugarFoto', title: 'Lugar de la foto', description: 'Ej.: Taller, Buenos Aires', type: 'string'}),
    defineField({
      name: 'bioDestacada',
      title: 'Bio — primer párrafo',
      description: 'Se muestra más grande. Una o dos oraciones.',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'bio', title: 'Bio — resto', type: 'text', rows: 6}),
    defineField({name: 'statementFrase', title: 'Statement — frase', description: 'Una frase corta, va en letra grande.', type: 'string'}),
    defineField({name: 'statement', title: 'Statement — texto', type: 'text', rows: 8}),
    defineField({
      name: 'cv',
      title: 'Trayectoria',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'seccionCv',
          title: 'Sección',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Título de la sección',
              description: 'Ej.: Exposiciones individuales',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'entradas',
              title: 'Entradas',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'entradaCv',
                  fields: [
                    defineField({name: 'anio', title: 'Año', type: 'string'}),
                    defineField({name: 'texto', title: 'Texto', description: 'Ej.: Nombre de la muestra, Espacio, Ciudad', type: 'string'}),
                  ],
                  preview: {select: {title: 'texto', subtitle: 'anio'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'titulo'}},
        }),
      ],
    }),
    defineField({name: 'cvPdf', title: 'CV en PDF (opcional)', type: 'file', options: {accept: 'application/pdf'}}),
  ],
  preview: {prepare: () => ({title: 'Acerca de'})},
})
