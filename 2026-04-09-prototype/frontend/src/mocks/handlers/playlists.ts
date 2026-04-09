import { http, HttpResponse } from 'msw'
import playlists from '../fixtures/playlists.json'

export const playlistHandlers = [
  http.get('/api/playlists', () => HttpResponse.json(playlists)),
  http.get('/api/playlists/:id', ({ params }) => {
    const item = playlists.find((p) => p.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
