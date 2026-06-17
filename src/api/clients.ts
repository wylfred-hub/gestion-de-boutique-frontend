import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { Client } from '../types'

export type ClientPayload = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>

export async function getClients() {
  const { data } = await apiClient.get<
    LaravelApiResponse<{ data: Client[] }> | { data: Client[]; meta?: { total: number; per_page: number; current_page: number; last_page: number } }
  >('/clients')
  const items = (unwrapApiData(data as unknown as { data: Client[] }) as Client[])

  const meta = (data as { meta?: { total: number; per_page: number; current_page: number; last_page: number } })
    .meta

  return { items, meta }
}


export async function createClient(payload: ClientPayload) {
  const { data } = await apiClient.post<Client | LaravelApiResponse<Client>>('/clients', payload)
  return unwrapApiData(data)
}
