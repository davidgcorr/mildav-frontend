import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Welcome back, <span className="font-medium">{user?.username}</span>!
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards — replace with real content */}
        {['Overview', 'Activity', 'Settings'].map((title) => (
          <div
            key={title}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">Content goes here.</p>
          </div>
        ))}
      </div>
    </div>
  )
}
