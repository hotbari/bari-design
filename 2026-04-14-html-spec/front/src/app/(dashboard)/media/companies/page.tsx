'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { MediaCompanyDrawer } from '@/components/domain/media/MediaCompanyDrawer'
import { Button } from '@/components/ui/Button'
import { useMediaCompanies, useCreateMediaCompany, useUpdateMediaCompany } from '@/hooks/media/useMediaCompanies'
import { useToast } from '@/components/ui/Toast'
import type { MediaCompany } from '@/types/media'
import styles from '../media.module.css'
import cStyles from './companies.module.css'

const BREADCRUMBS = [
  { label: '매체 관리', href: '/media' },
  { label: '매체사 관리' },
]

export default function MediaCompaniesPage() {
  const [q, setQ] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<MediaCompany | undefined>()

  const { data: companies = [] } = useMediaCompanies(q || undefined)
  const create = useCreateMediaCompany()
  const { show } = useToast()

  const openCreate = () => {
    setEditTarget(undefined)
    setDrawerOpen(true)
  }

  const openEdit = (company: MediaCompany) => {
    setEditTarget(company)
    setDrawerOpen(true)
  }

  const updateHook = useUpdateMediaCompany(editTarget?.id || '')

  const handleSubmit = async (data: object) => {
    if (editTarget) {
      await updateHook.mutateAsync(data as Partial<MediaCompany>)
      show('매체사 정보가 수정되었습니다.')
    } else {
      await create.mutateAsync(data as Partial<MediaCompany>)
      show('매체사가 등록되었습니다.')
    }
    setDrawerOpen(false)
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>매체사 관리</h1>
          <p className={styles.pageDesc}>등록된 매체사를 관리합니다.</p>
        </div>
        <Button onClick={openCreate}>+ 매체사 등록</Button>
      </div>

      <div className={styles.filterRow}>
        <input
          type="search"
          className={cStyles.search}
          placeholder="매체사명, 대표자명으로 검색"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      <div className={cStyles.tableWrap}>
        <div className={cStyles.toolbar}>
          <span className={cStyles.count}>
            총 <strong>{companies.length}개</strong>
          </span>
        </div>
        <table className={cStyles.table}>
          <thead>
            <tr>
              <th>매체사명</th>
              <th>사업자등록번호</th>
              <th>대표자</th>
              <th>소속 매체</th>
              <th>등록일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr><td colSpan={6} className={cStyles.empty}>매체사가 없습니다.</td></tr>
            ) : companies.map(c => (
              <tr key={c.id} className={cStyles.row}>
                <td className={cStyles.companyName}>{c.name}</td>
                <td className={cStyles.text}>{c.regNumber}</td>
                <td className={cStyles.text}>{c.representative}</td>
                <td>
                  <span className={cStyles.countBadge}>{c.mediaCount}개</span>
                </td>
                <td className={cStyles.date}>{c.registeredAt}</td>
                <td className={cStyles.actions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => { e.stopPropagation(); openEdit(c) }}
                  >수정</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MediaCompanyDrawer
        open={drawerOpen}
        mode={editTarget ? 'edit' : 'create'}
        company={editTarget}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit as never}
      />
    </AppShell>
  )
}
