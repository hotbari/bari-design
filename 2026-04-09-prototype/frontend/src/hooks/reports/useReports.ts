import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Report, ReportInput, FootTraffic, Ssp } from '@/types/report'

const QUERY_KEY = ['reports'] as const

async function fetchReports(): Promise<Report[]> {
  const res = await fetch('/api/reports')
  if (!res.ok) throw new Error('리포트 목록 조회 실패')
  return res.json()
}

async function createReport(input: ReportInput): Promise<Report> {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('리포트 생성 실패')
  return res.json()
}

async function fetchFootTraffic(): Promise<FootTraffic[]> {
  const res = await fetch('/api/foot-traffic')
  if (!res.ok) throw new Error('유동인구 데이터 조회 실패')
  return res.json()
}

async function fetchSsp(): Promise<Ssp[]> {
  const res = await fetch('/api/ssp')
  if (!res.ok) throw new Error('SSP 조회 실패')
  return res.json()
}

export function useReports() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchReports })
}

export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useFootTraffic() {
  return useQuery({ queryKey: ['foot-traffic'], queryFn: fetchFootTraffic })
}

export function useSsp() {
  return useQuery({ queryKey: ['ssp'], queryFn: fetchSsp })
}
