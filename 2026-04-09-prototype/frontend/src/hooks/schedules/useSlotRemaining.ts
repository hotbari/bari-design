import { useQuery } from '@tanstack/react-query'

interface SlotInfo {
  mediaId: string
  mediaName: string
  totalSlots: number
  usedSlots: number
  remainingSlots: number
}

async function fetchSlotRemaining(): Promise<SlotInfo[]> {
  const res = await fetch('/api/schedules/slot-remaining')
  if (!res.ok) throw new Error('잔여 슬롯 조회 실패')
  return res.json()
}

export function useSlotRemaining() {
  return useQuery({ queryKey: ['schedules', 'slot-remaining'], queryFn: fetchSlotRemaining })
}
