import type { Product } from '../../types'
import { ProductCard } from '../products/ProductCard'

type StockProductsListProps = {
  products: Product[]
}

export function StockProductsList({ products }: StockProductsListProps) {
  if (products.length === 0) {
    return <p className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucun produit.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

