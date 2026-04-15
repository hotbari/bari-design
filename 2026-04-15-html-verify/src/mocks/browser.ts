import { setupWorker } from 'msw/browser'
import { materialHandlers } from './handlers/materials'
import { dashboardHandlers } from './handlers/dashboard'
import { userHandlers } from './handlers/users'

export const worker = setupWorker(...materialHandlers, ...dashboardHandlers, ...userHandlers)
