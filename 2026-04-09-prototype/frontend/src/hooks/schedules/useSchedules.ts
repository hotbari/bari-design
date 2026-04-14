import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Schedule, ScheduleInput } from '@/types/schedule'

const QUERY_KEY = ['schedules'] as const
const detailKey = (id: string) => ['schedules', id] as const

async function fetchSchedules(): Promise<Schedule[]> {
  const res = await fetch('/api/schedules')
  if (!res.ok) throw new Error('편성 목록 조회 실패')
  return res.json()
}

async function fetchScheduleDetail(id: string): Promise<Schedule> {
  const res = await fetch(`/api/schedules/${id}`)
  if (!res.ok) throw new Error('편성 조회 실패')
  return res.json()
}

async function createSchedule(input: ScheduleInput): Promise<Schedule> {
  const res = await fetch('/api/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('편성 생성 실패')
  return res.json()
}

async function syncSchedule(id: string): Promise<void> {
  const res = await fetch(`/api/schedules/${id}/sync`, { method: 'POST' })
  if (!res.ok) throw new Error('동기화 실패')
}

export function useSchedules() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchSchedules })
}

export function useScheduleDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchScheduleDetail(id) })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useSyncSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: syncSchedule,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
