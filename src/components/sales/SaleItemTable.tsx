import type { SaleItem } from '../../types'
import { formatCurrency } from '../../utils/formatters'

type SaleItemTableProps = {
  items?: SaleItem[]
}

export function SaleItemTable({ items = [] }: SaleItemTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-slate-500">
        <tr>
          <th className="py-2">Produit</th>
          <th className="py-2">Qt.</th>
          <th className="py-2">PU</th>
          <th className="py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr className="border-t border-slate-100" key={item.id}>
            <td className="py-2">{item.product?.name ?? (item.productId ?? '—')}</td>
            <td className="py-2">{item.quantity ?? '—'}</td>
            <td className="py-2">{formatCurrency((item.unitPrice ?? item.unit_price ?? 0) as number)}</td>
            <td className="py-2">{formatCurrency((item.total ?? item.total_price ?? 0) as number)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
