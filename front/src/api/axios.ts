import axios, { AxiosError } from 'axios'
import { getAccessToken } from '../utils/auth'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
})

api.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  r => r,
  (error: AxiosError) => {
    // normalize: always reject with a plain object
    const payload = (error.response?.data as any) ?? null;
    const normalized = {
      original: error,
      status: error.response?.status,
      message: payload?.message ?? error.message,
      code: payload?.code,
      details: payload?.details
    };
    return Promise.reject(normalized);
  }
);

export type ApiError = {
  original?: unknown;
  status?: number;
  message: string;
  code?: string;
  details?: Array<{ field?: string; message: string }>;
};

export function parseApiError(e: unknown): ApiError {
  if (!e) return { message: 'Erreur inconnue' };
  if ((e as ApiError).message) return e as ApiError;
  return { message: String((e as Error).message ?? 'Erreur') };
}

export default api