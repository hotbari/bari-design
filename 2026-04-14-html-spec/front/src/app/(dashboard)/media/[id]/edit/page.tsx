'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { MediaForm } from '@/components/domain/media/MediaForm'
import { useMediaDetail } from '@/hooks/media/useMediaDetail'
import { useMediaCompanies } from '@/hooks/media/useMediaCompanies'
import { useToast } from '@/components/ui/Toast'

export default function MediaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { show } = useToast()
  const { data: media } = useMediaDetail(id)
  const { data: companies = [] } = useMediaCompanies()

  if (!media) return null

  const handleSubmit = async (data: object) => {
    await fetch(`/api/media/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    show('매체 정보가 수정되었습니다.')
    setTimeout(() => router.push(`/media/${id}`), 1500)
  }

  return (
    <AppShell breadcrumbs={[
      { label: '매체 관리', href: '/media' },
      { label: '매체 목록', href: '/media' },
      { label: media.name, href: `/media/${id}` },
      { label: '수정' },
    ]}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
          매체 수정
        </h1>
      </div>
      <MediaForm
        mode="edit"
        defaultValues={media}
        companies={companies.map(c => ({ id: c.id, name: c.name }))}
        onSubmit={handleSubmit as never}
      />
    </AppShell>
  )
}
