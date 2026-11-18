import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes, singletonTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// Config del Studio embebido en /admin (lo toma @sanity/astro). Schemas y estructura en src/sanity/.

// En el Studio (Vite/Astro) las variables llegan por import.meta.env; la CLI de Sanity
// (`npx sanity ...`) no expone las PUBLIC_*, así que ahí se leen de process.env.
const env = (name: 'PUBLIC_SANITY_PROJECT_ID' | 'PUBLIC_SANITY_DATASET'): string | undefined =>
  import.meta.env?.[name] || (typeof process !== 'undefined' ? process.env[name] : undefined)

export default defineConfig({
  name: 'default',
  title: 'Panel — Nombre Apellido',
  projectId: env('PUBLIC_SANITY_PROJECT_ID') ?? '',
  dataset: env('PUBLIC_SANITY_DATASET') || 'production',
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
