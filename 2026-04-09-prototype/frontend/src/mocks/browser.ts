import { setupWorker } from 'msw/browser'
import { scheduleHandlers } from './handlers/schedules'
import { playlistHandlers } from './handlers/playlists'
import { mediaHandlers } from './handlers/media'
import { campaignHandlers } from './handlers/campaigns'
import { userHandlers } from './handlers/users'

export const browser = setupWorker(
  ...scheduleHandlers,
  ...playlistHandlers,
  ...mediaHandlers,
  ...campaignHandlers,
  ...userHandlers,
)
