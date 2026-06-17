import { apiClient, unwrapApiData, type LaravelApiResponse } from './client'
import type { Organization, User } from '../types'

export type LoginPayload = {
  email: string
  password: string
}

export type AuthResponse = {
  token: string
  user: User
  organization?: Organization
}

type RawAuthPayload = Partial<AuthResponse> & {
  access_token?: string
  accessToken?: string
  token_type?: string
  tokenType?: string
}

type RawAuthResponse = RawAuthPayload | LaravelApiResponse<RawAuthPayload>

function normalizeAuthResponse(response: RawAuthResponse): AuthResponse {
  const payload = unwrapApiData(response)
  const token = payload.token ?? payload.access_token ?? payload.accessToken

  if (!token || !payload.user) {
    throw new Error('Reponse de connexion invalide')
  }

  return {
    token,
    user: payload.user,
    organization: payload.organization,
  }
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<RawAuthResponse>('/auth/login', payload)
  return normalizeAuthResponse(data)
}

export async function logout() {
  await apiClient.post('/auth/logout')
}
