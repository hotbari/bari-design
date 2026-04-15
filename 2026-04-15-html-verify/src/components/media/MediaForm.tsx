'use client'
import { useState } from 'react'
import { MediaDetail } from '@/types/media'
import styles from './MediaForm.module.css'

interface Props {
  defaultValues?: Partial<MediaDetail>
  onSubmit: (data: any) => void
  mode?: 'new' | 'edit'
}

export function MediaForm({ defaultValues, onSubmit, mode = 'new' }: Props) {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [company, setCompany] = useState(defaultValues?.company ?? '')
  const [type, setType] = useState(defaultValues?.type ?? '고정형')
  const [address, setAddress] = useState(defaultValues?.address ?? '')
  const [orientation, setOrientation] = useState(defaultValues?.orientation ?? '가로형')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [displayType, setDisplayType] = useState(defaultValues?.displayType ?? 'LCD')
  const [screenSize, setScreenSize] = useState(defaultValues?.screenSize ?? '')
  const [resolution, setResolution] = useState(defaultValues?.resolution ?? '')
  const [ledPitch, setLedPitch] = useState(defaultValues?.ledPitch ?? '')
  const [irregularSize, setIrregularSize] = useState('없음')
  const [operatingDays, setOperatingDays] = useState(defaultValues?.operatingDays ?? '매일')
  const [operatingHoursMode, setOperatingHoursMode] = useState('24시간')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('22:00')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ name, company, type, address, orientation, description, displayType, screenSize, resolution, ledPitch: displayType === 'LED' ? ledPitch : undefined, operatingDays, operatingHours: operatingHoursMode === '24시간' ? '24시간' : `${startTime}–${endTime}` })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Card 1: 기본 정보 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>기본 정보</h2>
        <div className={styles.fieldRow}>
          <label className={styles.label}>매체명 *</label>
          <input className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>매체사 *</label>
          <select className={styles.select} value={company} onChange={e => setCompany(e.target.value)} required>
            <option value="">매체사 선택</option>
            <option>네이버 OOH 미디어</option>
            <option>카카오 스크린</option>
            <option>롯데 광고</option>
            <option>서울디지털미디어</option>
          </select>
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>매체 종류 *</label>
          <div className={styles.radioGroup}>
            {['고정형', '이동형'].map(v => (
              <label key={v} className={styles.radioLabel}>
                <input type="radio" value={v} checked={type === v} onChange={() => setType(v as any)} />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>설치 주소 *</label>
          <input className={styles.input} value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>설치 형태 *</label>
          <div className={styles.radioGroup}>
            {['가로형', '세로형'].map(v => (
              <label key={v} className={styles.radioLabel}>
                <input type="radio" value={v} checked={orientation === v} onChange={() => setOrientation(v)} />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>비고</label>
          <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        </div>
      </div>

      {/* Card 2: 디스플레이 설정 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>디스플레이 설정</h2>
        <div className={styles.fieldRow}>
          <label className={styles.label}>디스플레이 유형 *</label>
          <select className={styles.select} value={displayType} onChange={e => setDisplayType(e.target.value)} required>
            <option value="LCD">LCD</option>
            <option value="LED">LED</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>화면 사이즈 *</label>
          <input className={styles.input} placeholder="예: 75인치" value={screenSize} onChange={e => setScreenSize(e.target.value)} required />
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>해상도 *</label>
          <select className={styles.select} value={resolution} onChange={e => setResolution(e.target.value)} required>
            <option value="">해상도 선택</option>
            <option value="1920×1080">1920×1080 (FHD)</option>
            <option value="1080×1920">1080×1920 (세로 FHD)</option>
            <option value="3840×2160">3840×2160 (4K)</option>
            <option value="1280×720">1280×720 (HD)</option>
          </select>
        </div>
        {displayType === 'LED' && (
          <>
            <div className={styles.fieldRow}>
              <label className={styles.label}>LED Pitch *</label>
              <input className={styles.input} placeholder="예: P2.5" value={ledPitch} onChange={e => setLedPitch(e.target.value)} />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.label}>비정형 사이즈</label>
              <div className={styles.radioGroup}>
                {['없음', '있음'].map(v => (
                  <label key={v} className={styles.radioLabel}>
                    <input type="radio" value={v} checked={irregularSize === v} onChange={() => setIrregularSize(v)} />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card 3: 운영 시간 */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>운영 시간</h2>
        <div className={styles.fieldRow}>
          <label className={styles.label}>운영 요일 *</label>
          <div className={styles.radioGroup}>
            {['매일', '평일', '주말', '직접 선택'].map(v => (
              <label key={v} className={styles.radioLabel}>
                <input type="radio" value={v} checked={operatingDays === v} onChange={() => setOperatingDays(v)} />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.fieldRow}>
          <label className={styles.label}>운영 시간 *</label>
          <div className={styles.radioGroup}>
            {['24시간', '직접 입력'].map(v => (
              <label key={v} className={styles.radioLabel}>
                <input type="radio" value={v} checked={operatingHoursMode === v} onChange={() => setOperatingHoursMode(v)} />
                {v}
              </label>
            ))}
          </div>
          {operatingHoursMode === '직접 입력' && (
            <div className={styles.timeInputs}>
              <input type="time" className={styles.timeInput} value={startTime} onChange={e => setStartTime(e.target.value)} />
              <span className={styles.timeSep}>~</span>
              <input type="time" className={styles.timeInput} value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnCancel} onClick={() => history.back()}>취소</button>
        <button type="button" className={styles.btnSecondary}>임시 저장</button>
        <button type="submit" className={styles.btnPrimary}>{mode === 'edit' ? '수정' : '등록'}</button>
      </div>
    </form>
  )
}
