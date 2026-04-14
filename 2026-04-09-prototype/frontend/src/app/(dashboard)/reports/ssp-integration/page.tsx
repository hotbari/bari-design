'use client'
import { useSsp } from '@/hooks/reports/useReports'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import styles from '../reports.module.css'

export default function SspIntegrationPage() {
  const { data: ssps, isLoading } = useSsp()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>SSP 연동</h1>
        <Button size="sm">+ SSP 추가</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : (
        <div className={styles.cardList}>
          {ssps?.map((ssp) => (
            <div key={ssp.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <p className={styles.cardName}>{ssp.name}</p>
                <p className={styles.cardMeta}>{ssp.endpoint}</p>
                {ssp.lastSync && (
                  <p className={styles.cardMeta}>
                    최근 동기화: {new Date(ssp.lastSync).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
              <div className={styles.cardActions}>
                <Badge variant={ssp.status === 'connected' ? 'active' : 'neutral'}>
                  {ssp.status === 'connected' ? '연결됨' : '미연결'}
                </Badge>
                <Button size="sm" variant="secondary">설정</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
