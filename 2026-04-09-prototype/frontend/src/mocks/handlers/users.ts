import { http, HttpResponse } from 'msw'
import users from '../fixtures/users.json'

export const userHandlers = [
  http.get('/api/users', () => HttpResponse.json(users)),
  http.get('/api/users/:id', ({ params }) => {
    const item = users.find((u) => u.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
