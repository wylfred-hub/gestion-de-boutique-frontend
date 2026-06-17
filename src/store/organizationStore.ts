// import { create } from 'zustand'
// import type { Organization } from '../types'

// type OrganizationState = {
//   activeOrganization: Organization | null
//   /**
//    * Evite les redirections au refresh tant que le store n'a pas fini d'être hydraté.
//    * Persist est géré via authStore (projet-auth). Ici on garde le flag pour être sûr.
//    */
//   hydrated: boolean
//   setActiveOrganization: (organization: Organization | null) => void
//   setHydrated: (value: boolean) => void
// }

// export const useOrganizationStore = create<OrganizationState>((set) => ({
//   activeOrganization: null,
//   hydrated: false,
//   setActiveOrganization: (organization) => set({ activeOrganization: organization }),
//   setHydrated: (value) => set({ hydrated: value }),
// }))

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Organization } from '../types'

type OrganizationState = {
  activeOrganization: Organization | null
  hydrated: boolean
  setActiveOrganization: (organization: Organization | null) => void
  setHydrated: (value: boolean) => void
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      activeOrganization: null,
      hydrated: false,
      setActiveOrganization: (organization) => set({ activeOrganization: organization }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'proget-org',
      onRehydrateStorage: () => (state) => {
        // Marque comme hydraté dès que le localStorage est lu
        state?.setHydrated(true)
      },
    },
  ),
)