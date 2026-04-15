import { http, HttpResponse } from 'msw'
import ssp from '../fixtures/ssp.json'
import footTraffic from '../fixtures/foot-traffic.json'

export const mediaSubHandlers = [
  http.get('/api/media/ssp', () => HttpResponse.json(ssp)),
  http.get('/api/media/foot-traffic', () => HttpResponse.json(footTraffic)),
  http.get('/api/media/groups', () => HttpResponse.json({ groups: [] })),
]
