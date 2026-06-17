import { useEffect, useState } from 'react'
import {
  getSalesReport,
  getStockReport,
  getMovementsReport,
  type SalesReport as SalesReportData,
  type StockReport as StockReportData,
  type MovementsReport as MovementsReportData,
  type SalesReportPeriod,
} from '../api/reports'

import { exportReport, type ReportExportFormat, type ReportExportType } from '../api/reportsExport'

import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import { ReportExport } from '../components/reports/ReportExport'
import { SalesReport } from '../components/reports/SalesReport'
import { StockReport } from '../components/reports/StockReport'
import { MovementsReport } from '../components/reports/MovementsReport'
import { SalesDateRangePicker } from '../components/reports/SalesDateRangePicker'

export function ReportsPage() {
  const [salesReport, setSalesReport] = useState<SalesReportData | null>(null)
  const [stockReport, setStockReport] = useState<StockReportData | null>(null)
  const [movementsReport, setMovementsReport] = useState<MovementsReportData | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [salesPeriod, setSalesPeriod] = useState<SalesReportPeriod>('month')
  const [salesDateFrom, setSalesDateFrom] = useState<string>('')
  const [salesDateTo, setSalesDateTo] = useState<string>('')

  useEffect(() => {

    let ignore = false

    async function loadReports({ silent }: { silent?: boolean } = {}) {
      try {
        if (!silent) {
          setLoading(true)
        }
        setError(null)

        const [sales, stock, movements] = await Promise.all([
          getSalesReport(salesPeriod, salesDateFrom, salesDateTo),

          getStockReport(),
          getMovementsReport(),
        ])

        if (!ignore) {
          setSalesReport(sales)
          setStockReport(stock)
          setMovementsReport(movements)
        }
      } catch {
        // if (!ignore) {
        //   setError('Impossible de charger les rapports.')
        // }
      } finally {
        if (!ignore && !silent) {
          setLoading(false)
        }
      }
    }

    void loadReports()

    return () => {
      ignore = true
    }

  }, [salesPeriod, salesDateFrom, salesDateTo])


  async function handleExport(format: ReportExportFormat) {
    try {
      setError(null)

      // Pour l'instant, l'UI exporte uniquement les ventes (type='sales').
      // Les filtres peuvent être ajoutés ensuite.
      const type: ReportExportType = 'sales'

      const { url, filename } = await exportReport({
        type,
        format,
      })

      const link = document.createElement('a')
      link.href = url
      link.download = filename ?? `reports_${type}.${format}`
      link.click()

      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch {
      // setError("Impossible d'exporter le rapport.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-sm text-slate-500">Synthese commerciale et inventaire.</p>
        </div>

        <ReportExport onExport={handleExport} />
      </div>
      {error ? <ApiError message={error} /> : null}
      {loading ? <Loading /> : null}
      {salesReport ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SalesReport
              totalSales={salesReport.totalSales}
              totalRevenue={salesReport.totalRevenue}
              period={salesPeriod}
              onPeriodChange={setSalesPeriod}
            />
          </div>

          <SalesDateRangePicker
            value={{ dateFrom: salesDateFrom, dateTo: salesDateTo }}
            onApply={({ dateFrom, dateTo }) => {
              setSalesDateFrom(dateFrom)
              setSalesDateTo(dateTo)
              // on relance un fetch via le polling (interval) ou à l’interval suivant
              // (on peut aussi relancer immédiatement en appelant loadReports, mais c’est suffisant)
            }}
          />
        </div>
      ) : null}




      {stockReport ? (
        <StockReport
          totalProducts={stockReport.totalProducts}
          lowStockProducts={stockReport.lowStockProducts}
          stockValue={stockReport.stockValue}
        />
      ) : null}

      {movementsReport ? <MovementsReport report={movementsReport} /> : null}
    </div>
  )
}
