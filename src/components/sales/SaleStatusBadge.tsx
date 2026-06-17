import type { SaleStatus } from '../../types'
import { SALE_STATUS_LABELS } from '../../utils/constants'

type SaleStatusBadgeProps = {
  status: SaleStatus
}

const colors: Record<SaleStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  confirmed: 'bg-blue-50 text-blue-700',
  paid: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
}

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  return <span className={`rounded px-2 py-1 text-xs font-semibold ${colors[status]}`}>{SALE_STATUS_LABELS[status]}</span>
}
