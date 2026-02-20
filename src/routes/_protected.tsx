import { createFileRoute, redirect, Outlet, Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

// Layout route for authenticated pages.
// Any child route is automatically protected.
export const Route = createFileRoute('/_protected')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending } = useLogout()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="text-lg font-semibold text-gray-900">
            Mildav
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                {user.first_name || user.username}
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={() => logout()}
            >
              {isPending && <Loader2 className="animate-spin" />}
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
