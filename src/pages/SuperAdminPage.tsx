import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Building2,
  Pencil,
  Plus,
  Shield,
  Settings,
  Trash2,
  Users,
} from 'lucide-react'

import { createOrganization, deleteOrganization, getOrganizations, updateOrganization } from '../api/organizations'
import { MembersTab } from './MembersTab'

import { getApiErrorMessage } from '../api/client'
import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import type { Organization } from '../types'

type OrganizationFormMode = 'create' | 'edit'

type OrganizationFormState = {
  name: string
  email: string
  phone: string
  address: string
}

function normalizeOrganizationForForm(org: Organization | null): OrganizationFormState {
  return {
    name: org?.name ?? '',
    email: org?.email ?? '',
    phone: org?.phone ?? '',
    address: org?.address ?? '',
  }
}




export function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'organizations' | 'members' | 'settings'>('organizations')

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const [formMode, setFormMode] = useState<OrganizationFormMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<OrganizationFormState>({ name: '', email: '', phone: '', address: '' })



  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getOrganizations()
        if (!ignore) {
          setOrganizations(Array.isArray(data) ? data : [])
        }
      } catch (caughtError) {
        if (!ignore) {
          setError(getApiErrorMessage(caughtError, 'Impossible de charger les organisations.'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void load()

    return () => {
      ignore = true
    }
  }, [])

  const sortedOrganizations = useMemo(() => {
    return [...organizations].sort((a, b) => a.name.localeCompare(b.name))
  }, [organizations])

  function openCreate() {
    setFormMode('create')
    setEditingId(null)
    setForm(normalizeOrganizationForForm(null))
    setFormError(null)
    dialogRef.current?.showModal()
  }

  function openEdit(org: Organization) {
    setFormMode('edit')
    setEditingId(org.id)
    setForm(normalizeOrganizationForForm(org))
    setFormError(null)
    dialogRef.current?.showModal()
  }

  function closeDialog() {
    dialogRef.current?.close?.()
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setFormError('Nom, téléphone et adresse sont requis.')
      return
    }


    try {
      setSaving(true)
      setFormError(null)

      const payload = {
        name: form.name.trim(),
        // email optionnel côté front => si vide on n'envoie pas
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        phone: form.phone.trim(),
        address: form.address.trim(),
      }



        if (formMode === 'create') {
          const created = await createOrganization(payload)
          setOrganizations((prev) => [created, ...prev])
        } else {
          if (!editingId) throw new Error('ID organisation manquant')
          const updated = await updateOrganization(editingId, payload)
          setOrganizations((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
        }


      closeDialog()
    } catch (caughtError) {
      setFormError(getApiErrorMessage(caughtError, "Impossible d'enregistrer l'organisation."))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Supprimer cette organisation ?')
    if (!confirmed) return

    try {
      setSaving(true)
      setError(null)
      await deleteOrganization(id)
      setOrganizations((prev) => prev.filter((o) => o.id !== id))
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, "Impossible de supprimer l'organisation."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <Shield size={20} />
          </span>
          Super admin
        </h1>
        <p className="mt-2 text-sm text-slate-500">Gestion des organisations et écrans réservés au super_admin.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('organizations')}
          className={
            activeTab === 'organizations'
              ? 'rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white'
              : 'rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          }
        >
          <span className="mr-2 inline-flex items-center gap-2">
            <Building2 size={16} /> Organizations
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={
            activeTab === 'members'
              ? 'rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white'
              : 'rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          }
        >
          <span className="mr-2 inline-flex items-center gap-2">
            <Users size={16} /> Gestion des Vendeurs
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={
            activeTab === 'settings'
              ? 'rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white'
              : 'rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          }
        >
          <span className="mr-2 inline-flex items-center gap-2">
            <Settings size={16} /> Paramètres
          </span>
        </button>
      </div>

      {activeTab === 'organizations' ? (
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Organizations</h2>
              <p className="text-sm text-slate-500">Créer / modifier / supprimer des organisations.</p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              onClick={openCreate}
              disabled={saving}
            >
              <Plus size={16} /> Ajouter
            </button>
          </div>

          {error ? <div className="mt-4"><ApiError message={error} /></div> : null}

          <div className="mt-4">
            {loading ? (
              <Loading />
            ) : sortedOrganizations.length === 0 ? (
              <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">Aucune organisation.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-2 font-semibold">Nom</th>
                      <th className="px-3 py-2 font-semibold">Contact</th>
                      <th className="px-3 py-2 font-semibold">Adresse</th>
                      <th className="px-3 py-2 font-semibold">Statut</th>
                      <th className="px-3 py-2 font-semibold">Actions</th>
                    </tr>


                  </thead>
                  <tbody>
                    {sortedOrganizations.map((org) => (
                      <tr key={org.id} className="border-b border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-900">{org.name}</td>

                        <td className="px-3 py-2 text-slate-600">
                          <div>{org.email ? org.email : '—'}</div>
                          <div className="text-xs text-slate-400">{org.phone ? org.phone : ''}</div>
                        </td>
                        <td className="px-3 py-2 text-slate-600">{org.address ? org.address : '—'}</td>
                        <td className="px-3 py-2 text-slate-600">{org.is_active ? 'Actif' : 'Inactif'}</td>
                        <td className="px-3 py-2">

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:bg-slate-50"
                              onClick={() => openEdit(org)}
                              disabled={saving}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Pencil size={16} /> Modifier
                              </span>
                            </button>

                            <button
                              type="button"
                              className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-60"
                              onClick={() => handleDelete(org.id)}
                              disabled={saving}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Trash2 size={16} /> Supprimer
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <dialog
            ref={(el) => {
              dialogRef.current = el
            }}
            className="modal"
            onClose={() => setFormError(null)}
          >

            <div className="modal-box bg-white p-6">
              <h3 className="text-lg font-bold">
                {formMode === 'create' ? 'Créer une organisation' : 'Modifier une organisation'}
              </h3>
              <p className="mb-4 text-sm text-slate-500">Champs requis : nom, téléphone, adresse. Email optionnel.</p>


              {formError ? <ApiError message={formError} /> : null}

              <div className="mt-4 space-y-3">
                <div>

                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="org-name">
                    Nom
                  </label>
                  <input
                    id="org-name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
                    type="text"
                    required
                  />
                </div>



                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="org-email">
                    Email (optionnel)
                  </label>
                  <input
                    id="org-email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
                    type="email"
                    placeholder="organisation@entreprise.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="org-phone">
                    Téléphone
                  </label>
                  <input
                    id="org-phone"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
                    type="text"
                    required
                    placeholder="+225 ..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="org-address">
                    Adresse
                  </label>
                  <input
                    id="org-address"
                    name="address"
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
                    type="text"
                    required
                    placeholder="Adresse complète"
                  />
                </div>

              </div>

              <div className="modal-action">
                <button className="btn" type="button" onClick={closeDialog} disabled={saving}>

                  Fermer
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : formMode === 'create' ? 'Créer' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </dialog>
        </section>
      ) : null}

      {activeTab === 'members' ? (
        <MembersTab
          sortedOrganizations={sortedOrganizations}
          organizationsLoading={loading}
          organizationsLoaded={organizations.length > 0}
          onResetError={() => setError(null)}
        />
      ) : null}



      {activeTab === 'settings' ? (
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Paramètres</h2>
          <p className="mt-1 text-sm text-slate-500">Configuration globale du système (super admin).</p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold">Politiques & rôles</h3>
              <p className="mt-1 text-sm text-slate-600">Écran prêt, câblage API à ajouter.</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold">Sécurité</h3>
              <p className="mt-1 text-sm text-slate-600">Écran prêt, câblage API à ajouter.</p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
