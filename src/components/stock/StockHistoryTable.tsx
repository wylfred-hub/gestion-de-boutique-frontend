import type { StockMovement } from '../../types'
import { formatDate } from '../../utils/formatters'

function formatStockMovementDate(movement: StockMovement) {
  // Backend renvoie souvent created_at (snake_case)
  const raw = (movement as unknown as { created_at?: string }).created_at ?? movement.createdAt
  return formatDate(raw)
}


type StockHistoryTableProps = {
  movements: StockMovement[]
}


export function StockHistoryTable({ movements }: StockHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-4 py-3">Produit</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Quantite</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr className="border-t border-slate-100" key={movement.id}>
            <td className="px-4 py-3">{movement.product?.name ?? movement.productId}</td>
            <td className="px-4 py-3">
              {movement.type === 'in'
                ? 'Entrée'
                : movement.type === 'out'
                  ? 'Sortie'
                  : 'Ajustement'}
            </td>
            <td className="px-4 py-3">
              {movement.type === 'out' ? -movement.quantity : movement.quantity}

            </td>

            <td className="px-4 py-3">{formatStockMovementDate(movement)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
