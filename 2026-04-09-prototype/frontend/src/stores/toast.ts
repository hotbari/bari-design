import { atom, useAtom } from 'jotai'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export const toastsAtom = atom<Toast[]>([])

export function useToast() {
  const [toasts, setToasts] = useAtom(toastsAtom)

  function add(message: string, type: ToastType): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
    return id
  }

  function remove(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, add, remove }
}
