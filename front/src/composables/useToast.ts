import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'
export type ToastItem = { id: string; type: ToastType; message: string }

const toasts = ref<ToastItem[]>([])

export function useToast() {
  function showToast(message: string, type: ToastType = 'info', ttl = 4000) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    toasts.value.push({ id, type, message })
    if (ttl > 0) {
      setTimeout(() => removeToast(id), ttl)
    }
    return id
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}