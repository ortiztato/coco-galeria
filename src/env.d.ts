/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string
  readonly PUBLIC_SANITY_DATASET: string
  readonly PUBLIC_WEB3FORMS_KEY: string
  /** "1" para usar el contenido de prueba (content/obras-ejemplo.csv) en vez de Sanity. */
  readonly CONTENIDO_PRUEBA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
