import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UsersRound } from 'lucide-react'

import { MembersTab } from './MembersTab'

import { useAuthStore } from '../store/authStore'
import { useOrganizationStore } from '../store/organizationStore'

import { searchUsers } from '../api/users'

import { getOrganizations } from '../api/organizations'
import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'

import type { Organization, User } from '../types'

export function UsersPage() {

  const user = useAuthStore((s) => s.user)



  const activeOrganization = useOrganizationStore((s) => s.activeOrganization)

  const role = (user?.role ?? '').toString().trim().toLowerCase()
  // Rendu robuste : parfois le backend/seed peut renvoyer une variante de la valeur
  const isSuperAdmin = role === 'super_admin' || role === 'superadmin' || role.includes('super')

  const [memberOrgs, setMemberOrgs] = useState<Organization[]>([])
  const [orgsLoading, setOrgsLoading] = useState(false)
  const [orgsError, setOrgsError] = useState<string | null>(null)

  // Membres: super_admin a besoin des organisations pour pouvoir lier un user à une organisation.
  useEffect(() => {
    if (!isSuperAdmin) return

    let ignore = false
    async function run() {
      try {
        setOrgsLoading(true)
        setOrgsError(null)
        const data = await getOrganizations()
        if (ignore) return
        setMemberOrgs(Array.isArray(data) ? data : [])
      } catch {
        if (ignore) return
        setOrgsError('Impossible de charger les organisations.')
      } finally {
        if (!ignore) setOrgsLoading(false)
      }
    }

    void run()
    return () => {
      ignore = true
    }
  }, [isSuperAdmin])

  // Pour le mode non super_admin, on garde l’organisation active.
  const orgs = useMemo(() => {
    if (isSuperAdmin) return memberOrgs
    return activeOrganization ? [activeOrganization] : []
  }, [activeOrganization, isSuperAdmin, memberOrgs])

  const handleResetError = useCallback(() => {}, [])

  // Gestion globale des users (affichage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isSuperAdmin) return

    let ignore = false
    async function run() {
      try {
        setLoading(true)
        setError(null)
        const data = await searchUsers(search, { perPage: 50 })
        if (ignore) return
        setUsers(Array.isArray(data) ? data : [])
      } catch (caughtError) {
        if (ignore) return
        setError(
          caughtError instanceof Error ? caughtError.message : 'Impossible de charger les utilisateurs.',
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void run()
    return () => {
      ignore = true
    }
  }, [isSuperAdmin, search])

  if (!activeOrganization && !isSuperAdmin) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
          <UsersRound size={48} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Aucune organisation sélectionnée</h2>
          <p className="text-slate-500">Veuillez choisir une organisation pour gérer votre Personnels.</p>
          <Link
            to="/organization-select"
            className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Sélectionner une boutique
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <Users size={20} />
          </span>
          Gestion des utilisateurs
        </h1>
        {isSuperAdmin ? (
          <p className="mt-2 text-sm text-slate-500 text-emerald-600 font-medium">Mode super administrateur</p>
        ) : (
          <p className="mt-2 text-sm text-slate-500 text-emerald-600 font-medium">Boutique : {activeOrganization?.name}</p>
        )}
      </div>

      {isSuperAdmin ? (
        <div className="space-y-6">
          <section className="rounded-md border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-end">
              {/* <SuperAdminCreateUserButton /> */}
            </div>
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Gestion Utilisateurs (globale)</h2>
                <p className="text-sm text-slate-500">Rechercher et gérer tous les utilisateurs.</p>
              </div>

              <div className="w-full md:w-72">
                <label className="mb-1 block text-xs font-medium text-slate-700">Recherche</label>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="nom ou email..."
                />
              </div>
            </div>

            {error ? <ApiError message={error} /> : null}
            {loading ? <Loading /> : null}

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-2 font-semibold">Utilisateur</th>
                    <th className="px-3 py-2 font-semibold">Email</th>
                    <th className="px-3 py-2 font-semibold">Rôle (système)</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && !loading ? (
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2" colSpan={3}>
                        <span className="text-slate-600">Aucun utilisateur.</span>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-900">{u.name}</td>
                        <td className="px-3 py-2 text-slate-600">{u.email}</td>
                        <td className="px-3 py-2 text-slate-600">{u.role}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {orgsError ? <ApiError message={orgsError} /> : null}

          <MembersTab
            sortedOrganizations={orgs}
            organizationsLoading={orgsLoading}
            organizationsLoaded={!orgsLoading && orgs.length > 0}
            onResetError={handleResetError}
          />
        </div>
      ) : (
        <MembersTab
          sortedOrganizations={orgs}
          organizationsLoading={false}
          organizationsLoaded={true}
          onResetError={handleResetError}
        />
      )}
    </div>
  )
}



