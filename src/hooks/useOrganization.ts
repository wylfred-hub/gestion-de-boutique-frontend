import { useAuthStore } from '../store/authStore'
import { useOrganizationStore } from '../store/organizationStore'

export function useOrganization() {
  const authOrganization = useAuthStore((state) => state.organization)
  const activeOrganization = useOrganizationStore((state) => state.activeOrganization)
  const setActiveOrganization = useOrganizationStore((state) => state.setActiveOrganization)
  const hydrated = useOrganizationStore((s) => s.hydrated)

  return {
    organization: activeOrganization ?? authOrganization,
    setActiveOrganization,
    hydrated,
  }
}

