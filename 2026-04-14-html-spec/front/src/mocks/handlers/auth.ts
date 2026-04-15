import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === 'admin@bari.com' && body.password === 'password') {
      return HttpResponse.json({ token: 'mock-token', role: 'admin', name: '관리자' })
    }
    return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }),
  http.post('/api/auth/signup', async () => {
    return HttpResponse.json({ ok: true })
  }),
]
