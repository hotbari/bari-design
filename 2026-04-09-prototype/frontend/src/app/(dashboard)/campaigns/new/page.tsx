'use client'
import { useRouter } from 'next/navigation'
import { useCreateCampaign } from '@/hooks/campaigns/useCampaigns'
import { CampaignForm } from '@/components/domain/campaigns/CampaignForm'
import { useToast } from '@/stores/toast'
import styles from '../campaigns.module.css'

export default function CampaignNewPage() {
  const router = useRouter()
  const mutation = useCreateCampaign()
  const { add } = useToast()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>캠페인 등록</h1>
      <CampaignForm
        isPending={mutation.isPending}
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: () => { add('캠페인이 등록되었습니다', 'success'); router.push('/campaigns') },
            onError: () => add('등록에 실패했습니다', 'error'),
          })
        }
      />
    </div>
  )
}
