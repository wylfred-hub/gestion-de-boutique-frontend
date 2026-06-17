import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'

export type DashboardKpis = {
  chiffre_affaires?: {
    jour?: number
    mois?: number
    annee?: number
  }
  ventes?: {
    jour?: number
    mois?: number
  }
  stock?: {
    valeur_totale?: number
    produits_en_alerte?: number
    produits_rupture?: number
  }
  commandes?: {
    en_attente?: number
    brouillon?: number
  }
}

export async function getDashboardKpis() {
  const { data } = await apiClient.get<DashboardKpis | LaravelApiResponse<DashboardKpis>>('/dashboard/kpis')
  return unwrapApiData(data)
}

