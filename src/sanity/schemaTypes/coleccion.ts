import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const coleccion = defineType({
  name: 'coleccion',
  title: 'Colección',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'coleccion'}),
    defineField({name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Dirección web',
      type: 'slug',
      options: {source: 'nombre', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'texto',
      title: 'Texto de la serie',
      description: 'Dos o tres líneas: qué busca, cómo surgió, con qué materiales.',
      type: 'text',
      rows: 4,
    }),
  ],
  // La cantidad de obras y el período (ej. 2020—2023) se calculan desde las obras.
  preview: {select: {title: 'nombre'}},
})
