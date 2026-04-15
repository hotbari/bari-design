import { http, HttpResponse } from 'msw'
import fixture from '../fixtures/material-detail.json'
import listFixture from '../fixtures/materials.json'

export const materialHandlers = [
  http.get('/api/materials', () => {
    return HttpResponse.json(listFixture)
  }),
  http.get('/api/materials/:id', () => {
    return HttpResponse.json(fixture)
  }),
]
