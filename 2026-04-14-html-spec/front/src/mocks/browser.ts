import { setupWorker } from 'msw/browser'
import { mediaHandlers } from './handlers/media'
import { mediaCompanyHandlers } from './handlers/media-companies'
import { mediaGroupHandlers } from './handlers/media-groups'
import { authHandlers } from './handlers/auth'
import { dashboardHandlers } from './handlers/dashboard'
import { userHandlers } from './handlers/users'
import { notificationHandlers } from './handlers/notifications'
import { materialHandlers } from './handlers/materials'
import { campaignHandlers } from './handlers/campaigns'
import { playlistHandlers } from './handlers/playlists'
import { scheduleHandlers } from './handlers/schedules'
import { reportHandlers } from './handlers/reports'

export const worker = setupWorker(
  ...mediaHandlers,
  ...mediaCompanyHandlers,
  ...mediaGroupHandlers,
  ...authHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...notificationHandlers,
  ...materialHandlers,
  ...campaignHandlers,
  ...playlistHandlers,
  ...scheduleHandlers,
  ...reportHandlers,
)
