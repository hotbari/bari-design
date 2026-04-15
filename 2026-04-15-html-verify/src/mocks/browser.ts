import { setupWorker } from 'msw/browser'
import { materialHandlers } from './handlers/materials'

export const worker = setupWorker(...materialHandlers)
