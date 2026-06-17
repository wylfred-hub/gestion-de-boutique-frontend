// import { useEffect } from 'react'
// import { Navigate } from 'react-router-dom'
// import type { ReactNode } from 'react'

// import { useAuthStore } from '../../store/authStore'
// import { useOrganizationStore } from '../../store/organizationStore'

// export function OrganizationSelectedGuard({ children }: { children: ReactNode }) {
//   const user = useAuthStore((s) => s.user)
//   const token = useAuthStore((s) => s.token)
//   const authOrganization = useAuthStore((s) => s.organization)

//   const activeOrganization = useOrganizationStore((s) => s.activeOrganization)
//   const hydrated = useOrganizationStore((s) => s.hydrated)
//   const setActiveOrganization = useOrganizationStore((s) => s.setActiveOrganization)
//   const setHydrated = useOrganizationStore((s) => s.setHydrated)


//   // Synchronise organizationStore depuis authStore (persisté) au refresh
//   useEffect(() => {
//     if (!hydrated) {
//       if (authOrganization) {
//         setActiveOrganization(authOrganization)
//       }
//       setHydrated(true)
//     }
//   }, [hydrated, authOrganization, setActiveOrganization, setHydrated])

//   // Si non connecté, on laisse PrivateRoute gérer
//   if (!user || !token) return children

//   const role = (user.role ?? '').toString().trim().toLowerCase()


//   // Le super_admin passe toujours
//   if (role === 'super_admin') return children

//   // Attendre la fin de l'hydratation avant de décider
//   if (!hydrated) return children

//   // Rediriger si aucune organisation sélectionnée
//   if (!activeOrganization?.id) {
//     return <Navigate to="/organization-select" replace />
//   }

//   return children
// }

import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuthStore } from '../../store/authStore'
import { useOrganizationStore } from '../../store/organizationStore'

export function OrganizationSelectedGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)

  const activeOrganization = useOrganizationStore((s) => s.activeOrganization)
  const hydrated = useOrganizationStore((s) => s.hydrated)

  // Si non connecté, on laisse PrivateRoute gérer
  if (!user || !token) return children

  const role = (user.role ?? '').toString().trim().toLowerCase()

  // Le super_admin passe toujours sans organisation
  if (role === 'super_admin') return children

  // Attendre que le store soit hydraté depuis localStorage avant de décider
  if (!hydrated) return children

  // Rediriger si aucune organisation sélectionnée
  if (!activeOrganization?.id) {
    return <Navigate to="/organization-select" replace />
  }

  return children
}