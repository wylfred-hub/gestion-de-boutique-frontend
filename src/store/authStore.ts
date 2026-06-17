import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Organization, User } from '../types'
import { useOrganizationStore } from './organizationStore'

type AuthState = {
  token: string | null
  user: User | null
  organization: Organization | null
  isAuthenticated: boolean
  setSession: (token: string, user: User, organization?: Organization) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      organization: null,
      isAuthenticated: false,
      setSession: (token, user, organization) =>
        set({
          token,
          user,
          organization: organization ?? null,
          isAuthenticated: true,
        }),
      logout: () => {
        // Vider le store auth
        set({
          token: null,
          user: null,
          organization: null,
          isAuthenticated: false,
        })
        // Vider le store organisation
        useOrganizationStore.getState().setActiveOrganization(null)
        useOrganizationStore.getState().setHydrated(false)
        localStorage.removeItem('proget-org')
      },
    }),
    { name: 'proget-auth' },
  ),
)
