import { http, HttpResponse } from 'msw'
import fixture from '../fixtures/material-detail.json'

export const materialHandlers = [
  http.get('/api/materials/:id', () => {
    return HttpResponse.json(fixture)
  }),
]
