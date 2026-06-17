import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { StockMovement, StockMovementPayload } from '../types'

export async function getStockMovements() {
  const { data } = await apiClient.get<any | LaravelApiResponse<any>>('/stock/movements')
  const items = unwrapApiData(data) as StockMovement[]
  const meta = (data as { meta?: { total: number; per_page: number; current_page: number; last_page: number } })
    .meta

  return { items, meta }
}


export async function createStockMovement(payload: StockMovementPayload) {
  const endpointByType: Record<StockMovementPayload['type'], string> = {
    in: '/stock/entry',
    adjustment: '/stock/adjustment',
    out: '/stock/loss',
  }

  // Laravel utilise très souvent les champs snake_case (ex: product_id)
  // Le front envoie productId : on remappe pour éviter un 422.
  const typeMap: Record<StockMovementPayload['type'], string> = {
    in: 'entree',
    out: 'sortie',
    adjustment: 'ajustement',
  }


  const body = {
    product_id: payload.productId,
    type: typeMap[payload.type],
    quantity: payload.quantity,
    ...(payload.reason ? { reason: payload.reason } : {}),
  }


  const { data } = await apiClient.post<StockMovement | LaravelApiResponse<StockMovement>>(endpointByType[payload.type], body)
  return unwrapApiData(data)
}

