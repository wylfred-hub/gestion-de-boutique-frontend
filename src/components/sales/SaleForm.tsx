import { useEffect, useMemo, useState } from 'react'
import { getClients } from '../../api/clients'
import { getProducts } from '../../api/products'
import type { Sale, SalePayload } from '../../types'

type SaleFormProps = {
  loading?: boolean
  initialValues?: Sale | null
  onSubmit?: (payload: SalePayload) => Promise<void> | void
}

type SaleLine = {
  productId: string
  quantity: number
  unitPrice: number
}

export function SaleForm({ loading = false, initialValues = null, onSubmit }: SaleFormProps) {
  const [clientOptions, setClientOptions] = useState<{ id: string; name: string }[]>([])
  const [productOptions, setProductOptions] = useState<{ id: string; name: string; price: number }[]>([])

  const [clientId, setClientId] = useState<string>(() =>
    initialValues?.clientId ?? ''
  )
  const [lines, setLines] = useState<SaleLine[]>(() => {
    if (initialValues?.items && initialValues.items.length > 0) {
      return initialValues.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))
    }
    return [{ productId: '', quantity: 1, unitPrice: 0 }]
  })

  // Re-sync quand initialValues change (ouverture d'une autre vente)
  useEffect(() => {
    if (initialValues) {
      setClientId(initialValues.clientId ?? '')
      setLines(
        initialValues.items && initialValues.items.length > 0
          ? initialValues.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }))
          : [{ productId: '', quantity: 1, unitPrice: 0 }]
      )
    } else {
      setClientId('')
      setLines([{ productId: '', quantity: 1, unitPrice: 0 }])
    }
  }, [initialValues?.id])

  useEffect(() => {
    let ignore = false

    async function loadFormData() {
      try {
        const [clientsRes, productsRes] = await Promise.all([getClients(), getProducts()])
        if (ignore) return
        const clients = (clientsRes as { items: { id: string; name: string }[] }).items
        const products = (productsRes as { items: { id: string; name: string; price: number }[] }).items
        setClientOptions(clients.map((c) => ({ id: c.id, name: c.name })))
        setProductOptions(products.map((p) => ({ id: p.id, name: p.name, price: p.price })))
      } catch {
        // garde la liste vide
      }
    }

    void loadFormData()
    return () => { ignore = true }
  }, [])

  const productPriceById = useMemo(() => {
    return new Map(productOptions.map((p) => [p.id, p.price]))
  }, [productOptions])

  function addLine() {
    setLines((prev) => [...prev, { productId: '', quantity: 1, unitPrice: 0 }])
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  function updateLine(index: number, patch: Partial<SaleLine>) {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line
        if (patch.productId && patch.productId !== line.productId) {
          return { ...line, ...patch, unitPrice: productPriceById.get(patch.productId) ?? 0 }
        }
        return { ...line, ...patch }
      })
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload: SalePayload = {
      clientId: clientId.trim() ? clientId.trim() : undefined,
      items: lines
        .filter((l) => l.productId)
        .map((l) => ({
          productId: l.productId,
          quantity: Number(l.quantity) || 1,
          unitPrice: Number(l.unitPrice) || 0,
        })),
    }

    await onSubmit?.(payload)

    // Reset uniquement en mode création
    if (!initialValues) {
      setClientId('')
      setLines([{ productId: '', quantity: 1, unitPrice: 0 }])
    }
  }

  return (
    <form className="space-y-4 rounded-md border border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Client (optionnel)</label>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Client comptoir</option>
            {clientOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={addLine}
          >
            + Ajouter produit
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {lines.map((line, index) => (
          <div key={index} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label className="mb-1 block text-xs font-medium text-slate-600">Produit</label>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={line.productId}
                onChange={(e) => updateLine(index, { productId: e.target.value })}
                required
              >
                <option value="">Choisir un produit</option>
                {productOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs font-medium text-slate-600">Quantité</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                type="number"
                min={1}
                step={1}
                value={line.quantity}
                onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs font-medium text-slate-600">Prix unitaire</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                type="number"
                min={0}
                step={0.01}
                value={line.unitPrice}
                onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) })}
                required
              />
            </div>

            <div className="sm:col-span-1 flex items-end">
              <button
                className="w-full rounded-md border border-rose-200 bg-white px-2 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-40"
                type="button"
                onClick={() => removeLine(index)}
                disabled={lines.length <= 1}
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end">
        <button
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : initialValues ? 'Modifier la vente' : 'Créer vente'}
        </button>
      </div>
    </form>
  )
}