import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Media, MediaInput } from '@/types/media'

const listKey = ['media'] as const
const detailKey = (id: string) => ['media', id] as const

async function fetchMediaDetail(id: string): Promise<Media> {
  const res = await fetch(`/api/media/${id}`)
  if (!res.ok) throw new Error('매체 조회 실패')
  return res.json()
}

async function updateMedia(id: string, input: MediaInput): Promise<Media> {
  const res = await fetch(`/api/media/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('매체 수정 실패')
  return res.json()
}

async function deleteMedia(id: string): Promise<void> {
  const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('매체 삭제 실패')
}

export function useMediaDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchMediaDetail(id) })
}

export function useUpdateMedia(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: MediaInput) => updateMedia(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: detailKey(id) })
    },
  })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
  })
}
