export interface PlaylistItem {
  materialId: string
  materialName: string
  duration: number  // seconds
  order: number
}

export interface Playlist {
  id: string
  name: string
  mediaId: string
  mediaName: string
  totalDuration: number  // seconds, computed from items
  itemCount: number
  items: PlaylistItem[]
  updatedAt: string
}
