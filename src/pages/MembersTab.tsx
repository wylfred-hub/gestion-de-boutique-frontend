import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Users, Search } from 'lucide-react'

import { addOrganizationMember, getOrganizationMembers, removeOrganizationMember } from '../api/organizationMembers'
import { getApiErrorMessage } from '../api/client'
import { searchUsers } from '../api/users'

import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import type { Organization } from '../types'

type MemberRole = 'owner' | 'admin' | 'vendeur'

type MembersTabProps = {
  sortedOrganizations: Organization[]
  organizationsLoading: boolean
  organizationsLoaded: boolean
  onResetError: () => void
}

type MemberRow = {
  id: string
  name: string
  email: string
  role: MemberRole
}

export function MembersTab({
  sortedOrganizations,
  organizationsLoading,
  organizationsLoaded,
  onResetError,
}: MembersTabProps) {
  const [organizationId, setOrganizationId] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [membersError, setMembersError] = useState<string | null>(null)
  const [members, setMembers] = useState<MemberRow[]>([])

  const [addUserId, setAddUserId] = useState('')
  const [addUserLabel, setAddUserLabel] = useState('')
  const [addUserQuery, setAddUserQuery] = useState('')
  const [userSuggestions, setUserSuggestions] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [usersSearching, setUsersSearching] = useState(false)

  const [addRole, setAddRole] = useState<MemberRole>('admin')
  const [adding, setAdding] = useState(false)


  const availableRoles = useMemo(() => ['admin', 'vendeur'] as MemberRole[], [])

  useEffect(() => {
    if (!organizationsLoading && organizationsLoaded && sortedOrganizations.length > 0) {
      setOrganizationId(sortedOrganizations[0].id)
    }
  }, [organizationsLoading, organizationsLoaded, sortedOrganizations])

  useEffect(() => {
    if (!organizationId) return

    let ignore = false

    async function loadMembers() {
      try {
        onResetError()
        setMembersError(null)
        setLoading(true)

        const data = await getOrganizationMembers(organizationId)
        if (ignore) return

        const normalized: MemberRow[] = (Array.isArray(data) ? data : []).map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as MemberRole,
        }))

        setMembers(normalized)
      } catch (caughtError) {
        if (ignore) return
        setMembersError(getApiErrorMessage(caughtError, 'Impossible de charger les membres de l’organisation.'))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void loadMembers()

    return () => {
      ignore = true
    }
  }, [organizationId, onResetError])

  async function handleAdd() {
    if (!organizationId) return
    const userIdToSubmit = String(addUserId || '').trim()
    if (!userIdToSubmit) return

    try {
      setAdding(true)
      setMembersError(null)

      await addOrganizationMember(organizationId, {
        user_id: userIdToSubmit,
        role: addRole,
      })

      const data = await getOrganizationMembers(organizationId)
      const normalized: MemberRow[] = (Array.isArray(data) ? data : []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as MemberRole,
      }))
      setMembers(normalized)

      setAddUserId('')
      setAddUserLabel('')
      setAddUserQuery('')
      setUserSuggestions([])
      setAddRole('admin')
    } catch (caughtError) {
      setMembersError(getApiErrorMessage(caughtError, 'Impossible d’ajouter le membre.'))
    } finally {
      setAdding(false)
    }
  }


  useEffect(() => {
    let ignore = false

    async function run() {
      const q = addUserQuery.trim()
      if (q.length < 2) {
        setUserSuggestions([])
        return
      }

      setUsersSearching(true)
      try {
        const users = await searchUsers(q)
        if (ignore) return
        setUserSuggestions(
          (Array.isArray(users) ? users : []).map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
          })),
        )
      } catch {
        if (ignore) return
        setUserSuggestions([])
      } finally {
        if (!ignore) setUsersSearching(false)
      }
    }

    void run()

    return () => {
      ignore = true
    }
  }, [addUserQuery])

  async function handleRemove(userId: string) {
    const confirmed = window.confirm('Retirer ce membre de l’organisation ?')
    if (!confirmed) return

    try {
      setMembersError(null)
      await removeOrganizationMember(organizationId, userId)
      const data = await getOrganizationMembers(organizationId)
      const normalized: MemberRow[] = (Array.isArray(data) ? data : []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as MemberRole,
      }))
      setMembers(normalized)
    } catch (caughtError) {
      setMembersError(getApiErrorMessage(caughtError, 'Impossible de retirer le membre.'))
    }
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Membres</h2>
          <p className="text-sm text-slate-500">Attribuer / retirer des utilisateurs et gérer leur rôle par organisation.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-semibold text-emerald-600">
            Ajouter un membre existant
          </h3>
          
          {sortedOrganizations.length > 0 && (
            <select
              className="w-l rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
            >
              {sortedOrganizations.map((org) => (
                <option key={org.id} value={org.id} className='w-full'>{org.name}</option>
              ))}
            </select>
          )}
        </div>

          <div className="grid gap-4 md:grid-cols-3 items-end">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-700">Rechercher par nom ou email</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-emerald-500"
                  type="text"
                  value={addUserQuery}
                  onChange={(e) => {
                    setAddUserQuery(e.target.value)
                    setAddUserLabel('')
                    setAddUserId('')
                  }}
                  placeholder="Nom de l'utilisateur..."
                />
                {userSuggestions.length > 0 && !addUserLabel && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                    {userSuggestions.map((u) => (
                      <button
                        key={u.id}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                        onClick={() => {
                          setAddUserId(String(u.id))
                          setAddUserLabel(`${u.name} (${u.email})`)
                          setAddUserQuery(`${u.name} (${u.email})`)
                        }}
                      >
                        {u.name} <span className="text-slate-400">({u.email})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-slate-700">Rôle</label>
                <select
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as MemberRole)}
                >
                  {availableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button
                className="flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                onClick={() => void handleAdd()}
                disabled={adding || !addUserId}
                 disabled={loading}
              >
                {loading ? 'Création...' : '+ Ajouter'}
                {/* <Plus size={16} />   */}
              </button>
            </div>
          </div>
      </div>

      {membersError ? <div className="mt-4"><ApiError message={membersError} /></div> : null}

      <div className="mt-4 overflow-x-auto">
        {loading ? (
          <Loading />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-2 font-semibold">Utilisateur</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Rôle</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr className="border-b border-slate-100">
                  <td className="px-3 py-2" colSpan={4}>
                    <span className="text-slate-600">Aucun membre.</span>
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-900">
                      <span className="inline-flex items-center gap-2">
                        <Users size={16} /> {m.name}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{m.email}</td>
                    <td className="px-3 py-2 text-slate-600">{m.role}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-60"
                        onClick={() => void handleRemove(m.id)}
                        disabled={adding}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Trash2 size={16} /> Retirer
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
