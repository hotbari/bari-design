'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import type { MediaCompany } from '@/types/media'
import styles from './MediaForm.module.css'

const schema = z.object({
  name: z.string().min(1, '매체사명을 입력하세요'),
  regNumber: z.string().min(12, '사업자등록번호를 입력하세요 (000-00-00000)'),
  representative: z.string().min(1, '대표자명을 입력하세요'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface MediaCompanyDrawerProps {
  open: boolean
  mode: 'create' | 'edit'
  company?: MediaCompany
  onClose: () => void
  onSubmit: (data: FormValues) => Promise<void>
}

function formatRegNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

export function MediaCompanyDrawer({ open, mode, company, onClose, onSubmit }: MediaCompanyDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', regNumber: '', representative: '', phone: '', address: '' },
  })

  const regNumberValue = watch('regNumber')

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && company) {
        reset({
          name: company.name,
          regNumber: company.regNumber,
          representative: company.representative,
          phone: company.phone || '',
          address: company.address || '',
        })
      } else {
        reset({ name: '', regNumber: '', representative: '', phone: '', address: '' })
      }
    }
  }, [open, mode, company, reset])

  const handleRegNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('regNumber', formatRegNumber(e.target.value), { shouldValidate: false })
  }

  const doSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data)
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status?: number }).status === 409) {
        setError('regNumber', { message: '이미 등록된 사업자번호입니다.' })
      }
    }
  }

  const footer = (
    <>
      <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
      <Button form="company-form" type="submit" disabled={isSubmitting}>
        {mode === 'create' ? '등록' : '저장'}
      </Button>
    </>
  )

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? '매체사 등록' : '매체사 수정'}
      onClose={onClose}
      footer={footer}
    >
      <form id="company-form" onSubmit={handleSubmit(doSubmit)} noValidate>
        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>매체사명</label>
          <input {...register('name')} className={`${styles.input} ${errors.name ? styles.error : ''}`} placeholder="매체사명을 입력하세요" />
          {errors.name && <p className={styles.errorMsg}>{errors.name.message}</p>}
        </div>
        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>사업자등록번호</label>
          <input
            value={regNumberValue}
            onChange={handleRegNumberChange}
            className={`${styles.input} ${errors.regNumber ? styles.error : ''}`}
            placeholder="000-00-00000"
            maxLength={12}
          />
          {errors.regNumber && <p className={styles.errorMsg}>{errors.regNumber.message}</p>}
        </div>
        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>대표자명</label>
          <input {...register('representative')} className={`${styles.input} ${errors.representative ? styles.error : ''}`} placeholder="대표자명을 입력하세요" />
          {errors.representative && <p className={styles.errorMsg}>{errors.representative.message}</p>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>연락처</label>
          <input {...register('phone')} type="tel" className={styles.input} placeholder="02-0000-0000" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>주소</label>
          <input {...register('address')} className={styles.input} placeholder="주소를 입력하세요" />
        </div>
      </form>
    </Drawer>
  )
}
