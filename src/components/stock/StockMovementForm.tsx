import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../../api/products'
import type { Product, StockMovementPayload } from '../../types'

type StockMovementFormProps = {
  loading?: boolean
  onSubmit?: (payload: StockMovementPayload) => Promise<void> | void
}

export function StockMovementForm({ loading = false, onSubmit }: StockMovementFormProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setProductsLoading(true)
        const res = await getProducts()
        if (!ignore) setProducts(res.items)

      } finally {
        if (!ignore) setProductsLoading(false)
      }
    }

    void load()

    return () => {
      ignore = true
    }
  }, [])

  const options = useMemo(() => {
    return products
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
      .map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }))
  }, [products])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const reason = String(formData.get('reason') ?? '').trim()

    // Evite productId = '' (risque d'envoi d'un undefined côté backend)
    const productId = String(formData.get('productId') ?? '').trim()

    await onSubmit?.({
      productId,
      type: String(formData.get('type') ?? 'in') as StockMovementPayload['type'],
      quantity: Number(formData.get('quantity') ?? 0),
      reason: reason || undefined,
    } as StockMovementPayload)

    // Le crash côté front vient du reset() sur currentTarget nul (ou event resserré par React)
    event.currentTarget?.reset?.()
  }


  return (
    <form className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-4" onSubmit={handleSubmit}>
      <select
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="productId"
        required
        disabled={productsLoading}
      >
        <option value="" disabled>
          {productsLoading ? 'Chargement produits...' : 'Choisir un produit'}
        </option>
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>

      <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" name="type">
        <option value="in">Entrée</option>
        <option value="out">Sortie</option>
      </select>

      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        name="quantity"
        placeholder="Quantite"
        type="number"
        min={1}
        step={1}
        required
      />



      <button
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-4"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Ajout...' : 'Ajouter mouvement'}
      </button>
    </form>
  )
}

