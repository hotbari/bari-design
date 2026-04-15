import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import styles from './spec-guide.module.css'

const BREADCRUMBS = [{ label: '소재 관리', href: '/materials' }, { label: '소재 규격 안내' }]

const SPECS = [
  { type: '이미지 (가로형)', resolution: '1920×1080', formats: 'JPG, PNG, WebP', maxSize: '10MB', duration: '-' },
  { type: '이미지 (세로형)', resolution: '1080×1920', formats: 'JPG, PNG, WebP', maxSize: '10MB', duration: '-' },
  { type: '이미지 (정사각)', resolution: '1080×1080', formats: 'JPG, PNG, WebP', maxSize: '10MB', duration: '-' },
  { type: '영상 (FHD)', resolution: '1920×1080', formats: 'MP4 (H.264)', maxSize: '500MB', duration: '최대 60초' },
  { type: '영상 (4K)', resolution: '3840×2160', formats: 'MP4 (H.264/H.265)', maxSize: '1GB', duration: '최대 30초' },
  { type: '영상 (세로형)', resolution: '1080×1920', formats: 'MP4 (H.264)', maxSize: '300MB', duration: '최대 60초' },
]

export default function SpecGuidePage() {
  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="소재 규격 안내" desc="광고 소재 등록 전 규격을 확인하세요." />
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr><th>소재 유형</th><th>해상도</th><th>파일 형식</th><th>최대 용량</th><th>재생 시간</th></tr>
          </thead>
          <tbody>
            {SPECS.map(s => (
              <tr key={s.type}>
                <td className={styles.type}>{s.type}</td>
                <td className={styles.mono}>{s.resolution}</td>
                <td>{s.formats}</td>
                <td>{s.maxSize}</td>
                <td>{s.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.notes}>
          <h3 className={styles.notesTitle}>유의사항</h3>
          <ul className={styles.notesList}>
            <li>모든 소재는 등록 후 검수 절차를 거칩니다.</li>
            <li>규격 미달 소재는 반려될 수 있습니다.</li>
            <li>영상 소재의 음성은 기본적으로 무음 처리됩니다.</li>
            <li>소재 심의 기준은 방송광고심의에 준합니다.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  )
}
