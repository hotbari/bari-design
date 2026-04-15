import { AppShell } from '@/components/layout/AppShell'
import { MediaGroupPanel } from '@/components/domain/media/MediaGroupPanel'

const BREADCRUMBS = [
  { label: '매체 관리', href: '/media' },
  { label: '매체 그룹' },
]

export default function MediaGroupsPage() {
  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
          매체 그룹
        </h1>
      </div>
      <MediaGroupPanel />
    </AppShell>
  )
}
