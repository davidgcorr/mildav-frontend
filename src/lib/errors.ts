import axios from 'axios'

/**
 * Extract a human-readable message from any error thrown by an API call.
 *
 * Priority:
 *  1. Backend JSON body → `response.data.message`
 *  2. Backend JSON body → `response.data.detail`   (DRF default key)
 *  3. Axios generic message  (e.g. "Network Error")
 *  4. Generic fallback
 */
export function getApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) return ''

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined
    if (data) {
      if (typeof data['message'] === 'string' && data['message']) return data['message']
      if (typeof data['detail'] === 'string' && data['detail']) return data['detail']
    }
    return error.message ?? fallback
  }

  if (error instanceof Error) return error.message
  return fallback
}
