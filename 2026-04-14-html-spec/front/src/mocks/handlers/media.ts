import { http, HttpResponse } from 'msw'
import mediaFixtures from '../fixtures/media.json'
import type { Media, MediaDetail } from '@/types/media'

let mediaList: Media[] = [...mediaFixtures] as Media[]

const statusMap: Record<string, string> = {
  '온라인': 'online',
  '지연': 'delayed',
  '이상': 'error',
  '오프라인': 'offline',
  '미연동': 'unlinked',
  '비활성': 'inactive',
}

export const mediaHandlers = [
  http.get('/api/media', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const company = url.searchParams.get('company')
    const q = url.searchParams.get('q')
    const page = Number(url.searchParams.get('page') || 1)

    let result = [...mediaList]
    if (status) {
      const mapped = statusMap[status] || status
      result = result.filter(m => m.status === mapped)
    }
    if (type) result = result.filter(m => m.type === type)
    if (company) result = result.filter(m => m.companyName === company)
    if (q) result = result.filter(m =>
      m.name.includes(q) || m.location.includes(q)
    )

    const pageSize = 10
    const total = result.length
    const items = result.slice((page - 1) * pageSize, page * pageSize)

    return HttpResponse.json({ items, total, page, pageSize })
  }),

  http.get('/api/media/:id', ({ params }) => {
    const media = mediaList.find(m => m.id === params.id)
    if (!media) return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    const detail: MediaDetail = {
      ...media,
      device: media.status !== 'unlinked' ? {
        deviceId: `DEV-${params.id}`,
        os: 'Android 12',
        appVersion: '2.4.1',
        networkType: 'LTE',
        ip: '192.168.1.100',
        lastConnected: '2026-04-14T10:30:00',
      } : undefined,
      healthChecks: [
        { id: 'hc-1', timestamp: '2026-04-14T10:00:00', result: 'hc-ok', message: '정상' },
        { id: 'hc-2', timestamp: '2026-04-14T09:00:00', result: 'hc-ok', message: '정상' },
        { id: 'hc-3', timestamp: '2026-04-14T08:00:00', result: media.status === 'error' ? 'hc-err' : 'hc-ok', message: media.status === 'error' ? '연결 오류' : '정상' },
        { id: 'hc-4', timestamp: '2026-04-14T07:00:00', result: 'hc-warn', message: '응답 지연' },
        { id: 'hc-5', timestamp: '2026-04-14T06:00:00', result: 'hc-ok', message: '정상' },
      ],
    }

    return HttpResponse.json(detail)
  }),

  http.get('/api/media/:id/health-checks', ({ params, request }) => {
    const url = new URL(request.url)
    const period = Number(url.searchParams.get('period') || 7)
    const checks = Array.from({ length: period * 2 }, (_, i) => ({
      id: `hc-${i}`,
      timestamp: new Date(Date.now() - i * 12 * 3600000).toISOString(),
      result: i % 7 === 3 ? 'hc-err' : i % 5 === 2 ? 'hc-warn' : 'hc-ok',
      message: i % 7 === 3 ? '연결 오류' : i % 5 === 2 ? '응답 지연' : '정상',
    }))
    return HttpResponse.json(checks)
  }),

  http.post('/api/media', async ({ request }) => {
    const body = await request.json() as Partial<Media>
    const newMedia: Media = {
      id: `m-${Date.now()}`,
      status: 'unlinked',
      syncStatus: 'pending',
      registeredAt: new Date().toISOString().split('T')[0],
      ...body,
    } as Media
    mediaList.push(newMedia)
    return HttpResponse.json(newMedia, { status: 201 })
  }),

  http.put('/api/media/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<Media>
    const idx = mediaList.findIndex(m => m.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    mediaList[idx] = { ...mediaList[idx], ...body }
    return HttpResponse.json(mediaList[idx])
  }),

  http.patch('/api/media/:id/status', async ({ params, request }) => {
    const body = await request.json() as { status: string }
    const idx = mediaList.findIndex(m => m.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    mediaList[idx] = { ...mediaList[idx], status: body.status as Media['status'] }
    return HttpResponse.json(mediaList[idx])
  }),
]
