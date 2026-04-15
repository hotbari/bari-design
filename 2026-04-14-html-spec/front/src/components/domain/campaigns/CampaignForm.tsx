'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import type { Campaign } from '@/types/campaign'
import styles from './CampaignForm.module.css'

const schema = z.object({
  name: z.string().min(1, '캠페인명을 입력하세요'),
  advertiser: z.string().min(1, '광고주를 선택하세요'),
  agency: z.string().optional(),
  type: z.enum(['direct', 'own', 'filler', 'naver']),
  startDate: z.string().min(1, '시작일을 선택하세요'),
  endDate: z.string().min(1, '종료일을 선택하세요'),
  billingModel: z.enum(['fixed', 'daily', 'none']).optional(),
  budget: z.number().optional(),
})

type FormValues = z.infer<typeof schema>

const ADVERTISERS = ['삼성전자', '현대자동차', 'LG생활건강', '배달의민족', '네이버', '바리미디어']

interface CampaignFormProps {
  defaultValues?: Partial<Campaign>
  onSubmit: (data: FormValues) => Promise<void>
  submitLabel?: string
}

export function CampaignForm({ defaultValues, onSubmit, submitLabel = '등록' }: CampaignFormProps) {
  const [step, setStep] = useState(1)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      advertiser: defaultValues?.advertiser ?? '',
      agency: defaultValues?.agency ?? '',
      type: defaultValues?.type ?? 'direct',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      billingModel: defaultValues?.billingModel ?? 'none',
      budget: defaultValues?.budget,
    },
  })

  const watchedValues = watch()
  const billingModel = watch('billingModel')

  const TYPE_OPTIONS = [
    { value: 'direct', label: '직접판매' },
    { value: 'own', label: '자사광고' },
    { value: 'filler', label: '필러' },
    { value: 'naver', label: '네이버' },
  ] as const

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {/* Step indicator */}
        <div className={styles.steps}>
          {[1, 2, 3].map(s => (
            <div key={s} className={`${styles.step} ${step === s ? styles.active : ''} ${step > s ? styles.done : ''}`}>
              <span className={styles.stepNum}>{s}</span>
              <span className={styles.stepLabel}>{['기본 정보', '매체 및 기간', '예산 및 확인'][s - 1]}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>기본 정보</h2>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`}>캠페인명</label>
                <input {...register('name')} className={`${styles.input} ${errors.name ? styles.err : ''}`} placeholder="캠페인명을 입력하세요" />
                {errors.name && <p className={styles.errMsg}>{errors.name.message}</p>}
              </div>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`}>광고주</label>
                <select {...register('advertiser')} className={`${styles.input} ${errors.advertiser ? styles.err : ''}`}>
                  <option value="">광고주 선택</option>
                  {ADVERTISERS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.advertiser && <p className={styles.errMsg}>{errors.advertiser.message}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>광고대행사</label>
                <input {...register('agency')} className={styles.input} placeholder="선택 입력" />
              </div>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`}>캠페인 유형</label>
                <div className={styles.radioCards}>
                  {TYPE_OPTIONS.map(opt => (
                    <label key={opt.value} className={`${styles.radioCard} ${watch('type') === opt.value ? styles.radioCardActive : ''}`}>
                      <input type="radio" {...register('type')} value={opt.value} className={styles.radioInput} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.footer}>
                <Button type="button" variant="primary" onClick={() => setStep(2)}>다음</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>매체 및 기간</h2>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`}>집행 기간</label>
                <DateRangePicker
                  startDate={watchedValues.startDate ?? ''}
                  endDate={watchedValues.endDate ?? ''}
                  onStartChange={v => setValue('startDate', v)}
                  onEndChange={v => setValue('endDate', v)}
                />
                {(errors.startDate || errors.endDate) && <p className={styles.errMsg}>기간을 입력하세요</p>}
              </div>
              <div className={styles.footer}>
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>이전</Button>
                <Button type="button" variant="primary" onClick={() => setStep(3)}>다음</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>예산 및 확인</h2>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`}>과금 모델</label>
                <select {...register('billingModel')} className={styles.input}>
                  <option value="fixed">정액제</option>
                  <option value="daily">일단가</option>
                  <option value="none">입력안함</option>
                </select>
              </div>
              {billingModel !== 'none' && (
                <div className={styles.field}>
                  <label className={styles.label}>집행 금액</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="0"
                    onChange={e => setValue('budget', e.target.value ? Number(e.target.value) : undefined)}
                    defaultValue={defaultValues?.budget}
                  />
                </div>
              )}
              <div className={styles.footer}>
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>이전</Button>
                <Button type="submit" disabled={isSubmitting}>{submitLabel}</Button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 작성 요약 패널 */}
      <aside className={styles.summary}>
        <h3 className={styles.summaryTitle}>작성 요약</h3>
        <div className={styles.summaryItem}><span>캠페인명</span><span>{watchedValues.name || '-'}</span></div>
        <div className={styles.summaryItem}><span>광고주</span><span>{watchedValues.advertiser || '-'}</span></div>
        <div className={styles.summaryItem}><span>유형</span><span>{watchedValues.type || '-'}</span></div>
        <div className={styles.summaryItem}><span>기간</span><span>{watchedValues.startDate && watchedValues.endDate ? `${watchedValues.startDate} ~ ${watchedValues.endDate}` : '-'}</span></div>
        {watchedValues.budget && <div className={styles.summaryItem}><span>예산</span><span>{watchedValues.budget.toLocaleString()}원</span></div>}
      </aside>
    </div>
  )
}
