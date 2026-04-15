'use client'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { CampaignForm } from '@/components/domain/campaigns/CampaignForm'
import { useCreateCampaign } from '@/hooks/campaigns/useCampaigns'
import { useToast } from '@/components/ui/Toast'

const BREADCRUMBS = [{ label: '캠페인 관리', href: '/campaigns' }, { label: '캠페인 등록' }]

export default function CampaignNewPage() {
  const router = useRouter()
  const create = useCreateCampaign()
  const { show } = useToast()

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <CampaignForm
        onSubmit={async data => {
          await create.mutateAsync({ ...data, status: 'draft', mediaIds: [], billingModel: data.billingModel ?? 'none' })
          show('캠페인이 등록되었습니다.')
          router.push('/campaigns')
        }}
        submitLabel="등록"
      />
    </AppShell>
  )
}
