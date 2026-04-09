import { renderHook, act } from '@testing-library/react'
import { useToast, toastsAtom } from '@/stores/toast'
import { useSetAtom } from 'jotai'

describe('useToast', () => {
  beforeEach(() => {
    const { result: setter } = renderHook(() => useSetAtom(toastsAtom))
    act(() => { setter.current([]) })
  })
  it('토스트를 추가한다', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.add('저장됐습니다', 'success')
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('저장됐습니다')
    expect(result.current.toasts[0].type).toBe('success')
  })

  it('토스트를 id로 삭제한다', () => {
    const { result } = renderHook(() => useToast())
    let id: string
    act(() => {
      id = result.current.add('삭제 테스트', 'info')
    })
    act(() => {
      result.current.remove(id)
    })
    expect(result.current.toasts).toHaveLength(0)
  })
})
