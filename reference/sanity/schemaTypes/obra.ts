import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const obra = defineType({
  name: 'obra',
  title: 'Obra',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'obra'}),
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección web',
      description: 'Se genera a partir del título. Tocá "Generate".',
      type: 'slug',
      options: {source: 'titulo', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen principal',
      description: 'La obra completa, sin marco ni pared. Mínimo 2000 px del lado más largo.',
      type: 'image',
      options: {hotspot: false},
      fields: [
        defineField({
          name: 'alt',
          title: 'Descripción de la imagen',
          description: 'Para personas que no ven la imagen. Ej.: "Pintura con dos rectángulos naranja y bordó sobre fondo rojo".',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coleccion',
      title: 'Colección',
      type: 'reference',
      to: [{type: 'coleccion'}],
    }),
    defineField({name: 'anio', title: 'Año', type: 'number', validation: (r) => r.required().integer().min(1900).max(2100)}),
    defineField({
      name: 'tecnica',
      title: 'Técnica',
      description: 'Ej.: Óleo sobre tela',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'medidas',
      title: 'Medidas (cm)',
      type: 'object',
      options: {columns: 3},
      fields: [
        defineField({name: 'alto', title: 'Alto', type: 'number'}),
        defineField({name: 'ancho', title: 'Ancho', type: 'number'}),
        defineField({name: 'profundidad', title: 'Profundidad (opcional)', type: 'number'}),
      ],
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      description: 'Uno o dos párrafos cortos.',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'vistas',
      title: 'Otras vistas',
      description: 'Detalles de la superficie, la obra colgada en una sala, etc. Arrastrá para ordenarlas.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'tipo',
              title: 'Tipo de vista',
              type: 'string',
              options: {
                list: [
                  {title: 'Detalle', value: 'detalle'},
                  {title: 'En sala', value: 'sala'},
                  {title: 'Otra', value: 'otra'},
                ],
                layout: 'radio',
              },
              initialValue: 'detalle',
            }),
            defineField({name: 'alt', title: 'Descripción de la imagen', type: 'string', validation: (r) => r.required()}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'titulo', anio: 'anio', coleccion: 'coleccion.nombre', media: 'imagen'},
    prepare: ({title, anio, coleccion, media}) => ({
      title,
      subtitle: [anio, coleccion].filter(Boolean).join(' · '),
      media,
    }),
  },
})
