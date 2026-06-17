// import type { Sale, SaleStatus } from '../../types'
// import { SaleDetail } from './SaleDetail'

// type SaleListProps = {
//   sales: Sale[]
//   onStatusChange?: (saleId: string, status: SaleStatus) => void
// }

// export function SaleList({ sales, onStatusChange }: SaleListProps) {
//   if (sales.length === 0) {
//     return <p className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucune vente.</p>
//   }

//   return (
//     <div className="space-y-4">
//       {sales.map((sale) => (
//         <SaleDetail key={sale.id} sale={sale} onStatusChange={(status) => onStatusChange?.(sale.id, status)} />
//       ))}
//     </div>
//   )
// }


import type { Sale, SaleStatus } from '../../types'
import { SaleDetail } from './SaleDetail'

type SaleListProps = {
  sales: Sale[]
  onStatusChange?: (saleId: string, status: SaleStatus) => void
  onEdit?: (sale: Sale) => void
  onDelete?: (sale: Sale) => void
}

export function SaleList({ sales, onStatusChange, onEdit, onDelete }: SaleListProps) {
  if (sales.length === 0) {
    return <p className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucune vente.</p>
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <SaleDetail
          key={sale.id}
          sale={sale}
          onStatusChange={(status) => onStatusChange?.(sale.id, status)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}