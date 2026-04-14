import { http, HttpResponse } from 'msw'
import users from '../fixtures/users.json'

let data = [...users]

export const userHandlers = [
  http.get('/api/users', () => HttpResponse.json(data)),
  http.get('/api/users/:id', ({ params }) => {
    const item = data.find((u) => u.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/users/invite', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newUser = { id: `usr-${Date.now()}`, ...body }
    data = [...data, newUser as typeof data[0]]
    return HttpResponse.json(newUser, { status: 201 })
  }),
]
