import { useEffect, useMemo, useState } from 'react'
import { Globe, TrendingUp, Users, Wallet2 } from 'lucide-react'

import { getOrganizations } from '../../api/organizations'
import { getDashboardKpis, type DashboardKpis } from '../../api/dashboard'
import { getApiErrorMessage } from '../../api/client'
import { ApiError } from '../../components/common/ApiError'
import { Loading } from '../../components/common/Loading'

function safeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [kpis, setKpis] = useState<DashboardKpis | null>(null)
  const [organizationsCount, setOrganizationsCount] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const orgs = await getOrganizations()
        const nextOrganizationsCount = Array.isArray(orgs) ? orgs.length : 0

        let dashboard: DashboardKpis | null = null
        try {
          dashboard = await getDashboardKpis()
        } catch (caughtError) {
          // Si les KPIs sont interdits (403), on affiche au moins le reste (organisations).
          console.error('KPIs refused (dashboard/kpis 403?)', caughtError)
        }

        if (!ignore) {
          setOrganizationsCount(nextOrganizationsCount)
          if (dashboard) setKpis(dashboard)
        }


      } catch (caughtError) {
        console.error('SuperAdminDashboardPage load error:', caughtError)
        if (!ignore) {
          // Ne bloque pas la page super-admin si une partie (KPIs/charts) est interdite (403).
          const message = getApiErrorMessage(caughtError, 'Impossible de charger le dashboard super admin.')
          setError(message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    void load()
    return () => {
      ignore = true
    }
  }, [])

  const traffic = useMemo(() => safeNumber(kpis?.ventes?.mois ?? kpis?.ventes?.jour), [kpis])
  const revenue = useMemo(() => safeNumber(kpis?.chiffre_affaires?.mois ?? kpis?.chiffre_affaires?.jour), [kpis])
  const visitors = useMemo(() => 0, [])

  if (loading) return <Loading />
  if (error) return <ApiError message={error} />


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super admin</h1>
        <p className="mt-2 text-sm text-slate-500">Vue multi-organisations : trafic, revenu, visiteurs, etc.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Trafic</p>
            <Globe size={18} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold">{traffic.toLocaleString('fr-FR')}</p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Revenu</p>
            <Wallet2 size={18} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold">{revenue.toLocaleString('fr-FR')}</p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Visiteurs</p>
            <Users size={18} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold">{visitors.toLocaleString('fr-FR')}</p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Organisations</p>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold">{organizationsCount}</p>
        </div>
      </div>
    </div>
  )
}

