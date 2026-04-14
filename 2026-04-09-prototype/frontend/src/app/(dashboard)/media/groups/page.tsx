'use client'
import { useMedia } from '@/hooks/media/useMedia'
import { Card } from '@/components/ui/Card'
import styles from '../media.module.css'

export default function MediaGroupsPage() {
  const { data: media, isLoading } = useMedia()

  const groups = media?.reduce<Record<string, typeof media>>((acc, m) => {
    if (!acc[m.type]) acc[m.type] = []
    acc[m.type].push(m)
    return acc
  }, {}) ?? {}

  const typeLabel: Record<string, string> = {
    billboard: '빌보드', signage: '사이니지', display: '디스플레이', screen: '스크린',
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>매체 그룹</h1>
      {isLoading ? <p>불러오는 중...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(groups).map(([type, items]) => (
            <Card key={type}>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px' }}>
                {typeLabel[type] ?? type} ({items.length})
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map((m) => (
                  <li key={m.id} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{m.name}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
