import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Material, MaterialInput } from '@/types/material'

const QUERY_KEY = ['materials'] as const
const detailKey = (id: string) => ['materials', id] as const

async function fetchMaterials(): Promise<Material[]> {
  const res = await fetch('/api/materials')
  if (!res.ok) throw new Error('소재 목록 조회 실패')
  return res.json()
}

async function fetchMaterialDetail(id: string): Promise<Material> {
  const res = await fetch(`/api/materials/${id}`)
  if (!res.ok) throw new Error('소재 조회 실패')
  return res.json()
}

async function createMaterial(input: MaterialInput): Promise<Material> {
  const res = await fetch('/api/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('소재 등록 실패')
  return res.json()
}

export function useMaterials() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchMaterials })
}

export function useMaterialDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchMaterialDetail(id) })
}

export function useCreateMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
