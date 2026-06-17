import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { Sale, SalePayload, SaleStatus } from '../types'

export async function getSales() {
  const { data } = await apiClient.get<any | LaravelApiResponse<any>>('/sales')
  const items = unwrapApiData(data) as Sale[]
  const meta = (data as { meta?: { total: number; per_page: number; current_page: number; last_page: number } })
    .meta

  return { items, meta }
}


export async function createSale(payload: SalePayload) {
  // Backend Laravel attend snake_case : client_id, items.*.product_id, items.*.unit_price
  const snakePayload = {
    client_id: payload.clientId,
    items: payload.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
  }

  const { data } = await apiClient.post<Sale | LaravelApiResponse<Sale>>('/sales', snakePayload)
  return unwrapApiData(data)
}


export async function updateSaleStatus(id: string, status: SaleStatus) {
  const { data } = await apiClient.put<Sale | LaravelApiResponse<Sale>>(`/sales/${id}/status`, { status })
  return unwrapApiData(data)
}

export async function updateSale(id: string, payload: SalePayload) {
  const snakePayload = {
    client_id: payload.clientId,
    items: payload.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
  }
  const { data } = await apiClient.put<Sale | LaravelApiResponse<Sale>>(`/sales/${id}`, snakePayload)
  return unwrapApiData(data)
}

export async function deleteSale(id: string) {
  await apiClient.delete(`/sales/${id}`)
}