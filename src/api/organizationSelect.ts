import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'

export type SelectOrganizationResponse = {
  success?: boolean
  message?: string
}

export async function selectOrganization(organizationId: string) {
  // Backend route: POST /api/v1/organizations/{organization}/select
  const { data } = await apiClient.post<
    SelectOrganizationResponse | LaravelApiResponse<SelectOrganizationResponse>
  >(`/organizations/${organizationId}/select`, {})

  // unwrapApiData only works if backend wraps in {data: ...}
  const hasDataProp = typeof data === 'object' && data !== null && 'data' in data
  return hasDataProp ? unwrapApiData(data as LaravelApiResponse<unknown>) : data
}




