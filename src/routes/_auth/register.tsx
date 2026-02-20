import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Create your account</h2>
      <RegisterForm />
    </>
  )
}
