import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'

export type SalesDateRange = {
  dateFrom: string
  dateTo: string
}

type Props = {
  value?: SalesDateRange
  onApply: (range: SalesDateRange) => void
}

export function SalesDateRangePicker({
  value,
  onApply,
}: Props) {
  const initial = useMemo(() => {
    return {
      dateFrom: value?.dateFrom ?? '',
      dateTo: value?.dateTo ?? '',
    }
  }, [value?.dateFrom, value?.dateTo])

  const [dateFrom, setDateFrom] = useState(initial.dateFrom)
  const [dateTo, setDateTo] = useState(initial.dateTo)

  function apply() {
    onApply({ dateFrom, dateTo })
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Date début
        </label>
        <div className="relative">
          <CalendarDays size={14} className="pointer-events-none absolute left-2 top-1.5 text-slate-400" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-[170px] rounded-md border border-slate-200 bg-white pl-8 pr-2 text-sm text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Date fin
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 w-[170px] rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900"
        />
      </div>

      <button
        type="button"
        onClick={apply}
        className="h-9 rounded-md bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Appliquer
      </button>
    </div>
  )
}

