// import type { Product } from '../../types'
// import { formatCurrency } from '../../utils/formatters'
// import { StockAlertBadge } from '../stock/StockAlertBadge'

// type ProductCardProps = {
//   product: Product
// }

// export function ProductCard({ product }: ProductCardProps) {
//   return (
//     <article className="rounded-md border border-slate-200 bg-white p-4">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <h3 className="font-semibold text-slate-950">{product.name}</h3>
//           <p className="text-xs text-slate-500">{product.sku}</p>
//         </div>
//         <StockAlertBadge product={product} />
//       </div>
//       <div className="mt-4 flex items-center justify-between text-sm">
//         <span className="text-slate-500">Stock: {product.stockQuantity}</span>
//         <strong>{Number.isFinite(Number(product.price)) ? formatCurrency(Number(product.price)) : '—'}</strong>
//       </div>
//     </article>
//   )
// }

import type { Product } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import { StockAlertBadge } from '../stock/StockAlertBadge'
import { Pencil, Trash2 } from 'lucide-react'

type ProductCardProps = {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{product.name}</h3>
          <p className="text-xs text-slate-500">{product.sku}</p>
        </div>
        <StockAlertBadge product={product} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">Stock: {product.stockQuantity}</span>
        <strong>{Number.isFinite(Number(product.price)) ? formatCurrency(Number(product.price)) : '—'}</strong>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onEdit?.(product)}
          className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Pencil size={13} />
          Modifier
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(product)}
          className="flex items-center gap-1 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
        >
          <Trash2 size={13} />
          Supprimer
        </button>
      </div>
    </article>
  )
}