import type { SaleStatus } from '../../types'
import { SALE_STATUS_LABELS } from '../../utils/constants'
import { useSaleStateMachine } from '../../hooks/useSaleStateMachine'

type SaleStateActionsProps = {
  status: SaleStatus
  onChange?: (status: SaleStatus) => void
}

export function SaleStateActions({ status, onChange }: SaleStateActionsProps) {
  const { nextStatuses } = useSaleStateMachine(status)

  if (nextStatuses.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.map((nextStatus) => (
        <button
          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          key={nextStatus}
          type="button"
          onClick={() => onChange?.(nextStatus)}
        >
          {SALE_STATUS_LABELS[nextStatus]}
        </button>
      ))}
    </div>
  )
}
