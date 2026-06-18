import type { Sale, SaleStatus } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import { SaleItemTable } from './SaleItemTable'
import { SaleStateActions } from './SaleStateActions'
import { SaleStatusBadge } from './SaleStatusBadge'
import { exportSingleSale, type SingleSaleExportFormat } from '../../api/singleSaleExport'
import { Download, Pencil, Trash2 } from 'lucide-react'

type SaleDetailProps = {
  sale: Sale
  onStatusChange?: (status: SaleStatus) => void
  onEdit?: (sale: Sale) => void
  onDelete?: (sale: Sale) => void
}

export function SaleDetail({ sale, onStatusChange, onEdit, onDelete }: SaleDetailProps) {
  const isEncours = sale.status === 'encours'

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{sale.reference ?? sale.sale_number ?? '—'}</h3>
          <p className="text-sm text-slate-500">{sale.client?.name ?? 'Client comptoir'}</p>
        </div>
        <div className="flex items-center gap-2">
          <SaleStatusBadge status={sale.status} />
          {isEncours && (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(sale)}
                className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={13} />
                Modifier
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(sale)}
                className="flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={13} />
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>

      <SaleItemTable items={sale.items} />

      <div className="mt-4 flex items-center justify-between gap-4">
        <SaleStateActions status={sale.status} onChange={onStatusChange} />
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={async () => {
              const format: SingleSaleExportFormat = 'csv'
              const { url, filename } = await exportSingleSale({ saleId: sale.id, format })
              const link = document.createElement('a')
              link.href = url
              link.download = filename ?? `vente_${sale.saleNumber ?? sale.id}.${format}`
              link.click()
              setTimeout(() => URL.revokeObjectURL(url), 10_000)
            }}
          >
            <Download size={16} />
            CSV
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={async () => {
              const format: SingleSaleExportFormat = 'pdf'
              const { url, filename } = await exportSingleSale({ saleId: sale.id, format })
              const link = document.createElement('a')
              link.href = url
              link.download = filename ?? `vente_${sale.saleNumber ?? sale.id}.${format}`
              link.click()
              setTimeout(() => URL.revokeObjectURL(url), 10_000)
            }}
          >
            <Download size={16} />
            PDF
          </button>
          <strong>{formatCurrency(sale.total)}</strong>
        </div>
      </div>
    </article>
  )
}

