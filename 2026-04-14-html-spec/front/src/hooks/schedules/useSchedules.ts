import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Schedule, SlotRemaining } from '@/types/schedule'

export function useSchedules(filters?: { status?: string; mediaId?: string; search?: string }) {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.mediaId) params.set('mediaId', filters.mediaId)
  if (filters?.search) params.set('search', filters.search)
  return useQuery({
    queryKey: ['schedules', filters],
    queryFn: async () => { const res = await fetch(`/api/schedules?${params}`); return res.json() as Promise<Schedule[]> },
  })
}

export function useScheduleDetail(id: string) {
  return useQuery({
    queryKey: ['schedules', id],
    queryFn: async () => { const res = await fetch(`/api/schedules/${id}`); return res.json() as Promise<Schedule> },
    enabled: !!id,
  })
}

export function useSlotRemaining() {
  return useQuery({ queryKey: ['slot-remaining'], queryFn: async () => { const res = await fetch('/api/schedules/slot-remaining'); return res.json() as Promise<SlotRemaining[]> } })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Omit<Schedule, 'id' | 'createdAt'>) => {
      const res = await fetch('/api/schedules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return res.json() as Promise<Schedule>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  })
}

export function useUpdateSchedule(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<Schedule>) => {
      const res = await fetch(`/api/schedules/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return res.json() as Promise<Schedule>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  })
}

export function useEmergencySchedule() {
  return useMutation({
    mutationFn: async (body: { mediaId: string; playlistId: string; duration: number; reason: string }) => {
      const res = await fetch('/api/emergency', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return res.json()
    },
  })
}

export function useSyncStatus() {
  return useQuery({ queryKey: ['sync-status'], queryFn: async () => { const res = await fetch('/api/sync'); return res.json() } })
}

export function useSyncSchedules() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => { const res = await fetch('/api/sync', { method: 'POST' }); return res.json() },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedules'] }); qc.invalidateQueries({ queryKey: ['sync-status'] }) },
  })
}
