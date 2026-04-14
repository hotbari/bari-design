import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Media, MediaInput } from '@/types/media'

const QUERY_KEY = ['media'] as const

async function fetchMedia(): Promise<Media[]> {
  const res = await fetch('/api/media')
  if (!res.ok) throw new Error('매체 목록 조회 실패')
  return res.json()
}

async function createMedia(input: MediaInput): Promise<Media> {
  const res = await fetch('/api/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('매체 등록 실패')
  return res.json()
}

export function useMedia() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchMedia })
}

export function useCreateMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createMedia,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
