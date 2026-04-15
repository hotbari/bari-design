import { http, HttpResponse } from 'msw'
import notifications from '../fixtures/notifications.json'

export const notificationHandlers = [
  http.get('/api/notifications', () => HttpResponse.json(notifications)),
  http.patch('/api/notifications/:id/read', ({ params }) =>
    HttpResponse.json({ id: params.id, read: true })
  ),
  http.post('/api/notifications/read-all', () =>
    HttpResponse.json({ success: true })
  ),
]
