import { http, HttpResponse } from 'msw'
import users from '../fixtures/users.json'

type UserRole = 'admin' | 'media' | 'ops' | 'sales'

let data = [...users]

export const userHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')?.toLowerCase()
    let result = [...data]
    if (role) result = result.filter(u => u.role === role)
    if (status) result = result.filter(u => u.status === status)
    if (search) result = result.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search))
    return HttpResponse.json(result)
  }),
  http.post('/api/users/invite', async ({ request }) => {
    const body = await request.json() as { email: string; role: UserRole; company?: string }
    const newUser = { id: `u-${Date.now()}`, name: '(초대 중)', email: body.email, role: body.role, status: 'invited' as const, ...(body.company ? { company: body.company } : {}), registeredAt: new Date().toISOString() }
    data = [...data, newUser as typeof data[0]]
    return HttpResponse.json(newUser, { status: 201 })
  }),
]
