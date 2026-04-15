'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { CampaignForm } from '@/components/domain/campaigns/CampaignForm'
import { useCampaignDetail, useUpdateCampaign } from '@/hooks/campaigns/useCampaigns'
import { useToast } from '@/components/ui/Toast'

export default function CampaignEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: item, isLoading } = useCampaignDetail(id)
  const update = useUpdateCampaign(id)
  const { show } = useToast()

  const BREADCRUMBS = [{ label: '캠페인 관리', href: '/campaigns' }, { label: item?.name ?? '수정' }, { label: '수정' }]

  if (isLoading) return <AppShell breadcrumbs={BREADCRUMBS}><p>로딩 중...</p></AppShell>

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <CampaignForm
        defaultValues={item}
        onSubmit={async data => {
          await update.mutateAsync(data)
          show('캠페인이 수정되었습니다.')
          router.push(`/campaigns/${id}`)
        }}
        submitLabel="저장"
      />
    </AppShell>
  )
}
