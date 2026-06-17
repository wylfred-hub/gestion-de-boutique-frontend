import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { login } from '../../api/auth'
import { getApiErrorMessage } from '../../api/client'
import { useAuthStore } from '../../store/authStore'

export function LoginForm() {
  const setSession = useAuthStore((state) => state.setSession)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    setLoading(true)
    setError(null)

    try {
      const session = await login({ email, password })
      setSession(session.token, session.user, session.organization)

      const role = String(session.user.role ?? '').trim().toLowerCase()
      window.location.href = role === 'super_admin' ? '/super-admin-dashboard' : '/organization-select'
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, 'Connexion impossible. Verifie tes identifiants ou ton API.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 outline-none focus:border-emerald-500"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
          Mot de passe
        </label>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 outline-none focus:border-emerald-500"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        <LogIn size={18} />
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}
