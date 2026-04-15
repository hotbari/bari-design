import { http, HttpResponse } from 'msw'
import data from '../fixtures/dashboard.json'

export const dashboardHandlers = [
  http.get('/api/dashboard', ({ request }) => {
    const role = new URL(request.url).searchParams.get('role') || 'admin'
    const roleData = data[role as keyof typeof data] ?? data.admin
    return HttpResponse.json(roleData)
  }),
]
