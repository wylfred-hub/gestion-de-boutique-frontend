import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { Category } from '../types'

export type CategoryPayload = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>

export async function getCategories() {
  const { data } = await apiClient.get<
    | LaravelApiResponse<Category[]>
    | {
        data: Category[]
        total?: number
      }
  >('/categories')

  return unwrapApiData(data)
}

export async function createCategory(payload: CategoryPayload) {
  const { data } = await apiClient.post<Category | LaravelApiResponse<Category>>('/categories', payload)
  return unwrapApiData(data)
}

export async function updateCategory(id: string, payload: Partial<CategoryPayload>) {
  const { data } = await apiClient.put<Category | LaravelApiResponse<Category>>(`/categories/${id}`, payload)
  return unwrapApiData(data)
}

export async function deleteCategory(id: string) {
  const { data } = await apiClient.delete<{ message?: string } | LaravelApiResponse<{ message?: string }>>(`/categories/${id}`)
  return unwrapApiData(data)
}

