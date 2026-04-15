import { useQuery } from '@tanstack/react-query'
import type { DashboardRole } from '@/types/dashboard'

export function useDashboard(role: DashboardRole) {
  return useQuery({
    queryKey: ['dashboard', role],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard?role=${role}`)
      return res.json()
    },
  })
}
