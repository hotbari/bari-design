import { useQuery } from '@tanstack/react-query'

export function useUsers(filters?: { role?: string; status?: string; search?: string }) {
  const params = new URLSearchParams()
  if (filters?.role) params.set('role', filters.role)
  if (filters?.status) params.set('status', filters.status)
  if (filters?.search) params.set('search', filters.search)
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const res = await fetch(`/api/users?${params}`)
      return res.json()
    },
  })
}
