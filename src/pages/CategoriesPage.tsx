import { useEffect, useMemo, useRef, useState } from 'react'
import { Building2, Pencil, Plus, Trash2 } from 'lucide-react'

import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import { getApiErrorMessage } from '../api/client'

import type { Category } from '../types'
import { createCategory, getCategories } from '../api/categories'
import { updateCategory, deleteCategory } from '../api/categories'




type CategoryFormMode = 'create' | 'edit'

type CategoryFormState = {
  name: string
}

function normalizeCategoryForForm(c: Category | null): CategoryFormState {
  return {
    name: c?.name ?? '',
  }
}



export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formMode, setFormMode] = useState<CategoryFormMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryFormState>({ name: '' })
  const [formError, setFormError] = useState<string | null>(null)

  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getCategories()
        if (!ignore) setCategories(Array.isArray(data) ? data : [])
      } catch (caught) {
        if (!ignore) setError(getApiErrorMessage(caught, 'Impossible de charger les catégories.'))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void load()

    return () => {
      ignore = true
    }
  }, [])

const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => String(a.name).localeCompare(String(b.name)))
  }, [categories])


  function openCreate() {
    setFormMode('create')
    setEditingId(null)
    setForm({ name: '' })
    setFormError(null)
    dialogRef.current?.showModal()
  }

  function openEdit(cat: Category) {
    setFormMode('edit')
    setEditingId(String((cat as any).id))
    setForm(normalizeCategoryForForm(cat))
    setFormError(null)
    dialogRef.current?.showModal()
  }

  function closeDialog() {
    dialogRef.current?.close?.()
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setFormError('Le nom de la catégorie est obligatoire.')
      return
    }

    setFormError(null)

    const payload = {
      name: form.name.trim(),
    }

    try {
      setSaving(true)

      if (formMode === 'create') {
        const created = await createCategory(payload)
        const normalized: Category = {
          ...(created as Category),
          organizationId: (created as any).organizationId ?? (created as any).organization_id,
        }
        setCategories((prev) => [normalized, ...prev])
      } else {
        if (!editingId) throw new Error('ID manquant')
        const updated = await updateCategory(editingId, payload)
        setCategories((prev) =>
          prev.map((c) => {
            const updatedId = (updated as Category).id
            return c.id === updatedId ? (updated as Category) : c
          })
        )
      }

      closeDialog()
    } catch (caught) {
      setFormError(getApiErrorMessage(caught, "Impossible d'enregistrer la catégorie."))
    } finally {
      setSaving(false)
    }
  }


  async function handleDelete(id: string) {
    const confirmed = window.confirm('Supprimer cette catégorie ?')
    if (!confirmed) return

    try {
      setSaving(true)
      setError(null)
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c: any) => String(c.id) !== String(id)))
    } catch (caught) {
      setError(getApiErrorMessage(caught, 'Impossible de supprimer la catégorie.'))
    } finally {
      setSaving(false)
    }
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <Building2 size={20} />
          </span>
          Catégories
        </h1>
        <p className="text-sm text-slate-500">Créer / modifier / supprimer les catégories.</p>
      </div>

      {error ? <ApiError message={error} /> : null}

      <div className="flex items-center justify-between">
        <div />
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          onClick={openCreate}
          disabled={saving}
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <dialog
        ref={(el) => {
          dialogRef.current = el
        }}
        className="modal"
        onClose={() => setFormError(null)}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            {formMode === 'create' ? 'Créer une catégorie' : 'Modifier une catégorie'}
          </h3>
          <p className="mb-4 text-sm text-slate-500">Champs requis : nom.</p>

          {formError ? <ApiError message={formError} /> : null}

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cat-name">
                Nom
              </label>
              <input
                id="cat-name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
                type="text"
                required
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

      <div className="mt-4">
        {loading ? (
          <Loading />
        ) : sortedCategories.length === 0 ? (
          <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">Aucune catégorie.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2 font-semibold">Nom</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map((cat) => (
                  <tr key={String((cat as any).id)} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-900">{cat.name}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:bg-slate-50"
                          onClick={() => openEdit(cat)}
                          disabled={saving}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Pencil size={16} /> Modifier
                          </span>
                        </button>

                        <button
                          type="button"
                          className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-60"
                          onClick={() => handleDelete(String((cat as any).id))}
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
    </div>
  )
}

