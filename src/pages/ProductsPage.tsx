// import { useEffect, useRef, useState } from 'react'


// import { createProduct, getProducts } from '../api/products'
// import { ApiError } from '../components/common/ApiError'

// import { Loading } from '../components/common/Loading'
// import { ProductForm } from '../components/products/ProductForm'
// import { ProductList } from '../components/products/ProductList'
// import { useProductStore } from '../store/productStore'
// import type { ProductPayload } from '../types'
// import { useOrganizationStore } from '../store/organizationStore'

// export function ProductsPage() {
//   const products = useProductStore((state) => state.products)
//   const setProducts = useProductStore((state) => state.setProducts)
//   const upsertProduct = useProductStore((state) => state.upsertProduct)
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [, setIsCreateModalOpen] = useState(false)

//   const activeOrganization = useOrganizationStore((s) => s.activeOrganization)


//   const dialogRef = useRef<HTMLDialogElement | null>(null)

//   function openCreateModal() {
//     dialogRef.current?.showModal()
//   }


//   function closeCreateModal() {
//     dialogRef.current?.close?.()
//   }








//   useEffect(() => {
//     let ignore = false

//     async function loadProducts() {
//       try {
//         setLoading(true)
//         setError(null)
//         const res = await getProducts()
//         const data = res?.items ?? []

//         const normalized = (data ?? []).map((p) => {
//           const price = Number((p as { price?: unknown }).price)
//           const costPriceRaw = (p as { costPrice?: unknown }).costPrice
//           const stockQuantity = Number((p as { stockQuantity?: unknown }).stockQuantity)
//           const alertThreshold = Number((p as { alertThreshold?: unknown }).alertThreshold)

//           return {
//             ...p,
//             price: Number.isFinite(price) ? price : 0,
//             costPrice:
//               costPriceRaw === undefined || costPriceRaw === null ? undefined : Number.isFinite(Number(costPriceRaw)) ? Number(costPriceRaw) : 0,
//             stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
//             alertThreshold: Number.isFinite(alertThreshold) ? alertThreshold : 0,
//           }
//         })

//         if (!ignore) {
//           setProducts(normalized as typeof data)
//         }
//       } catch {
//         if (!ignore) {
//           setError("Impossible de charger les produits depuis l'API.")
//         }
//       } finally {
//         if (!ignore) {
//           setLoading(false)
//         }
//       }
//     }

//     void loadProducts()

//     return () => {
//       ignore = true
//     }
//   }, [setProducts])

//   async function handleCreateProduct(payload: ProductPayload) {
//     try {
//       setSaving(true)
//       setError(null)
//       const product = await createProduct(payload)
//       upsertProduct(product)

//       // Fermer la modal après succès
//       closeCreateModal()
//     } catch (e) {
//       // Afficher la vraie validation renvoyée par Laravel (422)
//       const message =
//         e && typeof e === 'object'
//           ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
//           : undefined

//       setError(typeof e === 'string' ? e : message ?? "Impossible d'enregistrer le produit.")

//     } finally {
//       setSaving(false)
//     }

//   }


//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">Produits</h1>
//         <p className="text-sm text-slate-500">Catalogue, prix et niveaux de stock.</p>
//       </div>
//       {error ? <ApiError message={error} /> : null}

//       <div className="flex items-center justify-between">
//         <div />
//         {activeOrganization ? (
//           <button
//             className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
//             type="button"
//             onClick={openCreateModal}
//           >
//             Ajouter un nouveau produit
//           </button>
//         ) : (
//           <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
//             Sélectionnez une organisation pour ajouter des produits.
//           </p>
//         )}
//       </div>

//       {loading ? <Loading /> : <ProductList products={products} />}

//       <dialog
//         ref={(el) => {
//           dialogRef.current = el
//         }}
//         className="modal"
//         onClose={() => setIsCreateModalOpen(false)}
//       >


//         <div className="modal-box">
//           <h3 className="text-lg font-bold">Ajouter un produit</h3>
//           <p className="mb-4 text-sm text-slate-500">Renseignez les informations du produit.</p>

//           <ProductForm
//             loading={saving}
//             onSubmit={async (payload) => {
//               await handleCreateProduct(payload)
//               // Si tout va bien, la modal est fermée côté closeCreateModal()
//             }}
//           />


//         <div className="modal-action">
//             <button className="btn" type="button" onClick={closeCreateModal}>
//               Fermer
//             </button>
//           </div>

//         </div>
//       </dialog>
//     </div>
//   )
// }


import { useEffect, useState } from 'react'

import { createProduct, deleteProduct, getProducts, updateProduct } from '../api/products'
import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import { ProductForm } from '../components/products/ProductForm'
import { ProductList } from '../components/products/ProductList'
import { useProductStore } from '../store/productStore'
import type { Product, ProductPayload } from '../types'
import { useOrganizationStore } from '../store/organizationStore'

type ModalMode = 'create' | 'edit' | 'delete' | null

export function ProductsPage() {
  const products = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)
  const upsertProduct = useProductStore((state) => state.upsertProduct)
  const removeProduct = useProductStore((state) => state.removeProduct)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const activeOrganization = useOrganizationStore((s) => s.activeOrganization)

  function openCreate() {
    setSelectedProduct(null)
    setError(null)
    setModalMode('create')
  }

  function openEdit(product: Product) {
    setSelectedProduct(product)
    setError(null)
    setModalMode('edit')
  }

  function openDelete(product: Product) {
    setSelectedProduct(product)
    setError(null)
    setModalMode('delete')
  }

  function closeModal() {
    setModalMode(null)
    setSelectedProduct(null)
    setError(null)
  }

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)
        const res = await getProducts()
        const data = res?.items ?? []

        const normalized = data.map((p) => ({
          ...p,
          price: Number.isFinite(Number(p.price)) ? Number(p.price) : 0,
          costPrice: p.costPrice == null ? undefined : Number.isFinite(Number(p.costPrice)) ? Number(p.costPrice) : 0,
          stockQuantity: Number.isFinite(Number(p.stockQuantity)) ? Number(p.stockQuantity) : 0,
          alertThreshold: Number.isFinite(Number(p.alertThreshold)) ? Number(p.alertThreshold) : 0,
        }))

        if (!ignore) setProducts(normalized as typeof data)
      } catch {
        if (!ignore) setError("Impossible de charger les produits depuis l'API.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void loadProducts()
    return () => { ignore = true }
  }, [setProducts])

  async function handleCreateProduct(payload: ProductPayload) {
    try {
      setSaving(true)
      setError(null)
      const product = await createProduct(payload)
      upsertProduct(product)
      closeModal()
    } catch (e) {
      const message = (e as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(message ?? "Impossible d'enregistrer le produit.")
    } finally {
      setSaving(false)
    }
  }

  async function handleEditProduct(payload: ProductPayload) {
    if (!selectedProduct) return
    try {
      setSaving(true)
      setError(null)
      const product = await updateProduct(selectedProduct.id, payload)
      upsertProduct(product)
      closeModal()
    } catch (e) {
      const message = (e as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(message ?? "Impossible de modifier le produit.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProduct() {
    if (!selectedProduct) return
    try {
      setSaving(true)
      setError(null)
      await deleteProduct(selectedProduct.id)
      removeProduct(selectedProduct.id)
      closeModal()
    } catch (e) {
      const message = (e as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(message ?? "Impossible de supprimer le produit.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Produits</h1>
        <p className="text-sm text-slate-500">Catalogue, prix et niveaux de stock.</p>
      </div>

      {error && modalMode === null ? <ApiError message={error} /> : null}

      <div className="flex items-center justify-between">
        <div />
        {activeOrganization ? (
          <button
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            type="button"
            onClick={openCreate}
          >
            Ajouter un nouveau produit
          </button>
        ) : (
          <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
            Sélectionnez une organisation pour ajouter des produits.
          </p>
        )}
      </div>

      {loading ? <Loading /> : (
        <ProductList
          products={products}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Modal créer / modifier */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold text-slate-900">
              {modalMode === 'create' ? 'Ajouter un produit' : 'Modifier le produit'}
            </h3>
            <p className="mb-4 text-sm text-slate-500">Renseignez les informations du produit.</p>

            {error && <ApiError message={error} />}

            <ProductForm
              loading={saving}
              initialValues={modalMode === 'edit' ? selectedProduct : null}
              onSubmit={modalMode === 'create' ? handleCreateProduct : handleEditProduct}
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

      {/* Modal confirmation suppression */}
      {modalMode === 'delete' && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-slate-900">Supprimer le produit</h3>
            <p className="text-sm text-slate-600">
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong>{selectedProduct.name}</strong> ? Cette action est irréversible.
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
                onClick={() => void handleDeleteProduct()}
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