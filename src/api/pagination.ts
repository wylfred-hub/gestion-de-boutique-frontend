import { apiClient, type LaravelApiResponse } from './client'

export type PaginatedMeta = {
  total: number
  per_page: number
  current_page: number
  last_page: number
}

export type PaginatedApiResponse<T> = LaravelApiResponse<T> & {
  meta?: PaginatedMeta
}

export function unwrapPaginated<T>(
  response: {
    data?: T
    meta?: PaginatedMeta
  },
): {
  items: T extends (infer U)[] ? U[] : never
  meta: PaginatedMeta | undefined
} {
  const items = (response.data ?? []) as unknown as T extends (infer U)[] ? U[] : never

  return {
    items,
    meta: response.meta,
  }
}



// Petite utilité pour documenter comment appeler une route paginée.
export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>,
) {
  const { data } = await apiClient.get<PaginatedApiResponse<T>>(url, {
    params,
  })
  return unwrapPaginated<T>(data)
}


