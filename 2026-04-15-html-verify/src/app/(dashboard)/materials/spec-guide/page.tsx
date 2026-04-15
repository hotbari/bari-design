'use client'
import { useState } from 'react'
import styles from './page.module.css'

interface SpecCard {
  id: string
  name: string
  company: string
  type: string
  resolution: string
  formats: string[]
  fileSize: string
  bitrate: string
  duration: string
  colorSpace: string
  guide: string
}

const SPEC_DATA: SpecCard[] = [
  {
    id: 'spec-1', name: '롯데월드 타워 외부 LED', company: '롯데 광고', type: '대형 LED',
    resolution: '1920 × 1080 px', formats: ['MP4', 'JPG'], fileSize: '최대 200 MB',
    bitrate: '8,000 kbps', duration: '15초 / 30초', colorSpace: 'sRGB',
    guide: 'H.264 코덱, AAC 오디오. 야간 밝기 조정을 위해 HDR 콘텐츠는 지원하지 않습니다. 소재 업로드 후 최대 24시간 이내 검수가 완료됩니다.',
  },
  {
    id: 'spec-2', name: '코엑스 SM타운 아트리움', company: '서울디지털미디어', type: '인터랙티브',
    resolution: '2560 × 1440 px', formats: ['MP4', 'PNG'], fileSize: '최대 500 MB',
    bitrate: '15,000 kbps', duration: '15초 / 30초 / 60초', colorSpace: 'DCI-P3',
    guide: '3면 아트리움 특성상 좌/중/우 패널이 분리됩니다. 개별 소재 또는 통합 파노라마 소재 모두 허용. 오디오는 선택 사항입니다.',
  },
  {
    id: 'spec-3', name: '강남역 출구 빌보드', company: '네이버 OOH 미디어', type: '옥외 LED',
    resolution: '3840 × 2160 px', formats: ['MP4', 'JPG'], fileSize: '최대 1 GB',
    bitrate: '20,000 kbps', duration: '15초 / 30초', colorSpace: 'sRGB',
    guide: '4K 해상도 소재 권장. 옥외 환경 특성상 고대비 색상 사용 권장. 오디오 미지원. 소재 제출 마감 48시간 전까지 업로드 필요.',
  },
  {
    id: 'spec-4', name: '홍대 거리 미디어폴', company: '카카오 스크린', type: '디지털 사이니지',
    resolution: '1080 × 1920 px', formats: ['MP4', 'JPG', 'PNG'], fileSize: '최대 100 MB',
    bitrate: '6,000 kbps', duration: '15초', colorSpace: 'sRGB',
    guide: '세로형(9:16) 소재 전용. H.265(HEVC) 코덱 지원. 여러 폴에 동일 소재 적용 시 일괄 업로드 기능을 사용하세요.',
  },
  {
    id: 'spec-5', name: '잠실 롯데타운 전광판', company: '롯데 광고', type: '옥외 LED',
    resolution: '2880 × 1620 px', formats: ['MP4'], fileSize: '최대 800 MB',
    bitrate: '16,000 kbps', duration: '15초 / 30초', colorSpace: 'sRGB',
    guide: '특수 조형물 외벽 LED. 소재 내 텍스트는 전체 화면의 10% 미만으로 제한. 야간 광량 자동 조절. 검수 완료까지 최대 3영업일 소요.',
  },
  {
    id: 'spec-6', name: '신촌 이마트 DID', company: 'KIA 미디어', type: '디지털 사이니지',
    resolution: '1920 × 1080 px', formats: ['MP4', 'JPG', 'PNG'], fileSize: '최대 150 MB',
    bitrate: '8,000 kbps', duration: '15초 / 30초', colorSpace: 'sRGB',
    guide: '실내 매장 환경. 음소거 기본값이므로 오디오 없이도 효과적인 소재 제작 권장. 가격 정보 포함 소재는 별도 약관 적용.',
  },
]

const TYPE_OPTIONS = ['디지털 사이니지', '대형 LED', '인터랙티브', '옥외 LED']

export default function MaterialSpecGuidePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = SPEC_DATA.filter(c => {
    const matchName = !search || c.name.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || c.type === typeFilter
    return matchName && matchType
  })

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>소재 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>소재 규격 안내</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>소재 규격 안내</h1>
            <p className={styles.pageDesc}>매체별 허용 소재 형식 및 기술 규격. 검수 통과율을 높이기 위해 규격을 확인하세요.</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              className={styles.searchInput}
              placeholder="매체명으로 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className={styles.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">전체 유형</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className={styles.resultCount}>총 {filtered.length}개 매체</span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <div className={styles.emptyMsg}>검색 결과가 없습니다. 다른 검색어를 입력해 보세요.</div>
          </div>
        ) : (
          <div className={styles.specGrid}>
            {filtered.map(card => (
              <article key={card.id} className={styles.specCard}>
                <div className={styles.specCardHeader}>
                  <div>
                    <div className={styles.specCardName}>{card.name}</div>
                    <div className={styles.specCardCompany}>{card.company}</div>
                  </div>
                  <span className={styles.specCardType}>{card.type}</span>
                </div>
                <div className={styles.specCardBody}>
                  <dl className={styles.specDl}>
                    <dt>해상도</dt><dd>{card.resolution}</dd>
                    <dt>허용 포맷</dt>
                    <dd>
                      <div className={styles.formatTags}>
                        {card.formats.map(f => <span key={f} className={styles.formatTag}>{f}</span>)}
                      </div>
                    </dd>
                    <dt>파일 크기</dt><dd>{card.fileSize}</dd>
                    <dt>권장 비트레이트</dt><dd>{card.bitrate}</dd>
                    <dt>재생 시간</dt><dd>{card.duration}</dd>
                    <dt>색 공간</dt><dd>{card.colorSpace}</dd>
                  </dl>
                  <div className={styles.specCardGuide}>
                    <div className={styles.specCardGuideLabel}>업로드 가이드</div>
                    {card.guide}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
