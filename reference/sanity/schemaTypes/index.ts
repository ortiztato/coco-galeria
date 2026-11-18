import {obra} from './obra'
import {coleccion} from './coleccion'
import {acerca} from './acerca'
import {configuracion} from './configuracion'

export const schemaTypes = [obra, coleccion, acerca, configuracion]

// Tipos de documento único: no se pueden crear ni borrar desde el Studio.
export const singletonTypes = new Set(['acerca', 'configuracion'])
