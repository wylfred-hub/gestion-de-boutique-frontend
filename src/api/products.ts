import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { Product, ProductPayload } from '../types'

export async function getProducts() {
  const { data } = await apiClient.get<
    | LaravelApiResponse<Product[]>
    | {
        success?: boolean
        data: Product[]
        meta?: { total: number; per_page: number; current_page: number; last_page: number }
      }
  >('/products')

  const items = unwrapApiData(data) as Product[]

  return {
    items,
  }
}



export async function createProduct(payload: ProductPayload) {
  const { data } = await apiClient.post<Product | LaravelApiResponse<Product>>('/products', payload)
  return unwrapApiData(data)
}

export async function updateProduct(id: string, payload: Partial<ProductPayload>) {
  const { data } = await apiClient.put<Product | LaravelApiResponse<Product>>(`/products/${id}`, payload)
  return unwrapApiData(data)
}

export async function deleteProduct(id: string) {
  await apiClient.delete(`/products/${id}`)
}
