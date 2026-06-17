import { useState } from 'react'
import type { CreateUserPayload } from '../../api/users'
import type { UserRole } from '../../types'
import { ApiError } from '../components/common/ApiError'

type UserFormProps = {
  loading: boolean
  onSubmit: (payload: CreateUserPayload) => Promise<void>
}

export function UserForm({ loading, onSubmit }: UserFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('vendeur')
  const [formError, setFormError] = useState<string | null>(null)

  const availableRoles: UserRole[] = ['vendeur', 'admin', 'super_admin']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError('Tous les champs sont obligatoires.')
      return
    }

    if (password.trim().length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    try {
      await onSubmit({
         name: name.trim(), 
         email: email.trim(), 
         password: password.trim(), 
         role 
      })
      // Réinitialiser le formulaire après succès
      setName('')
      setEmail('')
      setPassword('')
      setRole('vendeur')
    } catch (error) {
      // L'erreur est déjà gérée par le composant parent (UsersPage)
      // ou par getApiErrorMessage dans la fonction onSubmit si elle est wrappée
    }
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-4">
      {formError && <ApiError message={formError} />}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="user-name">
          Nom complet
        </label>
        <input
          id="user-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
          type="text"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="user-email">
          Email
        </label>
        <input
          id="user-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
          type="email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="user-password">
          Mot de passe
        </label>
        <input
          id="user-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
          type="password"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="user-role">Rôle global</label>
        <select id="user-role" name="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none" disabled={loading}>
          {availableRoles.map((r) => <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Création...' : 'Créer l\'utilisateur'}
      </button>
    </form>
  )
}
