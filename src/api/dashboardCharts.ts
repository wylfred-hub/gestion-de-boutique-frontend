import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'

export type SalesChartPeriod = 'day' | 'month' | 'year'

export type SalesChartPoint = {
  date?: string
  mois?: string
  nombre: number
  montant: number
}

export async function getSalesChart(period: SalesChartPeriod = 'month') {
  const { data } = await apiClient.get<
    | { success: boolean; period: SalesChartPeriod; data: SalesChartPoint[] }
    | LaravelApiResponse<{ success: boolean; period: SalesChartPeriod; data: SalesChartPoint[] }>
  >('/dashboard/charts/sales', {
    params: { period },
  })

  return unwrapApiData(data)
}

export type CategoryChartItem = {
  id: number
  name: string
  total_quantite: number
  total_montant: number
  nombre_ventes: number
}

export async function getCategoriesChart() {
  const { data } = await apiClient.get<
    | { success: boolean; data: CategoryChartItem[] }
    | LaravelApiResponse<{ success: boolean; data: CategoryChartItem[] }>
  >('/dashboard/charts/categories')

  return unwrapApiData(data)
}

