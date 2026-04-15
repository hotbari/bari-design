import { http, HttpResponse } from 'msw'
import users from '../fixtures/users.json'

export const userHandlers = [
  http.get('/api/users', () => HttpResponse.json(users)),
  http.post('/api/users/invite', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'new-invite', ...body as object, status: 'invited' }, { status: 201 })
  }),
  http.patch('/api/users/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...body as object })
  }),
]
