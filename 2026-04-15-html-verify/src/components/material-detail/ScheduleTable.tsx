import { ScheduleEntry } from '@/types/material'
import styles from './ScheduleTable.module.css'

interface Props {
  schedules: ScheduleEntry[]
}

export function ScheduleTable({ schedules }: Props) {
  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>편성 연결 정보</h2>
        <span className={styles.count}>{schedules.length}건</span>
      </div>
      <table className={styles.table} aria-label="편성 연결 정보">
        <thead>
          <tr>
            <th scope="col">매체명</th>
            <th scope="col">편성표명</th>
            <th scope="col">편성 상태</th>
            <th scope="col">기간</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={`${s.mediaName}-${s.scheduleName}`}>
              <td>{s.mediaName}</td>
              <td>
                <a href="#" className={styles.link}>{s.scheduleName}</a>
              </td>
              <td>
                {s.status === 'on' ? (
                  <span className={styles.badgeScheduleOn} role="status">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="2"/>
                      <path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49"/>
                    </svg>
                    송출중
                  </span>
                ) : (
                  <span className={styles.badgeScheduleWait} role="status">편성대기</span>
                )}
              </td>
              <td className={styles.periodCell}>{s.period}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
