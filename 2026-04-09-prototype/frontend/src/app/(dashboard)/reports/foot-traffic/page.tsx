'use client'
import { useFootTraffic } from '@/hooks/reports/useReports'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import styles from '../reports.module.css'

export default function FootTrafficPage() {
  const { data: items, isLoading } = useFootTraffic()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>유동인구 데이터 연동</h1>
        <Button size="sm">+ 연동 추가</Button>
      </div>
      <p className={styles.desc}>매체별 유동인구 데이터 포인트 연결 현황을 관리합니다.</p>
      {isLoading ? <p>불러오는 중...</p> : (
        <table className={styles.ftTable}>
          <thead className={styles.ftThead}>
            <tr>
              {['매체명', '데이터포인트 ID', '최근 수신', '상태', ''].map((h, i) => (
                <th key={i} className={styles.ftTh}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className={styles.ftTr}>
                <td className={styles.ftTd}>{item.mediaName}</td>
                <td className={styles.ftTdMono}>{item.dataPointId}</td>
                <td className={styles.ftTd}>
                  {item.lastReceived ? new Date(item.lastReceived).toLocaleString('ko-KR') : '-'}
                </td>
                <td className={styles.ftTd}>
                  <Badge variant={item.status === 'connected' ? 'active' : 'error'}>
                    {item.status === 'connected' ? '연결됨' : '오류'}
                  </Badge>
                </td>
                <td className={styles.ftTdRight}>
                  <Button size="sm" variant="ghost">설정</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
