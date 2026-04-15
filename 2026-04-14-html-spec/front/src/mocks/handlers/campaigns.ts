import { http, HttpResponse } from 'msw'
import type { Campaign } from '@/types/campaign'
import campaigns from '../fixtures/campaigns.json'

let data = campaigns as Campaign[]

export const campaignHandlers = [
  http.get('/api/campaigns', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const advertiser = url.searchParams.get('advertiser')
    const search = url.searchParams.get('search')?.toLowerCase()
    let result = [...data]
    if (status) result = result.filter(c => c.status === status)
    if (type) result = result.filter(c => c.type === type)
    if (advertiser) result = result.filter(c => c.advertiser === advertiser)
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search))
    return HttpResponse.json(result)
  }),
  http.get('/api/campaigns/:id', ({ params }) => {
    const item = data.find(c => c.id === params.id)
    if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(item)
  }),
  http.post('/api/campaigns', async ({ request }) => {
    const body = await request.json() as typeof data[0]
    const newItem = { ...body, id: `c-${Date.now()}`, createdAt: new Date().toISOString() }
    data = [...data, newItem]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/campaigns/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<typeof data[0]>
    data = data.map(c => c.id === params.id ? { ...c, ...body } : c)
    return HttpResponse.json(data.find(c => c.id === params.id))
  }),
]
