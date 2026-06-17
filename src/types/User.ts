export type UserRole = 'super_admin' | 'admin' | 'vendeur'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  organizationId: string
  createdAt?: string
  updatedAt?: string
}
