import { apiClient } from './client'

export async function getOrganizationMembers(orgId: string) {
  const response = await apiClient.get(`/organizations/${orgId}/members`)
  // Le contrôleur Laravel retourne UserResource::collection, donc les données sont dans .data
  return response.data.data ?? response.data
}

export async function addOrganizationMember(orgId: string, payload: { user_id: string; role: string }) {
  const response = await apiClient.post(`/organizations/${orgId}/members`, payload)
  return response.data
}

export async function removeOrganizationMember(orgId: string, userId: string) {
  const response = await apiClient.delete(`/organizations/${orgId}/members/${userId}`)
  return response.data
}

/**
 * Crée un nouvel utilisateur et l'associe immédiatement à l'organisation
 */
export async function createOrganizationMember(orgId: string, payload: any) {
  const response = await apiClient.post(`/organizations/${orgId}/members/create`, payload)
  return response.data
}