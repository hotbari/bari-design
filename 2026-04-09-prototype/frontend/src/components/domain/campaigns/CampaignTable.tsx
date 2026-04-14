'use client'
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import type { Campaign } from '@/types/campaign'

const columns: Column<Campaign>[] = [
  { key: 'name', header: '캠페인명', render: (r) => r.name },
  { key: 'advertiser', header: '광고주', render: (r) => r.advertiser },
  { key: 'status', header: '상태', render: (r) => <CampaignStatusBadge status={r.status} />, width: '100px' },
]

export function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={campaigns}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/campaigns/${r.id}`)}
    />
  )
}
