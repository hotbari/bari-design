'use client'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PlaylistSlot } from '@/types/playlist'
import { Button } from '@/components/ui/Button'
import styles from './PlaylistEditor.module.css'

function SortableSlot({ slot }: { slot: PlaylistSlot }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slot.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={styles.slot}
      {...attributes}
    >
      <span className={styles.handle} {...listeners}>⠿</span>
      <span className={styles.slotName}>{slot.materialName}</span>
      <span className={styles.duration}>{slot.duration}초</span>
    </div>
  )
}

interface PlaylistEditorProps {
  initialSlots: PlaylistSlot[]
  onSave: (slots: PlaylistSlot[]) => void
  isPending: boolean
}

export function PlaylistEditor({ initialSlots, onSave, isPending }: PlaylistEditorProps) {
  const [slots, setSlots] = useState<PlaylistSlot[]>(initialSlots)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSlots((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id)
        const newIndex = prev.findIndex((s) => s.id === over.id)
        return arrayMove(prev, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }))
      })
    }
  }

  const totalDuration = slots.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <span className={styles.slotCount}>{slots.length}개 소재 · 총 {totalDuration}초</span>
        <Button size="sm" loading={isPending} onClick={() => onSave(slots)}>순서 저장</Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slots.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {slots.map((slot) => <SortableSlot key={slot.id} slot={slot} />)}
        </SortableContext>
      </DndContext>
    </div>
  )
}
