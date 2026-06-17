import { useState } from 'react'
import type { CreateUserPayload } from '../api/users'
import { createUser } from '../api/users'
import { getApiErrorMessage } from '../api/client'
import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import { UserForm } from './UserForm'

export function SuperAdminCreateUserButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(payload: CreateUserPayload) {
    setLoading(true)
    setError(null)
    try {
      await createUser(payload)
      setOpen(false)
      window.location.reload()
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, "Impossible de créer l'utilisateur."))
      throw caughtError
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        onClick={() => setOpen(true)}
      >
        + Créer un utilisateur
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-slate-900">Créer un utilisateur</h3>
            <p className="mb-4 text-sm text-slate-500">
              Création sans rattachement à une organisation.
            </p>

            {error ? <ApiError message={error} /> : null}
            {loading && !error ? <Loading /> : null}

            <UserForm
              loading={loading}
              onSubmit={async (payload) => {
                await handleCreate(payload)
              }}
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}