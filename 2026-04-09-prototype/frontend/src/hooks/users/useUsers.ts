import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User, UserInvite } from '@/types/user'

const QUERY_KEY = ['users'] as const

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('사용자 목록 조회 실패')
  return res.json()
}

async function inviteUser(input: UserInvite): Promise<User> {
  const res = await fetch('/api/users/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('초대 실패')
  return res.json()
}

export function useUsers() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchUsers })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
