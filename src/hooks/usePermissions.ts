import { useAuthStore } from '../store/authStore'
import type { UserRole } from '../types'

const roleWeight: Record<UserRole, number> = {
  vendeur: 1,
  admin: 2,
  super_admin: 3,
}

export function usePermissions() {
  const role = useAuthStore((state) => state.user?.role)

  function canAccess(requiredRoles: UserRole[]) {
    return Boolean(role && requiredRoles.includes(role))
  }

  function hasMinimumRole(requiredRole: UserRole) {
    return Boolean(role && roleWeight[role] >= roleWeight[requiredRole])
  }

  return { canAccess, hasMinimumRole, role }
}
