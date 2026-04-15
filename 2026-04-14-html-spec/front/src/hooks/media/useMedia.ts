import { useQuery } from '@tanstack/react-query'
import type { Media, MediaListParams } from '@/types/media'

interface MediaListResponse {
  items: Media[]
  total: number
  page: number
  pageSize: number
}

async function fetchMedia(params: MediaListParams): Promise<MediaListResponse> {
  const url = new URL('/api/media', window.location.origin)
  if (params.status) url.searchParams.set('status', params.status)
  if (params.type) url.searchParams.set('type', params.type)
  if (params.company) url.searchParams.set('company', params.company)
  if (params.q) url.searchParams.set('q', params.q)
  if (params.page) url.searchParams.set('page', String(params.page))
  const res = await fetch(url)
  return res.json()
}

export function useMedia(params: MediaListParams = {}) {
  return useQuery({
    queryKey: ['media', params],
    queryFn: () => fetchMedia(params),
  })
}
