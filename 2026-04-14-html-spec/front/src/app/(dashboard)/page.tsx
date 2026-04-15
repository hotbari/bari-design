'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { AdminDashboard } from '@/components/domain/dashboard/AdminDashboard'
import { MediaCompanyDashboard } from '@/components/domain/dashboard/MediaCompanyDashboard'
import { OpsAgencyDashboard } from '@/components/domain/dashboard/OpsAgencyDashboard'
import type { DashboardRole } from '@/types/dashboard'

const ROLE_OPTIONS: { value: DashboardRole; label: string }[] = [
  { value: 'admin', label: '어드민' },
  { value: 'media-company', label: '매체사' },
  { value: 'ops-agency', label: '운영대행사' },
]

export default function HomePage() {
  const [role, setRole] = useState<DashboardRole>('admin')

  return (
    <AppShell breadcrumbs={[{ label: '대시보드' }]}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-neutral-500)', fontWeight: 500 }}>역할:</span>
        {ROLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRole(opt.value)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: role === opt.value ? 'var(--color-primary-500, #3b82f6)' : 'var(--color-neutral-200, #e5e7eb)',
              background: role === opt.value ? 'var(--color-primary-50, #eff6ff)' : '#fff',
              color: role === opt.value ? 'var(--color-primary-700, #1d4ed8)' : 'var(--color-neutral-600, #4b5563)',
              fontSize: '13px',
              fontWeight: role === opt.value ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {role === 'admin' && <AdminDashboard />}
      {role === 'media-company' && <MediaCompanyDashboard />}
      {role === 'ops-agency' && <OpsAgencyDashboard />}
    </AppShell>
  )
}
