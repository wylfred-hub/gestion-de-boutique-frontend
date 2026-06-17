import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'

export type SalesReport = {
  totalSales: number
  totalRevenue: number
  period: string
}

export type StockReport = {
  totalProducts: number
  lowStockProducts: number
  stockValue: number
}

export type MovementsReport = {
  totalMovements: number
  inMovements: number
  outMovements: number
}

function getDateRangeForPeriod(period: SalesReportPeriod): { date_from?: string; date_to?: string } {
  const now = new Date()


  const pad = (n: number) => String(n).padStart(2, '0')

  // Format attendu backend: YYYY-MM-DD
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (period === 'day') {
    return { date_from: fmt(startOfDay), date_to: fmt(endOfDay) }
  }

  if (period === 'week') {
    // Début semaine (lundi)
    const day = (now.getDay() + 6) % 7 // 0=lundi ... 6=dimanche
    const start = new Date(now)
    start.setDate(now.getDate() - day)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { date_from: fmt(start), date_to: fmt(end) }
  }

  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { date_from: fmt(start), date_to: fmt(end) }
  }

  // year
  const start = new Date(now.getFullYear(), 0, 1)
  const end = new Date(now.getFullYear(), 11, 31)
  return { date_from: fmt(start), date_to: fmt(end) }
}

export type SalesReportPeriod = 'day' | 'week' | 'month' | 'year'

export type SalesResume = {
  totalSales: number
  totalRevenue: number
}

export async function getSalesReport(
  period: SalesReportPeriod = 'month',
  date_from?: string,
  date_to?: string,
) {

  const range = getDateRangeForPeriod(period)

  const params = {
    ...(range ?? {}),
    ...(date_from ? { date_from } : {}),
    ...(date_to ? { date_to } : {}),
  }

  const { data } = await apiClient.get<{
    success: boolean
    resume?: {
      total_ventes?: number
      total_ca?: number
      moyenne_panier?: number
      total_livrees?: number
      total_annulees?: number
    }
  }>("/reports/sales", {
    params,
  })



  // Consommer le résumé renvoyé par le backend (pas `data` qui est la liste)
  const payload = data
  const resume = payload.resume

  return {
    totalSales: Number(resume?.total_ventes) || 0,
    totalRevenue: Number(resume?.total_ca) || 0,
    period,
  }
}





export async function getStockReport() {
  const { data } = await apiClient.get<StockReport | LaravelApiResponse<StockReport>>('/reports/stock')
  return unwrapApiData(data)
}

export async function getMovementsReport() {
  const { data } = await apiClient.get<MovementsReport | LaravelApiResponse<MovementsReport>>('/reports/movements')
  return unwrapApiData(data)
}

