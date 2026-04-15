'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CampaignDetail } from '@/types/campaign'
import styles from './CampaignForm.module.css'

interface Props {
  defaultValues?: Partial<CampaignDetail>
  onSubmit: (data: any) => void
}

const STEPS = ['기본 정보', '매체 및 기간', '예산 및 확인']

const MEDIA_OPTIONS = [
  '강남역 디지털 보드', '홍대 스크린 A', '코엑스 몰 대형 LED',
  '명동 광장 보드', '여의도 IFC 보드', '신촌 광장 보드',
  '이태원 LED 타워', '부산 서면 보드', '대구 동성로 스크린',
]

export function CampaignForm({ defaultValues = {}, onSubmit }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 1 fields
  const [name, setName] = useState(defaultValues.name ?? '')
  const [advertiser, setAdvertiser] = useState(defaultValues.advertiser ?? '')
  const [agency, setAgency] = useState(defaultValues.agency ?? '')
  const [type, setType] = useState(defaultValues.type ?? 'direct')

  // Step 2 fields
  const [mediaList, setMediaList] = useState<string[]>(defaultValues.mediaList ?? [])
  const [mediaSearch, setMediaSearch] = useState('')
  const [startDate, setStartDate] = useState(defaultValues.startDate ?? '')
  const [endDate, setEndDate] = useState(defaultValues.endDate ?? '')

  // Step 3 fields
  const [priceModel, setPriceModel] = useState(defaultValues.priceModel ?? 'fixed')
  const [budget, setBudget] = useState(defaultValues.budget != null ? String(defaultValues.budget) : '')

  // Advertiser modal
  const [showAdvertiserModal, setShowAdvertiserModal] = useState(false)
  const [newCompany, setNewCompany] = useState('')
  const [newBizNo, setNewBizNo] = useState('')
  const [newContact, setNewContact] = useState('')
  const [newContactName, setNewContactName] = useState('')

  function toggleMedia(m: string) {
    setMediaList(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  function handleSubmit() {
    onSubmit({
      name, advertiser, agency, type,
      mediaList,
      startDate, endDate,
      targetMedia: mediaList.length > 0 ? `${mediaList[0]}${mediaList.length > 1 ? ` 외 ${mediaList.length - 1}개` : ''}` : '',
      priceModel,
      budget: budget ? Number(budget) : 0,
    })
  }

  const filteredMedia = MEDIA_OPTIONS.filter(m =>
    !mediaSearch || m.includes(mediaSearch)
  )

  const showBudgetInput = priceModel === 'fixed' || priceModel === 'CPM' || priceModel === 'CPD'

  return (
    <div className={styles.layout}>
      <div className={styles.formArea}>
        {/* Step indicator */}
        <div className={styles.stepIndicator}>
          {STEPS.map((label, i) => (
            <div key={i} className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
              <div className={styles.stepCircle}>{i < step ? '✓' : i + 1}</div>
              <span className={styles.stepLabel}>{label}</span>
              {i < STEPS.length - 1 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        <div className={styles.formCard}>
          {/* Step 1 */}
          {step === 0 && (
            <div className={styles.formSection}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>캠페인명 <span className={styles.required}>*</span></label>
                <input className={styles.input} placeholder="캠페인명을 입력하세요" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>광고주 <span className={styles.required}>*</span></label>
                <div className={styles.fieldRow}>
                  <select className={styles.select} value={advertiser} onChange={e => setAdvertiser(e.target.value)}>
                    <option value="">광고주 선택</option>
                    <option>삼성전자</option>
                    <option>현대자동차</option>
                    <option>LG생활건강</option>
                    <option>배달의민족</option>
                  </select>
                  <button className={styles.btnSecondary} type="button" onClick={() => setShowAdvertiserModal(true)}>신규 등록</button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>광고대행사</label>
                <input className={styles.input} placeholder="선택 입력" value={agency} onChange={e => setAgency(e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>캠페인 유형 <span className={styles.required}>*</span></label>
                <div className={styles.radioCards}>
                  {(['direct', 'own', 'filler', 'naver'] as const).map(t => (
                    <label key={t} className={`${styles.radioCard} ${type === t ? styles.radioCardSelected : ''}`}>
                      <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} />
                      <span className={styles.radioCardLabel}>
                        {t === 'direct' ? '직접판매' : t === 'own' ? '자사광고' : t === 'filler' ? '필러' : '네이버'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className={styles.formSection}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>대상 매체 <span className={styles.required}>*</span></label>
                <input className={styles.input} placeholder="매체명 검색" value={mediaSearch} onChange={e => setMediaSearch(e.target.value)} />
                <div className={styles.checkList}>
                  {filteredMedia.map(m => (
                    <label key={m} className={styles.checkItem}>
                      <input type="checkbox" checked={mediaList.includes(m)} onChange={() => toggleMedia(m)} />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
                {mediaList.length > 0 && (
                  <div className={styles.selectedTags}>
                    {mediaList.map(m => (
                      <span key={m} className={styles.tag}>{m} <button type="button" onClick={() => toggleMedia(m)}>×</button></span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>집행 기간 <span className={styles.required}>*</span></label>
                <div className={styles.fieldRow}>
                  <input type="date" className={styles.dateInput} value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <span className={styles.dateSep}>~</span>
                  <input type="date" className={styles.dateInput} value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className={styles.formSection}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>과금 모델 <span className={styles.required}>*</span></label>
                <select className={styles.select} value={priceModel} onChange={e => setPriceModel(e.target.value as any)}>
                  <option value="fixed">정액제</option>
                  <option value="CPM">일단가 (CPM)</option>
                  <option value="CPD">일단가 (CPD)</option>
                </select>
              </div>

              {showBudgetInput && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>집행 금액</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="금액 입력"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <div className={styles.formActions}>
            {step > 0 && (
              <button className={styles.btnSecondary} type="button" onClick={() => setStep(s => s - 1)}>이전</button>
            )}
            <button className={styles.btnCancel} type="button" onClick={() => router.back()}>취소</button>
            {step < STEPS.length - 1 ? (
              <button className={styles.btnPrimary} type="button" onClick={() => setStep(s => s + 1)}>다음</button>
            ) : (
              <button className={styles.btnPrimary} type="button" onClick={handleSubmit}>
                {defaultValues.id ? '저장' : '등록'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right summary panel */}
      <div className={styles.summaryPanel}>
        <h3 className={styles.summaryTitle}>작성 요약</h3>
        <div className={styles.summaryRows}>
          <SummaryRow label="캠페인명" value={name || '-'} />
          <SummaryRow label="광고주" value={advertiser || '-'} />
          <SummaryRow label="유형" value={type === 'direct' ? '직접판매' : type === 'own' ? '자사광고' : type === 'filler' ? '필러' : '네이버'} />
          <SummaryRow label="매체" value={mediaList.length > 0 ? `${mediaList.length}개 선택` : '-'} />
          <SummaryRow label="기간" value={startDate && endDate ? `${startDate} ~ ${endDate}` : '-'} />
          <SummaryRow label="예산" value={budget ? Number(budget).toLocaleString() + '원' : '-'} />
        </div>
      </div>

      {/* Advertiser modal */}
      {showAdvertiserModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAdvertiserModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>광고주 신규 등록</h3>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>회사명 <span className={styles.required}>*</span></label>
              <input className={styles.input} value={newCompany} onChange={e => setNewCompany(e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>사업자등록번호 <span className={styles.required}>*</span></label>
              <input className={styles.input} placeholder="000-00-00000" value={newBizNo} onChange={e => setNewBizNo(e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>담당자명</label>
              <input className={styles.input} value={newContactName} onChange={e => setNewContactName(e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>연락처</label>
              <input type="tel" className={styles.input} value={newContact} onChange={e => setNewContact(e.target.value)} />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setShowAdvertiserModal(false)}>취소</button>
              <button className={styles.btnPrimary} onClick={() => {
                if (newCompany) { setAdvertiser(newCompany); setShowAdvertiserModal(false) }
              }}>등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryRow}>
      <span className={styles.summaryLabel}>{label}</span>
      <span className={styles.summaryValue}>{value}</span>
    </div>
  )
}
