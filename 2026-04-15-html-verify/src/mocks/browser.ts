import { setupWorker } from 'msw/browser'
import { materialHandlers } from './handlers/materials'
import { dashboardHandlers } from './handlers/dashboard'

export const worker = setupWorker(...materialHandlers, ...dashboardHandlers)
