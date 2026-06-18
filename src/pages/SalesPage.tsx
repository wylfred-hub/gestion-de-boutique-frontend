// import { useEffect, useState } from 'react'
// import { createSale, getSales, updateSaleStatus } from '../api/sales'
// import { ApiError } from '../components/common/ApiError'
// import { Loading } from '../components/common/Loading'
// import { SaleForm } from '../components/sales/SaleForm'
// import { SaleList } from '../components/sales/SaleList'
// import { useSaleStore } from '../store/saleStore'
// import type { SalePayload, SaleStatus } from '../types'
// import { getApiErrorMessage } from '../api/client'

// type ApiSale = {
//   id: number | string
//   sale_number?: string
//   reference?: string
//   status: SaleStatus
//   total_amount?: number
//   total?: number
//   items?: unknown
//   client?: {
//     id: string | number
//     name?: string
//     full_name?: string
//   } | null
//   user?: {
//     id?: string | number
//     name?: string
//     role?: string
//   } | null
// }

// // Normalise la réponse backend pour correspondre à la shape attendue par le front.
// function normalizeSalesFromApi(raw: ApiSale[]) {
//   return (raw ?? []).map((sale) => {
//     const clientFullName = sale.client?.full_name ?? (sale.client as { fullName?: string } | null)?.fullName

//     const normalizedClient = sale.client
//       ? {
//           ...sale.client,
//           name: sale.client.name ?? clientFullName,
//         }
//       : sale.client

//     const saleItems = (sale as { items?: unknown }).items
//     const items = Array.isArray(saleItems) ? saleItems : []

//     return {
//       ...sale,
//       id: String(sale.id),
//       reference: sale.reference ?? sale.sale_number,
//       status: sale.status,
//       total: Number(sale.total ?? sale.total_amount ?? 0) || 0,
//       client: normalizedClient,
//       items,
//       user: sale.user,
//     }
//   })
// }

// export function SalesPage() {
//   const sales = useSaleStore((state) => state.sales)
//   const setSales = useSaleStore((state) => state.setSales)
//   const upsertSale = useSaleStore((state) => state.upsertSale)
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     let ignore = false

//     async function loadSales() {
//       try {
//         setLoading(true)
//         setError(null)
//         const { items } = await getSales()

//         if (!ignore) {
//           setSales(normalizeSalesFromApi(items) as typeof sales)
//         }

//       } catch (caughtError) {
//         if (!ignore) {
//           const message = getApiErrorMessage(caughtError, "Impossible de charger les ventes depuis l'API.")
//           setError(message)
//           console.error('getSales error:', caughtError)
//         }
//       } finally {
//         if (!ignore) {
//           setLoading(false)
//         }
//       }
//     }

//     void loadSales()

//     return () => {
//       ignore = true
//     }
//   }, [setSales])

//   async function handleCreateSale(payload: SalePayload) {
//     try {
//       setSaving(true)
//       setError(null)
//       const sale = await createSale(payload)

//       // Le backend peut renvoyer une sale avec items absents.
//       // On force au minimum la compatibilité UI.
//       const normalized = {
//         ...sale,
//         id: String(sale.id),
//         reference: (sale as { reference?: string; sale_number?: string }).reference ?? (sale as { reference?: string; sale_number?: string }).sale_number,
//         total: Number((sale as { total?: number; total_amount?: number }).total ?? (sale as { total?: number; total_amount?: number }).total_amount ?? 0) || 0,
//         items: Array.isArray((sale as { items?: unknown }).items) ? (sale as { items?: unknown }).items : [],
//       } as typeof sales[number]

//       upsertSale(normalized)
//     } catch (caughtError) {
//       const message = getApiErrorMessage(caughtError, 'Impossible de creer la vente.')
//       setError(message)
//       console.error('createSale error:', caughtError)
//     } finally {
//       setSaving(false)
//     }
//   }

//   async function handleStatusChange(saleId: string, status: SaleStatus) {
//     try {
//       setError(null)
//       const sale = await updateSaleStatus(saleId, status)
//       upsertSale(sale as unknown as typeof sales[number])
//     } catch (caughtError) {
//       const message = getApiErrorMessage(caughtError, "Impossible de changer l'etat de la vente.")
//       setError(message)
//       console.error('updateSaleStatus error:', caughtError)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">Ventes</h1>
//         <p className="text-sm text-slate-500">Creation, suivi et changements d'etat.</p>
//       </div>

//       {error ? <ApiError message={error} /> : null}
//       <SaleForm loading={saving} onSubmit={handleCreateSale} />
//       {loading ? <Loading /> : <SaleList sales={sales} onStatusChange={handleStatusChange} />}
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { createSale, deleteSale, getSales, updateSale, updateSaleStatus } from '../api/sales'
import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import { SaleForm } from '../components/sales/SaleForm'
import { SaleList } from '../components/sales/SaleList'
import { useSaleStore } from '../store/saleStore'
import type { Sale, SalePayload, SaleStatus } from '../types'
import { getApiErrorMessage } from '../api/client'

type ModalMode = 'edit' | 'delete' | null

type ApiSale = {
  id: number | string
  sale_number?: string
  reference?: string
  status: SaleStatus
  total_amount?: number
  total?: number
  items?: unknown
  client?: {
    id: string | number
    name?: string
    full_name?: string
  } | null
  user?: {
    id?: string | number
    name?: string
    role?: string
  } | null
}

function normalizeSalesFromApi(raw: ApiSale[] | unknown[]) {
  // Évite que TS infère le type de l'élément en `unknown`.
  const list = (raw as ApiSale[] | undefined) ?? []
  return list.map((sale) => {
    const clientFullName = sale.client?.full_name ?? (sale.client as { fullName?: string } | null)?.fullName
    const normalizedClient = sale.client
      ? { ...sale.client, name: sale.client.name ?? clientFullName }
      : sale.client
    const saleItems = (sale as { items?: unknown }).items
    const items = Array.isArray(saleItems) ? saleItems : []
    return {
      ...sale,
      id: String(sale.id),
      reference: sale.reference ?? sale.sale_number,
      status: sale.status,
      total: Number(sale.total ?? sale.total_amount ?? 0) || 0,
      client: normalizedClient,
      items,
      user: sale.user,
    }
  })
}

export function SalesPage() {
  const sales = useSaleStore((state) => state.sales)
  const setSales = useSaleStore((state) => state.setSales)
  const upsertSale = useSaleStore((state) => state.upsertSale)
  const removeSale = useSaleStore((state) => state.removeSale)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  function openEdit(sale: Sale) {
    setSelectedSale(sale)
    setError(null)
    setModalMode('edit')
  }

  function openDelete(sale: Sale) {
    setSelectedSale(sale)
    setError(null)
    setModalMode('delete')
  }

  function closeModal() {
    setModalMode(null)
    setSelectedSale(null)
    setError(null)
  }

  useEffect(() => {
    let ignore = false
    async function loadSales() {
      try {
        setLoading(true)
        setError(null)
        const { items } = await getSales()
        if (!ignore) {
          // backend peut renvoyer sale_number: null; on normalise vers une forme sans null
          const normalized = normalizeSalesFromApi(items).map((s) => {
            const sale_number = (s as { sale_number?: string | null }).sale_number
            const reference = s.reference ?? sale_number ?? String(s.id)
            return { ...s, reference }
          })

          setSales(normalized as typeof sales)
        }
      } catch (caughtError) {
        if (!ignore) setError(getApiErrorMessage(caughtError, "Impossible de charger les ventes."))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    void loadSales()
    return () => { ignore = true }
  }, [setSales])

  async function handleCreateSale(payload: SalePayload) {
    try {
      setSaving(true)
      setError(null)
      const sale = await createSale(payload)
      const normalized = {
        ...sale,
        id: String(sale.id),
        reference: (sale as { reference?: string; sale_number?: string }).reference ?? (sale as { reference?: string; sale_number?: string }).sale_number,
        total: Number((sale as { total?: number; total_amount?: number }).total ?? (sale as { total?: number; total_amount?: number }).total_amount ?? 0) || 0,
        items: Array.isArray((sale as { items?: unknown }).items) ? (sale as { items?: unknown }).items : [],
      } as typeof sales[number]
      upsertSale(normalized)
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, 'Impossible de créer la vente.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleEditSale(payload: SalePayload) {
    if (!selectedSale) return
    try {
      setSaving(true)
      setError(null)
      const sale = await updateSale(selectedSale.id, payload)
      upsertSale(sale as unknown as typeof sales[number])
      closeModal()
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, 'Impossible de modifier la vente.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteSale() {
    if (!selectedSale) return
    try {
      setSaving(true)
      setError(null)
      await deleteSale(selectedSale.id)
      removeSale(selectedSale.id)
      closeModal()
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, 'Impossible de supprimer la vente.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(saleId: string, status: SaleStatus) {
    try {
      setError(null)
      const sale = await updateSaleStatus(saleId, status)
      upsertSale(sale as unknown as typeof sales[number])
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, "Impossible de changer l'état de la vente."))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ventes</h1>
        <p className="text-sm text-slate-500">Création, suivi et changements d'état.</p>
      </div>

      {error && !modalMode ? <ApiError message={error} /> : null}

      <SaleForm loading={saving} onSubmit={handleCreateSale} />

      {loading ? <Loading /> : (
        <SaleList
          sales={sales}
          onStatusChange={handleStatusChange}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Modal modifier */}
      {modalMode === 'edit' && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-slate-900">
              Modifier la vente {selectedSale.reference ?? selectedSale.id}
            </h3>
            <p className="mb-4 text-sm text-slate-500">Seules les ventes en cours peuvent être modifiées.</p>

            {error && <ApiError message={error} />}

            <SaleForm
              loading={saving}
              initialValues={selectedSale}
              onSubmit={handleEditSale}
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={closeModal}
                disabled={saving}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal supprimer */}
      {modalMode === 'delete' && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-slate-900">Supprimer la vente</h3>
            <p className="text-sm text-slate-600">
              Êtes-vous sûr de vouloir supprimer la vente{' '}
              <strong>{selectedSale.reference ?? selectedSale.id}</strong> ? Le stock sera réintégré.
            </p>

            {error && <div className="mt-3"><ApiError message={error} /></div>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={closeModal}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="button"
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                onClick={() => void handleDeleteSale()}
                disabled={saving}
              >
                {saving ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}