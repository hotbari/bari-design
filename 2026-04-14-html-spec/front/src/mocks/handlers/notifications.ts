import { http, HttpResponse } from 'msw'
import notifs from '../fixtures/notifications.json'

let data = [...notifs]

export const notificationHandlers = [
  http.get('/api/notifications', () => HttpResponse.json(data)),
  http.patch('/api/notifications/:id/read', ({ params }) => {
    data = data.map(n => n.id === params.id ? { ...n, read: true } : n)
    return HttpResponse.json({ ok: true })
  }),
  http.post('/api/notifications/read-all', () => {
    data = data.map(n => ({ ...n, read: true }))
    return HttpResponse.json({ ok: true })
  }),
]
