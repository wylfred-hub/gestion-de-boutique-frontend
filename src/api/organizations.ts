import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { Organization } from '../types'

export type OrganizationPayload = Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>

export async function getOrganizations() {
  const { data } = await apiClient.get<Organization[] | LaravelApiResponse<Organization[]>>('/organizations')
  return unwrapApiData(data)
}

export async function createOrganization(payload: OrganizationPayload) {
  const { data } = await apiClient.post<Organization | LaravelApiResponse<Organization>>('/organizations', payload)
  return unwrapApiData(data)
}

export async function updateOrganization(id: string, payload: Partial<OrganizationPayload>) {
  const { data } = await apiClient.put<Organization | LaravelApiResponse<Organization>>(`/organizations/${id}`, payload)
  return unwrapApiData(data)
}

export async function deleteOrganization(id: string) {
  await apiClient.delete(`/organizations/${id}`)
}
