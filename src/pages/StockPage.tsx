import { useEffect, useState } from 'react'
import { createStockMovement, getStockMovements } from '../api/stock'
import { ApiError } from '../components/common/ApiError'

import { Loading } from '../components/common/Loading'
import { StockHistoryTable } from '../components/stock/StockHistoryTable'
import { StockMovementForm } from '../components/stock/StockMovementForm'
import { useStockStore } from '../store/stockStore'


import { StockProductsList } from '../components/stock/StockProductsList'
import { useProductStore } from '../store/productStore'
import type { StockMovementPayload } from '../types'



export function StockPage() {
  const movements = useStockStore((state) => state.movements)
  const setMovements = useStockStore((state) => state.setMovements)
  const addMovement = useStockStore((state) => state.addMovement)

  const products = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)


  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    let ignore = false

    async function loadMovements() {
      try {
        setLoading(true)
        setError(null)
        const { items } = await getStockMovements()

        if (!ignore) {
          setMovements(items)
        }

      } catch {
        if (!ignore) {
          setError("Impossible de charger l'historique du stock.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadMovements()

    return () => {
      ignore = true
    }
  }, [setMovements])

  async function handleCreateMovement(payload: StockMovementPayload) {
    try {
      setSaving(true)
      setError(null)

      const movement = await createStockMovement(payload)

      // Historique (optimiste)
      addMovement(movement)

      // Mettre à jour la quantité du produit directement (évite un rechargement complet)
      const movementProduct = (movement as { product?: { id: string | number; stock_quantity?: number; stock_alert?: number } })
        ?.product

      if (movementProduct?.id !== undefined) {

        const nextProducts = products.map((p) => {
          if (String(p.id) !== String(movementProduct.id)) return p

          return {
            ...p,
            stockQuantity: Number(movementProduct.stock_quantity ?? p.stockQuantity),
            alertThreshold: Number(movementProduct.stock_alert ?? p.alertThreshold),
          }
        })
        setProducts(nextProducts)
      }




      // Synchroniser l’historique (source of truth)
      const { items: updatedMovements } = await getStockMovements()
      setMovements(updatedMovements)

    } catch (e) {
      // Message backend (validation/stock insuffisant/auth)
      setError(e instanceof Error ? e.message : "Impossible d'ajouter le mouvement de stock.")
    } finally {
      setSaving(false)
    }
  }




  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stock</h1>
        <p className="text-sm text-slate-500">Mouvements et quantité en stock par produit.</p>
      </div>

      {error ? <ApiError message={error} /> : null}

      <StockMovementForm loading={saving} onSubmit={handleCreateMovement} />

      {loading ? <Loading /> : <StockHistoryTable movements={movements} />}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Quantité en stock</h2>
        <StockProductsList products={products} />
      </div>
    </div>
  )

}

