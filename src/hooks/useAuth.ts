import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { LoginResponse, RegisterResponse } from '@/types/auth'
import type { LoginFormValues, RegisterFormValues } from '@/schemas/auth'

export function useLogin() {
  const { login } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: LoginFormValues) =>
      api.post<LoginResponse>('/auth/login/', credentials).then((r) => r.data),

    onSuccess: (data) => {
      login(data.user, data.access, data.refresh)
      router.navigate({ to: '/dashboard' })
    },
  })
}

export function useRegister() {
  const { login } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: RegisterFormValues) =>
      api
        .post<RegisterResponse>('/auth/register/', payload)
        .then((r) => r.data),

    onSuccess: (data) => {
      login(data.user, data.access, data.refresh)
      router.navigate({ to: '/dashboard' })
    },
  })
}

/**
 * Sends a Google OAuth access token to the backend.
 * The backend endpoint POST /api/auth/google/ must accept { access_token }
 * and verify it via Google's tokeninfo/userinfo endpoint.
 */
export function useGoogleAuth() {
  const { login } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (access_token: string) =>
      api
        .post<LoginResponse>('/auth/google/', { access_token })
        .then((r) => r.data),
    onSuccess: (data) => {
      login(data.user, data.access, data.refresh)
      router.navigate({ to: '/dashboard' })
    },
  })
}

export function useLogout() {
  const { logout, refreshToken } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () =>
      // Notify the backend to blacklist the refresh token (SimpleJWT blacklist)
      api
        .post('/auth/logout/', { refresh: refreshToken })
        .catch(() => undefined), // logout locally even if the call fails

    onSettled: () => {
      logout()
      queryClient.clear()
      router.navigate({ to: '/login' })
    },
  })
}
