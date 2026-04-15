'use client'
import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MaterialDetail } from '@/types/material'
import { PreviewCard } from '@/components/material-detail/PreviewCard'
import { MaterialInfoGrid } from '@/components/material-detail/MaterialInfoGrid'
import { ReviewTimeline } from '@/components/material-detail/ReviewTimeline'
import { ScheduleTable } from '@/components/material-detail/ScheduleTable'
import { VersionHistory } from '@/components/material-detail/VersionHistory'
import { DeleteModal } from '@/components/material-detail/DeleteModal'
import styles from './page.module.css'

async function fetchMaterial(id: string): Promise<MaterialDetail> {
  const res = await fetch(`/api/materials/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading } = useQuery({
    queryKey: ['material', id],
    queryFn: () => fetchMaterial(id),
  })
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  if (isLoading) return <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  if (!data) return <div className={styles.page}><div className={styles.content}>소재를 찾을 수 없습니다.</div></div>

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <a href="/materials">소재 관리</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{data.name}</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.detailTop}>
          <PreviewCard
            material={data}
            onDelete={() => setIsDeleteOpen(true)}
            onReplace={() => {}}
          />

          <div className={styles.metaCard}>
            <MaterialInfoGrid material={data}/>
            <ReviewTimeline
              timeline={data.timeline}
              failReason={data.failReason}
              fixGuide={data.fixGuide}
            />
          </div>
        </div>

        <section className={styles.sectionCard} aria-label="편성 및 버전 정보">
          <ScheduleTable schedules={data.schedules}/>
          <VersionHistory versions={data.versions}/>
        </section>
      </main>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => setIsDeleteOpen(false)}
        playlistCount={data.playlistCount}
      />
    </div>
  )
}
