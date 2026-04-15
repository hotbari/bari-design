import { http, HttpResponse } from 'msw'
import type { Material } from '@/types/material'
import materials from '../fixtures/materials.json'

let data = materials as Material[]

export const materialHandlers = [
  http.get('/api/materials', ({ request }) => {
    const url = new URL(request.url)
    const reviewStatus = url.searchParams.get('reviewStatus')
    const opsStatus = url.searchParams.get('opsStatus')
    const fileType = url.searchParams.get('fileType')
    const search = url.searchParams.get('search')?.toLowerCase()
    let result = [...data]
    if (reviewStatus) result = result.filter(m => m.reviewStatus === reviewStatus)
    if (opsStatus) result = result.filter(m => m.opsStatus === opsStatus)
    if (fileType) result = result.filter(m => m.fileType === fileType)
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search))
    return HttpResponse.json(result)
  }),
  http.get('/api/materials/:id', ({ params }) => {
    const item = data.find(m => m.id === params.id)
    if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(item)
  }),
  http.patch('/api/materials/:id/review', async ({ params, request }) => {
    const body = await request.json() as { reviewStatus: string; note?: string }
    data = data.map(m => m.id === params.id ? { ...m, ...body } : m) as Material[]
    return HttpResponse.json(data.find(m => m.id === params.id))
  }),
]
