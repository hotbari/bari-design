'use client'
import { useParams, useRouter } from 'next/navigation'
import { useCampaignDetail, useDeleteCampaign } from '@/hooks/campaigns/useCampaignDetail'
import { CampaignStatusBadge } from '@/components/domain/campaigns/CampaignStatusBadge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import styles from '../campaigns.module.css'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: campaign, isLoading, isError } = useCampaignDetail(id)
  const deleteMutation = useDeleteCampaign()
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (isError || !campaign) return <p style={{ padding: '24px' }}>캠페인을 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{campaign.name}</h1>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => router.push(`/campaigns/${id}/edit`)}>수정</Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(id, {
              onSuccess: () => { add('캠페인이 삭제되었습니다', 'success'); router.push('/campaigns') },
              onError: () => add('삭제에 실패했습니다', 'error'),
            })}
          >
            삭제
          </Button>
        </div>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 0', fontSize: 'var(--text-sm)' }}>
        <dt style={{ color: 'var(--color-neutral-500)' }}>광고주</dt>
        <dd>{campaign.advertiser}</dd>
      </dl>
    </div>
  )
}
