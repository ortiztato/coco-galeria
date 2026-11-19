import type {APIRoute} from 'astro'
import {faviconPng} from '../lib/favicon-png'

export const GET: APIRoute = () => faviconPng(180)
