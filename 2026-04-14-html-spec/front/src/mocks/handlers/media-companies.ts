import { http, HttpResponse } from 'msw'
import companiesFixtures from '../fixtures/media-companies.json'
import type { MediaCompany } from '@/types/media'

let companies: MediaCompany[] = [...companiesFixtures] as MediaCompany[]

export const mediaCompanyHandlers = [
  http.get('/api/media-companies', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    let result = [...companies]
    if (q) result = result.filter(c => c.name.includes(q) || c.regNumber.includes(q))
    return HttpResponse.json(result)
  }),

  http.post('/api/media-companies', async ({ request }) => {
    const body = await request.json() as Partial<MediaCompany>
    const dup = companies.find(c => c.regNumber === body.regNumber)
    if (dup) return HttpResponse.json({ message: '이미 등록된 사업자번호입니다.' }, { status: 409 })

    const newCompany: MediaCompany = {
      id: `c-${Date.now()}`,
      mediaCount: 0,
      registeredAt: new Date().toISOString().split('T')[0],
      ...body,
    } as MediaCompany
    companies.push(newCompany)
    return HttpResponse.json(newCompany, { status: 201 })
  }),

  http.put('/api/media-companies/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<MediaCompany>
    const idx = companies.findIndex(c => c.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    // 중복 사업자번호 체크 (자기 자신 제외)
    const dup = companies.find(c => c.regNumber === body.regNumber && c.id !== params.id)
    if (dup) return HttpResponse.json({ message: '이미 등록된 사업자번호입니다.' }, { status: 409 })

    companies[idx] = { ...companies[idx], ...body }
    return HttpResponse.json(companies[idx])
  }),
]
