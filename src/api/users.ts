import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { User } from '../types'

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role: UserRole
}

export type UserRole = 'vendeur' | 'admin' | 'super_admin'

export async function searchUsers(search: string, opts?: { perPage?: number }) {
  const { data } = await apiClient.get<User[] | LaravelApiResponse<User[]>>('/users', {
    params: {
      search,
      per_page: opts?.perPage ?? 15,
    },
  })

  return unwrapApiData(data)
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await apiClient.post<User | LaravelApiResponse<User>>('/users', payload)
  return unwrapApiData(data)
}


