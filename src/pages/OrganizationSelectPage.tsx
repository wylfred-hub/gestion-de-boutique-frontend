import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Loading } from '../components/common/Loading'
import { ApiError } from '../components/common/ApiError'
import type { Organization } from '../types'
import { useAuthStore } from '../store/authStore'
import { useOrganizationStore } from '../store/organizationStore'
import { getOrganizations } from '../api/organizations'
import { selectOrganization } from '../api/organizationSelect'

export function OrganizationSelectPage() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()

  const activeOrganization = useOrganizationStore((s) => s.activeOrganization)
  const setActiveOrganization = useOrganizationStore((s) => s.setActiveOrganization)

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const sortedOrganizations = useMemo(() => {
    return [...organizations].sort((a, b) => a.name.localeCompare(b.name))
  }, [organizations])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        if (!token || !user) return

        setLoading(true)
        setError(null)

        const data = await getOrganizations()
        if (ignore) return
        setOrganizations(Array.isArray(data) ? data : [])
      } catch (caughtError) {
        if (ignore) return
        setError('Impossible de charger les organisations.')
        console.error(caughtError)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void load()

    return () => {
      ignore = true
    }
  }, [token, user])

  const shouldRedirect = Boolean(activeOrganization?.id)

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />
  }

  // Super admin : pas besoin d'organisation.
  // IMPORTANT: attendre le chargement pour éviter une boucle de redirection.
  if (!loading && user.role === 'super_admin' && sortedOrganizations.length === 0) {
    return <Navigate to="/" replace />
  }

  if (loading) return <Loading />


  if (error) return <ApiError message={error} />

  if (sortedOrganizations.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-bold">Aucune organisation</h1>
        <p className="mt-2 text-sm text-slate-600">Ton compte ne semble appartenir à aucune organisation.</p>
      </main>
    )
  }


  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Choisir une organisation</h1>
          <p className="mt-1 text-sm text-slate-500">Les données affichées dépendront de ton choix.</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700" htmlFor="org-select">
            Organisation
          </label>

          <select
            id="org-select"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
            value={activeOrganization?.id ? String(activeOrganization.id) : ''}
            onChange={(e) => {
              const id = e.target.value
              const org = sortedOrganizations.find((o) => String(o.id) === id) ?? null
              setActiveOrganization(org)
            }}
          >
            <option value="" disabled>
              -- Choisir --
            </option>
            {sortedOrganizations.map((org) => (
              <option key={org.id} value={String(org.id)}>
                {org.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            disabled={!activeOrganization?.id || saving}
            onClick={async () => {
              console.log('click détecté', activeOrganization?.id)
              if (!activeOrganization?.id) return
              try {
                setSaving(true)
                setError(null)
                await selectOrganization(activeOrganization.id)
                navigate('/')
              } catch (caughtError) {
                const msg = caughtError instanceof Error
                  ? caughtError.message
                  : "Impossible de sélectionner l'organisation."
                setError(msg)
              } finally {
                setSaving(false)
              }
            }}
          >
            {saving ? 'Connexion...' : 'Continuer'}
          </button>

          {error ? <div className="pt-2"><ApiError message={error} /></div> : null}
        </div>
      </section>
    </main>
  )
}