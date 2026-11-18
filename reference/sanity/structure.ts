import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

// Menú del Studio en español, con obras y colecciones ordenables por arrastre
// y "Acerca de" / "Datos del sitio" como documentos únicos.
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Contenido')
    .items([
      orderableDocumentListDeskItem({type: 'obra', title: 'Obras', S, context}),
      orderableDocumentListDeskItem({type: 'coleccion', title: 'Colecciones', S, context}),
      S.divider(),
      S.listItem()
        .title('Acerca de')
        .id('acerca')
        .child(S.document().schemaType('acerca').documentId('acerca')),
      S.listItem()
        .title('Datos del sitio')
        .id('configuracion')
        .child(S.document().schemaType('configuracion').documentId('configuracion')),
    ])
