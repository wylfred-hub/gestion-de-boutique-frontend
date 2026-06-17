import type { ReactNode } from 'react'
import type { UserRole } from '../../types'
import { usePermissions } from '../../hooks/usePermissions'

type RoleGuardProps = {
  allowedRoles: UserRole[]
  children: ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { canAccess } = usePermissions()

  if (!canAccess(allowedRoles)) {
    return <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">Acces non autorise.</p>
  }

  return children
}
