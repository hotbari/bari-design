import { setupWorker } from 'msw/browser'
import { materialHandlers } from './handlers/materials'
import { dashboardHandlers } from './handlers/dashboard'
import { userHandlers } from './handlers/users'
import { mediaCompanyHandlers } from './handlers/media-companies'
import { mediaHandlers } from './handlers/media'
import { mediaSubHandlers } from './handlers/media-sub'
import { campaignHandlers } from './handlers/campaigns'

export const worker = setupWorker(
  ...materialHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...mediaCompanyHandlers,
  ...mediaHandlers,
  ...mediaSubHandlers,
  ...campaignHandlers,
)
