// import { useEffect, useMemo, useState } from 'react'
// import type { ProductPayload, Category } from '../../types'


// import { getCategories } from '../../api/categories'

// type ProductFormProps = {
//   loading?: boolean
//   onSubmit?: (payload: ProductPayload) => Promise<void> | void
// }

// export function ProductForm({ loading = false, onSubmit }: ProductFormProps) {
//   const [categories, setCategories] = useState<Category[]>([])
//   const [categoriesLoading, setCategoriesLoading] = useState(false)
//   const [categoriesError, setCategoriesError] = useState<string | null>(null)

//   const sortedCategories = useMemo(() => {
//     return [...categories].sort((a, b) => a.name.localeCompare(b.name))
//   }, [categories])

//   useEffect(() => {
//     let ignore = false

//     async function load() {
//       try {
//         setCategoriesLoading(true)
//         setCategoriesError(null)
//         const data = await getCategories()
//         if (ignore) return
//         setCategories(Array.isArray(data) ? data : [])
//       } catch {
//         if (ignore) return
//         setCategoriesError("Impossible de charger les catégories")
//       } finally {

//         if (!ignore) setCategoriesLoading(false)
//       }
//     }

//     void load()
//     return () => {
//       ignore = true
//     }
//   }, [])

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     const formData = new FormData(event.currentTarget)

//     await onSubmit?.(
//       {
//         name: String(formData.get('name') ?? ''),
//         // SKU n'est pas demandé par StoreProductRequest (référence/barcode)
//         sku: String(formData.get('sku') ?? ''),
//         purchase_price: Number(formData.get('purchase_price') ?? 0),
//         selling_price: Number(formData.get('selling_price') ?? 0),
//         stockQuantity: Number(formData.get('stockQuantity') ?? 0),
//         stock_alert: Number(formData.get('stock_alert') ?? 0),

//         // TS local: categoryId, backend: category_id
//         categoryId: String(formData.get('category_id') ?? ''),
//         category_id: String(formData.get('category_id') ?? ''),

//         // champs optionnels/compat
//         unit: formData.get('unit') ? String(formData.get('unit')) : undefined,
//         is_active: formData.get('is_active') ? formData.get('is_active') === 'true' : undefined,
//         reference: formData.get('reference') ? String(formData.get('reference')) : undefined,
//         description: formData.get('description') ? String(formData.get('description')) : undefined,
//       } as unknown as ProductPayload,
//     )

//     event.currentTarget?.reset?.()
//   }

//   return (
//     <form className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2" onSubmit={handleSubmit}>
//       <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" name="name" placeholder="Nom" required />

//       <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" name="sku" placeholder="SKU" required />

//       <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" name="purchase_price" placeholder="Prix d'achat" type="number" required />
//       <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" name="selling_price" placeholder="Prix de vente" type="number" required />

//       <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" name="stockQuantity" placeholder="Stock" type="number" required />
//       <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" name="stock_alert" placeholder="Seuil alerte" type="number" required />

//       <label className="col-span-2 block text-sm font-medium text-slate-700" htmlFor="category-select">
//         Catégorie
//       </label>
//       {categoriesError ? (
//         <div className="col-span-2 text-sm text-red-600">{categoriesError}</div>
//       ) : null}
//       <select
//         id="category-select"
//         className="col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
//         name="category_id"
//         required
//         disabled={categoriesLoading}
//       >
//         <option value="" disabled>
//           -- Choisir --
//         </option>
//         {sortedCategories.map((c) => (
//           <option key={c.id} value={String(c.id)}>
//             {c.name}
//           </option>
//         ))}
//       </select>

//       <button
//         className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2"
//         type="submit"
//         disabled={loading || categoriesLoading}
//       >
//         {loading ? 'Enregistrement...' : 'Enregistrer'}
//       </button>
//     </form>
//   )
// }



import { useEffect, useMemo, useState } from 'react'
import type { ProductPayload, Category, Product } from '../../types'
import { getCategories } from '../../api/categories'

type ProductFormProps = {
  loading?: boolean
  initialValues?: Product | null
  onSubmit?: (payload: ProductPayload) => Promise<void> | void
}

export function ProductForm({ loading = false, initialValues = null, onSubmit }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name))
  }, [categories])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setCategoriesLoading(true)
        setCategoriesError(null)
        const data = await getCategories()
        if (ignore) return
        setCategories(Array.isArray(data) ? data : [])
      } catch {
        if (ignore) return
        setCategoriesError('Impossible de charger les catégories')
      } finally {
        if (!ignore) setCategoriesLoading(false)
      }
    }

    void load()
    return () => { ignore = true }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    await onSubmit?.({
      name: String(formData.get('name') ?? ''),
      // sku: supprimé
      purchase_price: Number(formData.get('purchase_price') ?? 0),
      selling_price: Number(formData.get('selling_price') ?? 0),
      stockQuantity: Number(formData.get('stockQuantity') ?? 0),
      stock_alert: Number(formData.get('stock_alert') ?? 0),
      categoryId: String(formData.get('category_id') ?? ''),
      category_id: String(formData.get('category_id') ?? ''),
      unit: formData.get('unit') ? String(formData.get('unit')) : undefined,
      is_active: formData.get('is_active') ? formData.get('is_active') === 'true' : undefined,
      description: formData.get('description') ? String(formData.get('description')) : undefined,
    } as unknown as ProductPayload)

    event.currentTarget?.reset?.()
  }

  return (
    <form
      key={initialValues?.id ?? 'create'}
      className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2"
      onSubmit={handleSubmit}
    >
      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="name"
        placeholder="Nom"
        required
        defaultValue={initialValues?.name ?? ''}
      />
      {/* <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="sku"
        placeholder="SKU / Référence"
        required
        defaultValue={initialValues?.reference ?? ''}
      /> */}
      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="purchase_price"
        placeholder="Prix d'achat"
        type="number"
        required
        defaultValue={initialValues?.purchasePrice ?? ''}
      />
      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="selling_price"
        placeholder="Prix de vente"
        type="number"
        required
        defaultValue={initialValues?.sellingPrice ?? ''}
      />
      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="stockQuantity"
        placeholder="Stock"
        type="number"
        required
        defaultValue={initialValues?.stockQuantity ?? ''}
      />
      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="stock_alert"
        placeholder="Seuil alerte"
        type="number"
        required
        defaultValue={initialValues?.stockAlert ?? ''}
      />

      <label className="col-span-2 block text-sm font-medium text-slate-700" htmlFor="category-select">
        Catégorie
      </label>
      {categoriesError ? (
        <div className="col-span-2 text-sm text-red-600">{categoriesError}</div>
      ) : null}
      <select
        id="category-select"
        className="col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
        name="category_id"
        required
        disabled={categoriesLoading}
        defaultValue={initialValues?.categoryId ? String(initialValues.categoryId) : ''}
      >
        <option value="" disabled>
          -- Choisir --
        </option>
        {sortedCategories.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2"
        type="submit"
        disabled={loading || categoriesLoading}
      >
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  )
}