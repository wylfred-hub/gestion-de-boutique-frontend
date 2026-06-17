import { formatCurrency } from '../../utils/formatters'
import type { SalesReportPeriod } from '../../api/reports'
import { useMemo } from 'react'

type SalesReportProps = {
  totalSales: number
  totalRevenue: number
  period?: SalesReportPeriod
  onPeriodChange?: (period: SalesReportPeriod) => void
}


const labels: Record<SalesReportPeriod, string> = {
  day: 'Jour',
  week: 'Semaine',
  month: 'Mois',
  year: 'Année',
}

export function SalesReport({ totalSales, totalRevenue, period = 'month', onPeriodChange }: SalesReportProps) {
  const activeLabel = useMemo(() => labels[period] ?? period, [period])

  const safeTotalSales = Number(totalSales) || 0

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold">Ventes</h3>
        <div className="flex flex-wrap items-center gap-2">
          {(['day', 'week', 'month', 'year'] as SalesReportPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange?.(p)}
              className={
                p === period
                  ? 'rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white'
                  : 'rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50'
              }
            >
              {labels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <p className="rounded-md bg-slate-50 p-3 text-sm">
          Nombre ({activeLabel}): {safeTotalSales}
        </p>
        <p className="rounded-md bg-slate-50 p-3 text-sm">
          Chiffre ({activeLabel}): {formatCurrency(Number(totalRevenue))}
        </p>
      </div>
    </section>
  )
}


