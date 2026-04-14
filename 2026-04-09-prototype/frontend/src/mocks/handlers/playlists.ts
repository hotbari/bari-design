import { http, HttpResponse } from 'msw'
import playlists from '../fixtures/playlists.json'

const detailData: Record<string, { id: string; name: string; slotCount: number; duration: number; slots: Array<{ id: string; materialId: string; materialName: string; duration: number; order: number }> }> = {
  'pl-001': {
    id: 'pl-001', name: '강남권 4월 운영 재생목록', slotCount: 3, duration: 65,
    slots: [
      { id: 'slot-001', materialId: 'mat-001', materialName: '갤럭시 S26 15초', duration: 15, order: 0 },
      { id: 'slot-002', materialId: 'mat-002', materialName: '오휘 봄 30초', duration: 30, order: 1 },
      { id: 'slot-003', materialId: 'mat-003', materialName: '배민 봄맞이 20초', duration: 20, order: 2 },
    ],
  },
  'pl-002': {
    id: 'pl-002', name: '신촌 스프링 캠페인 재생목록', slotCount: 2, duration: 45,
    slots: [
      { id: 'slot-004', materialId: 'mat-001', materialName: '갤럭시 S26 15초', duration: 15, order: 0 },
      { id: 'slot-005', materialId: 'mat-003', materialName: '배민 봄맞이 20초', duration: 30, order: 1 },
    ],
  },
}

export const playlistHandlers = [
  http.get('/api/playlists', () => HttpResponse.json(playlists)),
  http.get('/api/playlists/:id', ({ params }) => {
    const item = detailData[params.id as string]
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.put('/api/playlists/:id/slots', async ({ params, request }) => {
    const body = await request.json() as { slots: typeof detailData['pl-001']['slots'] }
    if (detailData[params.id as string]) {
      detailData[params.id as string].slots = body.slots
    }
    return HttpResponse.json({ success: true })
  }),
]
