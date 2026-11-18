import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes, singletonTypes} from './schemaTypes'
import {structure} from './structure'

// Borrador: va en la raíz del proyecto Astro (lo toma @sanity/astro para /admin).
export default defineConfig({
  name: 'default',
  title: 'Panel — Nombre Apellido',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [structureTool({structure})],
  schema: {
    types: schemaTypes,
    // Que no aparezcan "Acerca de" / "Datos del sitio" en "Crear nuevo".
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    // En documentos únicos, sólo publicar / descartar cambios (sin duplicar ni borrar).
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
