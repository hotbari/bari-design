import styles from '../materials.module.css'

const specs = [
  { label: '빌보드', resolution: '1920×1080', format: 'MP4, H.264', maxSize: '100MB', duration: '10~30초' },
  { label: '사이니지', resolution: '1080×1920', format: 'MP4, H.264', maxSize: '50MB', duration: '10~30초' },
  { label: '디스플레이', resolution: '1280×720', format: 'MP4, H.264', maxSize: '50MB', duration: '10~15초' },
  { label: '스크린', resolution: '1920×1080', format: 'MP4, H.264', maxSize: '100MB', duration: '10~30초' },
]

export default function MaterialSpecGuidePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>소재 규격 안내</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', margin: 0 }}>
        매체 유형별 소재 규격을 확인하세요. 규격 미충족 시 검수에서 반려될 수 있습니다.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
            {['매체 유형', '해상도', '파일 형식', '최대 용량', '재생시간'].map((h) => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((s) => (
            <tr key={s.label} style={{ borderBottom: '1px solid var(--color-neutral-100)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.label}</td>
              <td style={{ padding: '10px 12px' }}>{s.resolution}</td>
              <td style={{ padding: '10px 12px' }}>{s.format}</td>
              <td style={{ padding: '10px 12px' }}>{s.maxSize}</td>
              <td style={{ padding: '10px 12px' }}>{s.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
