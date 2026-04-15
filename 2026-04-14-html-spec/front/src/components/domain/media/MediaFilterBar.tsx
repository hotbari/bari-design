'use client'

import { useCallback } from 'react'
import styles from './MediaFilterBar.module.css'

interface Filters {
  company: string
  status: string
  type: string
  q: string
}

interface MediaFilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const COMPANIES = ['네이버 OOH 미디어', '카카오 스크린', '롯데 광고', '서울디지털미디어', 'KIA 미디어']
const STATUSES = ['온라인', '지연', '이상', '오프라인', '미연동', '비활성']
const TYPES = ['고정형', '이동형']

export function MediaFilterBar({ filters, onChange }: MediaFilterBarProps) {
  const set = useCallback((key: keyof Filters) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ ...filters, [key]: e.target.value })
  }, [filters, onChange])

  return (
    <div className={styles.bar}>
      <select className={styles.select} value={filters.company} onChange={set('company')}>
        <option value="">전체 매체사</option>
        {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className={styles.select} value={filters.status} onChange={set('status')}>
        <option value="">전체 상태</option>
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className={styles.select} value={filters.type} onChange={set('type')}>
        <option value="">전체 유형</option>
        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input
        type="search"
        className={styles.search}
        placeholder="매체명·주소 검색"
        value={filters.q}
        onChange={set('q')}
      />
    </div>
  )
}
