'use client'

import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { MediaForm } from '@/components/domain/media/MediaForm'
import { useMediaCompanies } from '@/hooks/media/useMediaCompanies'
import { useToast } from '@/components/ui/Toast'

const BREADCRUMBS = [
  { label: '매체 관리', href: '/media' },
  { label: '매체 등록' },
]

export default function MediaNewPage() {
  const router = useRouter()
  const { show } = useToast()
  const { data: companies = [] } = useMediaCompanies()

  const handleSubmit = async (data: Parameters<typeof MediaForm>[0]['onSubmit'] extends (d: infer D) => unknown ? D : never) => {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const media = await res.json()
    show('매체가 등록되었습니다.')
    setTimeout(() => router.push(`/media/${media.id}`), 1500)
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
          매체 등록
        </h1>
      </div>
      <MediaForm
        mode="create"
        companies={companies.map(c => ({ id: c.id, name: c.name }))}
        onSubmit={handleSubmit}
      />
    </AppShell>
  )
}
