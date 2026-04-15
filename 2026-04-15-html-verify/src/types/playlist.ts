export type SlotType = 'normal' | 'dummy' | 'deleted'

export interface PlaylistSlot {
  id: string
  materialId: string | null
  materialName: string
  duration: number  // seconds
  order: number
  type: SlotType
}

export interface Playlist {
  id: string
  name: string
  slotCount: number
  materialCount: number
  dummyCount: number
  deletedCount: number
  scheduleCount: number
  updatedAt: string
  hasDeletedMaterial: boolean
}

export interface PlaylistDetail extends Playlist {
  slots: PlaylistSlot[]
}

export interface PickerMaterial {
  id: string
  name: string
  duration: number  // seconds
  resolution: string
}
