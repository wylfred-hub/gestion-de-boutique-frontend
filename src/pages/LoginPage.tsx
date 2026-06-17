import { Navigate, useLocation } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { useAuthStore } from '../store/authStore'

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const redirectTo = state?.from?.pathname ?? '/'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Connexion</h1>
          <p className="mt-1 text-sm text-slate-500">Accede a ton espace de gestion.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  )
}
