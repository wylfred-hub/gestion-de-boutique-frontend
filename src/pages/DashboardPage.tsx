import { useEffect, useMemo, useState } from 'react'
import { Boxes, Package, ReceiptText, TrendingUp } from 'lucide-react'
import { ApiError } from '../components/common/ApiError'
import { Loading } from '../components/common/Loading'
import { MiniBars } from '../components/dashboard/MiniBars'
import { getCategoriesChart, getSalesChart, type SalesChartPeriod } from '../api/dashboardCharts'
import { getDashboardKpis, type DashboardKpis } from '../api/dashboard'
import { formatCurrency, formatNumber } from '../utils/formatters'



function clampNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

function safeLabel(val: unknown, fallback = '—') {
  if (val === null || val === undefined) return fallback
  return String(val)
}

export function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [salesPeriod, setSalesPeriod] = useState<SalesChartPeriod>('month')
  const [salesChartLoading, setSalesChartLoading] = useState(false)
  const [salesChartError, setSalesChartError] = useState<string | null>(null)
  const [salesChart, setSalesChart] = useState<null | Array<{ nombre: number; montant: number; date?: string; mois?: string }>>(null)

  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesChart, setCategoriesChart] = useState<null | Array<{ label: string; value: number }>>(null)

  useEffect(() => {
    let ignore = false
    const intervalMs = 30000 // Passer de 5s à 30s pour réduire la charge serveur et réseau

    async function loadOnce(silent?: boolean) {
      try {
        if (!silent) setLoading(true)
        setError(null)

        const data = await getDashboardKpis()
        if (!ignore) setKpis(data)
      } catch {
        if (!ignore && !silent) setError('Impossible de charger le tableau de bord.')
      } finally {
        if (!ignore && !silent) setLoading(false)
      }
    }

    void loadOnce()
    const t = window.setInterval(() => {
      void loadOnce(true)
    }, intervalMs)

    return () => {
      ignore = true
      window.clearInterval(t)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadCharts() {
      try {
        setSalesChartLoading(true)
        setSalesChartError(null)

        const chart = await getSalesChart(salesPeriod)
        if (!ignore) setSalesChart(chart.data)
      } catch {
        if (!ignore) setSalesChartError('Impossible de charger le graphique des ventes.')
      } finally {
        if (!ignore) setSalesChartLoading(false)
      }
    }

    void loadCharts()

    return () => {
      ignore = true
    }
  }, [salesPeriod])

  useEffect(() => {
    let ignore = false

    async function loadCategories() {
      try {
        setCategoriesLoading(true)
        const res = await getCategoriesChart()
        if (!ignore) {
          setCategoriesChart(
            res.data
              .slice(0, 8)
              .map((c) => ({ label: c.name, value: clampNumber(c.total_montant) }))
          )
        }
      } catch {
        // not fatal
      } finally {
        if (!ignore) setCategoriesLoading(false)
      }
    }

    void loadCategories()

    return () => {
      ignore = true
    }
  }, [])

  const stats = useMemo(() => {
    const caJour = clampNumber(kpis?.chiffre_affaires?.jour)
    const products = clampNumber(kpis?.stock?.produits_en_alerte)
    const stockValue = clampNumber(kpis?.stock?.valeur_totale)
    const ordersPending = clampNumber(kpis?.commandes?.en_attente)

    return [
      {
        label: 'CA (jour)',
        value: formatCurrency(caJour),
        icon: ReceiptText,
        accent: 'emerald' as const,
      },
      {
        label: 'Ventes (mois)',
        value: formatCurrency(clampNumber(kpis?.ventes?.mois)),

        icon: TrendingUp,
        accent: 'slate' as const,
      },
      {
        label: 'Alertes stock',
        value: formatNumber(products),
        icon: Boxes,
        accent: 'rose' as const,
      },
      {
        label: 'Valeur stock',
        value: formatCurrency(stockValue),
        icon: Package,
        accent: 'slate' as const,
      },
      {
        label: 'Commandes en attente',
        value: formatNumber(ordersPending),
        icon: TrendingUp,
        accent: 'emerald' as const,
      },
    ]
  }, [kpis])

  const salesBars = useMemo(() => {
    if (!salesChart) return null

    const items = salesChart.map((p) => ({
      label: p.mois ?? p.date ?? safeLabel(undefined),
      value: clampNumber(salesPeriod === 'month' || salesPeriod === 'year' ? p.montant : p.montant),
      accent: 'emerald' as const,
    }))

    // compress labels a bit
    const trimmed = items.slice(-10)
    return trimmed
  }, [salesChart, salesPeriod])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-slate-500">Vue rapide des ventes, produits et stocks.</p>
      </div>

      {error ? <ApiError message={error} /> : null}
      {loading ? <Loading /> : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.slice(0, 4).map((stat) => {
          const Icon = stat.icon

          return (
            <article className="rounded-md border border-slate-200 bg-white p-4" key={stat.label}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <Icon size={20} />
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <strong className="mt-1 block text-xl">{stat.value}</strong>
            </article>
          )
        })}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {(['month', 'day', 'year'] as SalesChartPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSalesPeriod(p)}
                className={
                  p === salesPeriod
                    ? 'rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white'
                    : 'rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50'
                }
              >
                {p === 'day' ? 'Jour' : p === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>

          {salesChartError ? <ApiError message={salesChartError} /> : null}

          {salesChartLoading && !salesChart ? <Loading /> : null}
          {salesBars && (
            <MiniBars
              title="Ventes (montant)"
              valueLabel={salesPeriod === 'day' ? 'Derniers jours' : salesPeriod === 'year' ? 'Derniers mois' : 'Derniers 30 jours'}
              items={salesBars}
            />
          )}
        </div>

        <div>
          {categoriesLoading && !categoriesChart ? <Loading /> : null}
          {categoriesChart && (
            <MiniBars title="Top catégories" valueLabel="Montant total (top 8)" items={categoriesChart.map((c) => ({ label: c.label, value: c.value, accent: 'slate' }))} />
          )}
        </div>
      </div>
    </div>
  )
}
