'use client'
import { useParams, useRouter } from 'next/navigation'
import { useCampaignDetail, useUpdateCampaign } from '@/hooks/campaigns/useCampaignDetail'
import { CampaignForm } from '@/components/domain/campaigns/CampaignForm'
import { useToast } from '@/stores/toast'
import styles from '../../campaigns.module.css'

export default function CampaignEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: campaign, isLoading } = useCampaignDetail(id)
  const mutation = useUpdateCampaign(id)
  const { add } = useToast()

  if (isLoading || !campaign) return <p style={{ padding: '24px' }}>불러오는 중...</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>캠페인 수정</h1>
      <CampaignForm
        key={campaign.id}
        defaultValues={{
          name: campaign.name,
          advertiser: campaign.advertiser,
          status: campaign.status === 'done' ? 'pending' : campaign.status,
        }}
        isPending={mutation.isPending}
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: () => { add('수정되었습니다', 'success'); router.push(`/campaigns/${id}`) },
            onError: () => add('수정에 실패했습니다', 'error'),
          })
        }
      />
    </div>
  )
}
