// @ts-check
import {defineConfig} from 'astro/config'
import {loadEnv} from 'vite'
import sanity from '@sanity/astro'
import react from '@astrojs/react'

const {PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET} = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

export default defineConfig({
  output: 'static',
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      // Sitio estático: se lee la API directo, sin CDN, para tener lo último publicado en cada build.
      useCdn: false,
      apiVersion: '2025-01-01',
      // Studio embebido. Con salida estática usa ruteo por hash (/admin#/...).
      studioBasePath: '/admin',
    }),
    // Sólo para el Studio: el sitio público no usa React.
    react(),
  ],
})
