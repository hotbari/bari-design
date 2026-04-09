import { AppShell } from '@/components/layout/AppShell'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sidebar={<Sidebar />}>
      <TopBar breadcrumb={[{ label: 'Bari CMS' }]} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </AppShell>
  )
}
