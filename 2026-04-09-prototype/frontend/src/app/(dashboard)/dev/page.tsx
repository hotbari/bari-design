'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { Table, type Column } from '@/components/ui/Table'
import { FilterBar, type FilterOption } from '@/components/ui/FilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { useToast } from '@/stores/toast'

interface SampleRow { id: string; name: string; status: string }

const SAMPLE_ROWS: SampleRow[] = [
  { id: '1', name: '강남대로 전광판', status: 'active' },
  { id: '2', name: '홍대입구 사이니지', status: 'pending' },
  { id: '3', name: '신촌역 디스플레이', status: 'done' },
]

const COLUMNS: Column<SampleRow>[] = [
  { key: 'name', header: '매체명', render: (r) => r.name },
  {
    key: 'status',
    header: '상태',
    render: (r) => (
      <Badge variant={r.status as 'active' | 'pending' | 'done'} dot>
        {{ active: '적용중', pending: '예약됨', done: '종료' }[r.status]}
      </Badge>
    ),
  },
]

const sectionTitle = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-neutral-500)',
  marginBottom: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

export default function DevPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { add } = useToast()

  const filters: FilterOption[] = [
    {
      key: 'status',
      label: '상태',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'active', label: '적용중' },
        { value: 'pending', label: '예약됨' },
        { value: 'done', label: '종료' },
      ],
    },
  ]

  const filteredRows = SAMPLE_ROWS.filter(
    (r) =>
      (!statusFilter || r.status === statusFilter) &&
      (!search || r.name.includes(search))
  )

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-neutral-900)', letterSpacing: '-0.03em' }}>
        컴포넌트 쇼케이스
      </h1>

      {/* Button */}
      <section>
        <h2 style={sectionTitle}>Button</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
        </div>
      </section>

      {/* Badge */}
      <section>
        <h2 style={sectionTitle}>Badge</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="active" dot>적용중</Badge>
          <Badge variant="pending" dot>예약됨</Badge>
          <Badge variant="done" dot>종료</Badge>
          <Badge variant="error" dot>오류</Badge>
          <Badge variant="neutral">기본</Badge>
        </div>
      </section>

      {/* Card */}
      <section>
        <h2 style={sectionTitle}>Card</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Card style={{ padding: '16px', width: '200px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-neutral-700)' }}>정적 카드</p>
          </Card>
          <Card onClick={() => add('카드 클릭됨', 'info')} style={{ padding: '16px', width: '200px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-neutral-700)' }}>클릭 가능 카드</p>
          </Card>
        </div>
      </section>

      {/* Modal */}
      <section>
        <h2 style={sectionTitle}>Modal</h2>
        <Button onClick={() => setModalOpen(true)}>모달 열기</Button>
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="편성표 삭제"
          description="삭제하면 복구할 수 없습니다."
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>취소</Button>
              <Button
                variant="danger"
                onClick={() => {
                  setModalOpen(false)
                  add('삭제됐습니다', 'error')
                }}
              >
                삭제
              </Button>
            </>
          }
        >
          <p style={{ fontSize: '14px', color: 'var(--color-neutral-700)' }}>
            강남권 4월 운영 편성표를 삭제하시겠습니까?
          </p>
        </Modal>
      </section>

      {/* Toast */}
      <section>
        <h2 style={sectionTitle}>Toast</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => add('저장됐습니다', 'success')}>Success</Button>
          <Button variant="secondary" onClick={() => add('오류가 발생했습니다', 'error')}>Error</Button>
          <Button variant="secondary" onClick={() => add('작업이 진행 중입니다', 'info')}>Info</Button>
        </div>
      </section>

      {/* Toggle */}
      <section>
        <h2 style={sectionTitle}>Toggle</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Toggle checked={toggle} onChange={setToggle} label={toggle ? 'On' : 'Off'} />
          <Toggle checked={true} onChange={() => {}} label="항상 On" disabled />
          <Toggle checked={false} onChange={() => {}} label="항상 Off" disabled />
        </div>
      </section>

      {/* FilterBar + Table */}
      <section>
        <h2 style={sectionTitle}>FilterBar + Table</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FilterBar
            filters={filters}
            searchPlaceholder="매체명 검색"
            searchValue={search}
            onSearch={setSearch}
            onReset={() => { setSearch(''); setStatusFilter('') }}
          />
          <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)', paddingLeft: '4px' }}>
            총 <strong style={{ color: 'var(--color-neutral-900)' }}>{filteredRows.length}</strong>건
          </div>
          <Table
            columns={COLUMNS}
            rows={filteredRows}
            keyExtractor={(r) => r.id}
            onRowClick={(r) => add(`${r.name} 클릭`, 'info')}
          />
        </div>
      </section>

      {/* Pagination */}
      <section>
        <h2 style={sectionTitle}>Pagination</h2>
        <Pagination page={page} totalPages={7} onChange={setPage} />
        <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
          현재 페이지: {page}
        </p>
      </section>
    </div>
  )
}
