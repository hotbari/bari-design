'use client'
import { useMaterials } from '@/hooks/materials/useMaterials'
import { MaterialTable } from '@/components/domain/materials/MaterialTable'
import { Button } from '@/components/ui/Button'
import styles from './materials.module.css'

export default function MaterialsPage() {
  const { data: materials, isLoading } = useMaterials()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>소재 관리</h1>
        <Button>+ 소재 등록</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <MaterialTable materials={materials ?? []} />}
    </div>
  )
}
