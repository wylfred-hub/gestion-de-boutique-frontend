import { formatCurrency } from '../../utils/formatters'

type StockReportProps = {
  totalProducts: number
  lowStockProducts: number
  stockValue: number
}

export function StockReport({ totalProducts, lowStockProducts, stockValue }: StockReportProps) {
  const safeTotalProducts = Number(totalProducts) || 0
  const safeLowStockProducts = Number(lowStockProducts) || 0

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <h3 className="mb-4 font-semibold">Stock</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <p className="rounded-md bg-slate-50 p-3 text-sm">Produits: {safeTotalProducts}</p>
        <p className="rounded-md bg-slate-50 p-3 text-sm">Alertes: {safeLowStockProducts}</p>
        <p className="rounded-md bg-slate-50 p-3 text-sm">Valeur: {formatCurrency(Number(stockValue))}</p>
      </div>
    </section>
  )
}

