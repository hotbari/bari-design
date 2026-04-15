'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MediaCompany } from '@/types/media-company'
import styles from './page.module.css'

async function fetchCompanies(): Promise<MediaCompany[]> {
  const res = await fetch('/api/media-companies')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

export default function MediaCompaniesPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ['media-companies'], queryFn: fetchCompanies })
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<MediaCompany | null>(null)
  const [form, setForm] = useState({ name: '', businessNumber: '', ceoName: '', contactPhone: '', address: '' })

  const filtered = data.filter(c =>
    c.name.includes(search) || c.ceoName.includes(search)
  )

  function openNew() {
    setEditTarget(null)
    setForm({ name: '', businessNumber: '', ceoName: '', contactPhone: '', address: '' })
    setDrawerOpen(true)
  }

  function openEdit(c: MediaCompany) {
    setEditTarget(c)
    setForm({ name: c.name, businessNumber: c.businessNumber, ceoName: c.ceoName, contactPhone: c.contactPhone, address: c.address })
    setDrawerOpen(true)
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/media">매체 관리</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>매체사 관리</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>매체사 관리</h1>
            <p className={styles.pageDesc}>등록된 매체사를 관리합니다</p>
          </div>
          <button className={styles.btnPrimary} onClick={openNew}>+ 매체사 등록</button>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              className={styles.searchInput}
              placeholder="매체사명, 대표자명으로 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.toolbar}>
          <span className={styles.count}>총 {filtered.length}개</span>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
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
              {isLoading ? (
                <tr><td colSpan={6} className={styles.empty}>로딩 중...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className={styles.empty}>검색 결과가 없습니다</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td className={styles.tdName}>{c.name}</td>
                  <td>{c.businessNumber}</td>
                  <td>{c.ceoName}</td>
                  <td><span className={styles.countBadge}>{c.mediaCount}</span></td>
                  <td className={styles.tdDate}>{c.registeredAt}</td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => openEdit(c)}>수정</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {drawerOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setDrawerOpen(false)} />
          <aside className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>{editTarget ? '매체사 수정' : '매체사 등록'}</h2>
              <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <label className={styles.fieldLabel}>매체사명 *</label>
              <input className={styles.fieldInput} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <label className={styles.fieldLabel}>사업자등록번호 *</label>
              <input className={styles.fieldInput} value={form.businessNumber} onChange={e => setForm(f => ({ ...f, businessNumber: e.target.value }))} />
              <label className={styles.fieldLabel}>대표자명 *</label>
              <input className={styles.fieldInput} value={form.ceoName} onChange={e => setForm(f => ({ ...f, ceoName: e.target.value }))} />
              <label className={styles.fieldLabel}>연락처</label>
              <input className={styles.fieldInput} type="tel" value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} />
              <label className={styles.fieldLabel}>주소</label>
              <input className={styles.fieldInput} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div className={styles.drawerFooter}>
              <button className={styles.btnSecondary} onClick={() => setDrawerOpen(false)}>취소</button>
              <button className={styles.btnPrimary} onClick={() => setDrawerOpen(false)}>
                {editTarget ? '저장' : '등록'}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
