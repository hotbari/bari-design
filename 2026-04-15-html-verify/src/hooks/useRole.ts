'use client'
import { useState, useEffect } from 'react'

export type Role = 'admin' | 'media' | 'ops' | 'sales'
const KEY = 'dooh-role'

export function useRole(): [Role, (r: Role) => void] {
  const [role, setRoleState] = useState<Role>('admin')

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Role | null
    if (stored) setRoleState(stored)
  }, [])

  function setRole(r: Role) {
    localStorage.setItem(KEY, r)
    setRoleState(r)
  }

  return [role, setRole]
}
