import type { SaleStatus, UserRole } from '../types'

export const API_ENDPOINTS = {
  auth: '/auth',
  categories: '/categories',
  clients: '/clients',
  products: '/products',
  reports: '/reports',
  sales: '/sales',
  stock: '/stock',
} as const

export const ROLES: Record<Uppercase<UserRole>, UserRole> = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  VENDEUR: 'vendeur',
}

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  encours: 'Encours',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
}

