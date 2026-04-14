'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export function RoleSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('role') ?? 'admin'

  return (
    <select
      value={current}
      onChange={(e) => router.push(`/?role=${e.target.value}`)}
      style={{
        padding: '4px 8px',
        border: '1px solid var(--color-neutral-300)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-sans)',
        background: 'white',
        cursor: 'pointer',
      }}
    >
      <option value="admin">어드민</option>
      <option value="media-company">미디어사</option>
      <option value="ops-agency">운영 대행사</option>
    </select>
  )
}
