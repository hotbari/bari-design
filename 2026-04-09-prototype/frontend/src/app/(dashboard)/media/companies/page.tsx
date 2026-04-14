'use client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import styles from '../media.module.css'

const companies = [
  { id: 'mc-001', name: '서울옥외광고(주)', mediaCount: 12, status: 'active' as const },
  { id: 'mc-002', name: '홍대미디어(주)', mediaCount: 5, status: 'active' as const },
]

export default function MediaCompaniesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>미디어사 관리</h1>
        <Button>+ 미디어사 등록</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {companies.map((c) => (
          <Card key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>{c.name}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', margin: '4px 0 0' }}>매체 {c.mediaCount}개</p>
            </div>
            <Badge variant="active">활성</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}
