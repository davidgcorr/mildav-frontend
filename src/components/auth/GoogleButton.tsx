import { GoogleLogin } from '@react-oauth/google'
import { useGoogleAuth } from '@/hooks/useAuth'
import { getApiError } from '@/lib/errors'

/**
 * Renders Google's own sign-in button.
 * On success, @react-oauth/google returns a signed ID token (credential)
 * which we forward to POST /api/auth/google/ — no client-secret needed
 * on the frontend side.
 */
export function GoogleButton() {
  const { mutate, isPending, error } = useGoogleAuth()

  const apiError = error ? getApiError(error) : null

  return (
    <div className="flex flex-col items-center gap-2">
      <GoogleLogin
        onSuccess={({ credential }) => {
          if (credential) mutate(credential)
        }}
        onError={() => {
          // Google popup was closed or failed — no action needed,
          // the user can simply try again.
        }}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
      />
      {isPending && (
        <p className="text-sm text-muted-foreground">Signing in…</p>
      )}
      {apiError && (
        <p role="alert" className="text-sm text-destructive">
          {apiError}
        </p>
      )}
    </div>
  )
}
