'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { MediaFilterBar } from '@/components/domain/media/MediaFilterBar'
import { MediaTable } from '@/components/domain/media/MediaTable'
import { Button } from '@/components/ui/Button'
import { useMedia } from '@/hooks/media/useMedia'
import styles from './media.module.css'

const BREADCRUMBS = [
  { label: '매체 관리', href: '/media' },
  { label: '매체 목록' },
]

interface Filters {
  company: string
  status: string
  type: string
  q: string
}

export default function MediaListPage() {
  const [filters, setFilters] = useState<Filters>({ company: '', status: '', type: '', q: '' })
  const [page, setPage] = useState(1)

  const { data, isLoading } = useMedia({
    company: filters.company || undefined,
    status: filters.status || undefined,
    type: filters.type || undefined,
    q: filters.q || undefined,
    page,
  })

  const handleFilterChange = (f: Filters) => {
    setFilters(f)
    setPage(1)
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>매체 목록</h1>
          <p className={styles.pageDesc}>등록된 DOOH 매체를 관리합니다.</p>
        </div>
        <a href="/media/new" style={{ textDecoration: 'none' }}>
          <Button>+ 매체 등록</Button>
        </a>
      </div>
      <div className={styles.filterRow}>
        <MediaFilterBar filters={filters} onChange={handleFilterChange} />
      </div>
      {isLoading ? (
        <div className={styles.loading}>불러오는 중…</div>
      ) : data ? (
        <MediaTable
          items={data.items}
          total={data.total}
          page={page}
          pageSize={data.pageSize}
          onPageChange={setPage}
        />
      ) : null}
    </AppShell>
  )
}
