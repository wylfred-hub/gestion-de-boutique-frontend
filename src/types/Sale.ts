import type { Product } from './Product'
import type { Client } from './Client'
import type { User } from './User'

export type SaleStatus = 'encours' | 'confirmee' | 'annulee'



export type SaleItem = {
  id: string
  saleId: string
  productId: string
  quantity: number
  unitPrice: number
  discountType: 'fixe' | 'pourcentage' | null
  discountValue: number
  totalPrice: number
  createdAt?: string
  updatedAt?: string
  product?: Product
}

export type SalePayload = {
  clientId: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
  discountType: 'fixe' | 'pourcentage' | null
  discountValue: number
  notes: string | null
}

export type Sale = {
  id: string
  organizationId: string
  clientId: string | null
  userId: string

  // Backend fields
  saleNumber: string

  // Alias attendus côté UI
  reference?: string | null
  sale_number?: string | null

  status: SaleStatus
  discountType: 'fixe' | 'pourcentage' | null
  discountValue: number

  subtotal: number
  totalAmount: number
  // Alias UI
  total?: number
  total_amount?: number

  notes: string | null
  deliveredAt: string | null

  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null

  client?: Client
  user?: User

  items?: SaleItem[]
}

