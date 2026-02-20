import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = import.meta.env['VITE_API_URL'] ?? 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor ───────────────────────────────────────────────────
// Attach the access token to every outgoing request.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response interceptor ──────────────────────────────────────────────────
// On 401, attempt a silent token refresh then replay the failed request.
// All requests that arrive while a refresh is in flight are queued and
// resolved/rejected once the refresh settles.

let isRefreshing = false

type QueueItem = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let failedQueue: QueueItem[] = []

function flushQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((item) => {
    if (error) item.reject(error)
    else item.resolve(token!)
  })
  failedQueue = []
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const originalRequest = error.config as RetryableRequest

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Queue this request if a refresh is already running
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.set('Authorization', `Bearer ${token}`)
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const { refreshToken, setAccessToken, logout } = useAuthStore.getState()

    if (!refreshToken) {
      logout()
      isRefreshing = false
      return Promise.reject(error)
    }

    try {
      // Use a plain axios call (not the intercepted instance) to avoid loops
      const { data } = await axios.post<{ access: string }>(
        `${API_URL}/api/auth/token/refresh/`,
        { refresh: refreshToken },
      )

      setAccessToken(data.access)
      originalRequest.headers.set('Authorization', `Bearer ${data.access}`)
      flushQueue(null, data.access)
      return api(originalRequest)
    } catch (refreshError) {
      flushQueue(refreshError)
      logout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
