import { http, HttpResponse } from 'msw'
import playlists from '../fixtures/playlists.json'

const PICKER_MATERIALS = [
  { id: 'mat-001', name: '삼성 갤럭시 S26 런칭 영상 30s', duration: 30, resolution: '1920×1080' },
  { id: 'mat-002', name: 'LG 오휘 봄 신제품 15s', duration: 15, resolution: '1920×1080' },
  { id: 'mat-003', name: '현대 아이오닉 9 사전계약 20s', duration: 20, resolution: '1920×1080' },
  { id: 'mat-004', name: '공익광고 환경 캠페인 30s', duration: 30, resolution: '1920×1080' },
  { id: 'mat-005', name: '배달의민족 2월 이벤트 15s', duration: 15, resolution: '1920×1080' },
]

export const playlistHandlers = [
  http.get('/api/playlists', () => HttpResponse.json(playlists)),
  http.get('/api/playlists/materials', () => HttpResponse.json(PICKER_MATERIALS)),
  http.get('/api/playlists/:id', ({ params }) =>
    HttpResponse.json(playlists.find((p: any) => p.id === params.id) ?? null)
  ),
  http.put('/api/playlists/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...(body as object) })
  }),
  http.post('/api/playlists', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: `pl-${Date.now()}`, ...(body as object) }, { status: 201 })
  }),
]
