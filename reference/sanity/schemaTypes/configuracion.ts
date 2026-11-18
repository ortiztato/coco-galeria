import {defineArrayMember, defineField, defineType} from 'sanity'

// Documento único (ver structure.ts).
export const configuracion = defineType({
  name: 'configuracion',
  title: 'Datos del sitio',
  type: 'document',
  fields: [
    defineField({name: 'nombre', title: 'Nombre del artista', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'ciudad', title: 'Ciudad', type: 'string'}),
    defineField({name: 'pais', title: 'País', type: 'string'}),
    defineField({name: 'disciplinas', title: 'Disciplinas', description: 'Ej.: Pintura / Papel / Collage', type: 'string'}),
    defineField({name: 'email', title: 'Email de contacto', type: 'string', validation: (r) => r.email()}),
    defineField({name: 'instagram', title: 'Instagram (usuario, sin @)', type: 'string'}),
    defineField({name: 'representacion', title: 'Galería que lo representa (opcional)', type: 'string'}),
    defineField({name: 'notaTaller', title: 'Nota sobre el taller', description: 'Ej.: Visitas al taller con cita previa.', type: 'string'}),
    defineField({
      name: 'marquesina',
      title: 'Frases de la marquesina (home)',
      description: 'Se muestran en la barra verde, separadas por ★.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'seoDescripcion', title: 'Descripción para buscadores', type: 'text', rows: 3}),
    defineField({name: 'imagenCompartir', title: 'Imagen al compartir el sitio', type: 'image'}),
  ],
  preview: {prepare: () => ({title: 'Datos del sitio'})},
})
