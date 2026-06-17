import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { useOrganizationStore } from '../store/organizationStore'


export type LaravelApiResponse<T> = {
  success?: boolean
  message?: string
  data: T
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

function formatAuthorizationHeader(token: string) {
  return token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`
}

export function unwrapApiData<T>(response: T | LaravelApiResponse<T>) {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as LaravelApiResponse<T>).data
  }

  return response as T
}

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue.') {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback
  }

  if (!error.response) {
    return "Impossible de joindre l'API. Verifie que Laravel est lance et que VITE_API_URL est correct."
  }

  const responseData = error.response.data as {
    message?: string
    errors?: Record<string, string[]>
  }
  const validationErrors = responseData.errors ? Object.values(responseData.errors).flat() : []

  return validationErrors[0] ?? responseData.message ?? fallback
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = formatAuthorizationHeader(token)
  }

  // Multi-tenant : envoyer l'organisation active à l'API
  // (permet à Laravel de filtrer / d'écrire les bonnes données)
  const orgId = useOrganizationStore.getState().activeOrganization?.id

  // console.log('[Axios] activeOrganization:', useOrganizationStore.getState().activeOrganization)
  // console.log('[Axios] X-Organization-ID:', orgId)

  if (orgId) {
    config.headers['X-Organization-ID'] = String(orgId)
  }

  return config
})



apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')

    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout()
    }

    return Promise.reject(error)
  },
)
