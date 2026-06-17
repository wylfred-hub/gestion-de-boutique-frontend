import type { Product } from '../../types'

type StockAlertBadgeProps = {
  product: Product
}

export function StockAlertBadge({ product }: StockAlertBadgeProps) {
  const isLow = product.stockQuantity <= product.alertThreshold

  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold ${isLow ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
      {isLow ? 'Stock bas' : 'Stock OK'}
    </span>
  )
}
