'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import type { Media } from '@/types/media'
import styles from './MediaForm.module.css'

const schema = z.object({
  name: z.string().min(1, '매체명을 입력하세요'),
  companyId: z.string().min(1, '매체사를 선택하세요'),
  type: z.enum(['고정형', '이동형']),
  location: z.string().min(1, '설치 주소를 입력하세요'),
  orientation: z.enum(['가로형', '세로형']),
  note: z.string().optional(),
  displayType: z.enum(['LCD', 'LED', '기타']),
  displayTypeOther: z.string().optional(),
  screenSize: z.string().min(1, '화면 사이즈를 입력하세요'),
  resolution: z.string().min(1, '해상도를 선택하세요'),
  ledPitch: z.string().optional(),
  irregularSize: z.boolean().optional(),
  operatingDays: z.enum(['매일', '평일', '주말', '직접선택']),
  operatingDaysCustom: z.array(z.string()).optional(),
  operatingHoursType: z.enum(['24시간', '직접입력']),
  operatingHoursStart: z.string().optional(),
  operatingHoursEnd: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const RESOLUTIONS = ['1920×1080', '1080×1920', '3840×2160', '1280×720', '1024×768', '기타']
const DAYS = ['월', '화', '수', '목', '금', '토', '일']

const DAYS_PRESET: Record<string, string[]> = {
  '매일': ['월', '화', '수', '목', '금', '토', '일'],
  '평일': ['월', '화', '수', '목', '금'],
  '주말': ['토', '일'],
}

interface MediaFormProps {
  defaultValues?: Partial<Media>
  companies: Array<{ id: string; name: string }>
  onSubmit: (data: FormValues) => Promise<void>
  mode: 'create' | 'edit'
}

export function MediaForm({ defaultValues, companies, onSubmit, mode }: MediaFormProps) {
  const { show } = useToast()

  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: '고정형',
      orientation: '가로형',
      displayType: 'LCD',
      operatingDays: '매일',
      operatingHoursType: '24시간',
      operatingDaysCustom: [],
      ...defaultValues,
    },
  })

  const watchType = watch('type')
  const watchDisplayType = watch('displayType')
  const watchOperatingDays = watch('operatingDays')
  const watchOperatingHours = watch('operatingHoursType')
  const watchDaysCustom = watch('operatingDaysCustom') || []

  useEffect(() => {
    if (watchOperatingDays !== '직접선택') {
      setValue('operatingDaysCustom', DAYS_PRESET[watchOperatingDays] || [])
    }
  }, [watchOperatingDays, setValue])

  const toggleDay = (day: string) => {
    const current = watchDaysCustom
    const next = current.includes(day) ? current.filter(d => d !== day) : [...current, day]
    setValue('operatingDaysCustom', next)
  }

  const handleTempSave = () => {
    show('임시 저장되었습니다.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container} noValidate>
      {/* 카드 1: 기본 정보 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>기본 정보</h2>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>매체명</label>
          <input
            {...register('name')}
            className={`${styles.input} ${errors.name ? styles.error : ''}`}
            placeholder="매체명을 입력하세요"
          />
          {errors.name && <p className={styles.errorMsg}>{errors.name.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>매체사</label>
          <select {...register('companyId')} className={`${styles.select} ${errors.companyId ? styles.error : ''}`}>
            <option value="">매체사 선택</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.companyId && <p className={styles.errorMsg}>{errors.companyId.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>매체 종류</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className={styles.radioGroup}>
                {(['고정형', '이동형'] as const).map(v => (
                  <button
                    type="button"
                    key={v}
                    className={`${styles.radioBtn} ${field.value === v ? styles.selected : ''}`}
                    onClick={() => field.onChange(v)}
                  >{v}</button>
                ))}
              </div>
            )}
          />
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>
            {watchType === '이동형' ? '거점 주소' : '설치 주소'}
          </label>
          <input
            {...register('location')}
            className={`${styles.input} ${errors.location ? styles.error : ''}`}
            placeholder="주소를 입력하세요"
          />
          {errors.location && <p className={styles.errorMsg}>{errors.location.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>설치 형태</label>
          <Controller
            name="orientation"
            control={control}
            render={({ field }) => (
              <div className={styles.radioGroup}>
                {(['가로형', '세로형'] as const).map(v => (
                  <button
                    type="button"
                    key={v}
                    className={`${styles.radioBtn} ${field.value === v ? styles.selected : ''}`}
                    onClick={() => field.onChange(v)}
                  >{v}</button>
                ))}
              </div>
            )}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>비고</label>
          <textarea {...register('note')} className={styles.textarea} placeholder="비고를 입력하세요" />
        </div>
      </div>

      {/* 카드 2: 디스플레이 설정 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>디스플레이 설정</h2>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>디스플레이 유형</label>
            <select {...register('displayType')} className={styles.select}>
              <option value="LCD">LCD</option>
              <option value="LED">LED</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>화면 사이즈</label>
            <input
              {...register('screenSize')}
              className={`${styles.input} ${errors.screenSize ? styles.error : ''}`}
              placeholder="예: 75인치"
            />
            {errors.screenSize && <p className={styles.errorMsg}>{errors.screenSize.message}</p>}
          </div>
        </div>

        {/* LED 조건부 필드 */}
        <div className={`${styles.collapsible} ${watchDisplayType === 'LED' ? styles.expanded : ''}`}>
          <div className={styles.collapsibleInner}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`}>LED Pitch</label>
                <input {...register('ledPitch')} className={styles.input} placeholder="예: P4" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>비정형 사이즈</label>
                <Controller
                  name="irregularSize"
                  control={control}
                  render={({ field }) => (
                    <div className={styles.radioGroup}>
                      {[{ label: '없음', value: false }, { label: '있음', value: true }].map(opt => (
                        <button
                          type="button"
                          key={String(opt.value)}
                          className={`${styles.radioBtn} ${field.value === opt.value ? styles.selected : ''}`}
                          onClick={() => field.onChange(opt.value)}
                        >{opt.label}</button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 기타 조건부 필드 */}
        <div className={`${styles.collapsible} ${watchDisplayType === '기타' ? styles.expanded : ''}`}>
          <div className={styles.collapsibleInner}>
            <div className={styles.field}>
              <label className={styles.label}>기타 유형명</label>
              <input {...register('displayTypeOther')} className={styles.input} placeholder="유형명을 입력하세요" />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>해상도</label>
          <select {...register('resolution')} className={`${styles.select} ${errors.resolution ? styles.error : ''}`}>
            <option value="">해상도 선택</option>
            {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.resolution && <p className={styles.errorMsg}>{errors.resolution.message}</p>}
        </div>
      </div>

      {/* 카드 3: 운영 시간 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>운영 시간</h2>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>운영 요일</label>
          <Controller
            name="operatingDays"
            control={control}
            render={({ field }) => (
              <div>
                <div className={styles.radioGroup}>
                  {(['매일', '평일', '주말', '직접선택'] as const).map(v => (
                    <button
                      type="button"
                      key={v}
                      className={`${styles.radioBtn} ${field.value === v ? styles.selected : ''}`}
                      onClick={() => field.onChange(v)}
                    >{v}</button>
                  ))}
                </div>
                <div className={`${styles.collapsible} ${field.value === '직접선택' ? styles.expanded : ''}`}>
                  <div className={styles.collapsibleInner}>
                    <div className={styles.dayBtns}>
                      {DAYS.map(day => (
                        <button
                          type="button"
                          key={day}
                          className={`${styles.dayBtn} ${watchDaysCustom.includes(day) ? styles.daySelected : ''}`}
                          onClick={() => toggleDay(day)}
                        >{day}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>운영 시간</label>
          <Controller
            name="operatingHoursType"
            control={control}
            render={({ field }) => (
              <div>
                <div className={styles.radioGroup}>
                  {(['24시간', '직접입력'] as const).map(v => (
                    <button
                      type="button"
                      key={v}
                      className={`${styles.radioBtn} ${field.value === v ? styles.selected : ''}`}
                      onClick={() => field.onChange(v)}
                    >{v}</button>
                  ))}
                </div>
                <div className={`${styles.collapsible} ${field.value === '직접입력' ? styles.expanded : ''}`}>
                  <div className={styles.collapsibleInner}>
                    <div className={styles.timeRow}>
                      <input type="time" {...register('operatingHoursStart')} className={styles.timeInput} />
                      <span className={styles.timeSep}>~</span>
                      <input type="time" {...register('operatingHoursEnd')} className={styles.timeInput} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={handleTempSave}>임시 저장</Button>
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>취소</Button>
        <Button type="submit" disabled={isSubmitting}>
          {mode === 'create' ? '매체 등록' : '수정 완료'}
        </Button>
      </div>
    </form>
  )
}
