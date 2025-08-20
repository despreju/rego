import { ref } from 'vue'
import type { ApiError } from '../api/axios'
import { useToast } from './useToast'

export function useError() {
  const lastError = ref<ApiError | null>(null)
  const { showToast } = useToast()

  function handleApiError(e: unknown): ApiError {
    const err = (e as ApiError)?.message ? (e as ApiError) : { message: String((e as Error)?.message ?? 'Erreur inconnue') } as ApiError
    lastError.value = err

    showToast(err.message, 'error', 6000)
    return err
  }

  function handleSuccess(message: string) {
    showToast(message, 'success', 3000)
  }

  function clearError() { lastError.value = null }

  return { lastError, handleApiError, handleSuccess, clearError }
}