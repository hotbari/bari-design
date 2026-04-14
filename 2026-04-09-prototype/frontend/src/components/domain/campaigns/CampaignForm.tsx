'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { campaignInputSchema, type CampaignInput } from '@/types/campaign'
import { Button } from '@/components/ui/Button'
import styles from './CampaignForm.module.css'

interface CampaignFormProps {
  defaultValues?: Partial<CampaignInput>
  onSubmit: (data: CampaignInput) => void
  isPending: boolean
}

export function CampaignForm({ defaultValues, onSubmit, isPending }: CampaignFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CampaignInput>({
    resolver: zodResolver(campaignInputSchema),
    defaultValues: defaultValues ?? { status: 'pending' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="campaign-name" className={styles.label}>캠페인명 *</label>
        <input id="campaign-name" className={styles.input} {...register('name')} placeholder="캠페인명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="campaign-advertiser" className={styles.label}>광고주 *</label>
        <input id="campaign-advertiser" className={styles.input} {...register('advertiser')} placeholder="광고주명 입력" />
        {errors.advertiser && <span className={styles.error}>{errors.advertiser.message}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="campaign-status" className={styles.label}>상태</label>
        <select id="campaign-status" className={styles.input} {...register('status')}>
          <option value="pending">대기</option>
          <option value="active">운영중</option>
          <option value="paused">일시정지</option>
        </select>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>저장</Button>
      </div>
    </form>
  )
}
