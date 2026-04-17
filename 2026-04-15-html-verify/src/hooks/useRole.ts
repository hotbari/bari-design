'use client'
import { useState, useEffect } from 'react'

export type Role = 'admin' | 'media' | 'ops' | 'sales'
const KEY = 'dooh-role'

// 모듈 레벨 공유 — 같은 페이지 내 모든 useRole() 인스턴스가 동기화
const listeners = new Set<(r: Role) => void>()

function getStored(): Role {
  if (typeof window === 'undefined') return 'admin'
  return (localStorage.getItem(KEY) as Role | null) ?? 'admin'
}

export function useRole(): [Role, (r: Role) => void] {
  const [role, setRoleState] = useState<Role>(getStored)

  useEffect(() => {
    setRoleState(getStored())
    const handler = (r: Role) => setRoleState(r)
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  function setRole(r: Role) {
    localStorage.setItem(KEY, r)
    listeners.forEach(l => l(r))
  }

  return [role, setRole]
}
