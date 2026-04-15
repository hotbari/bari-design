import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { email: string; role: string; company?: string }) => {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('초대 실패')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
