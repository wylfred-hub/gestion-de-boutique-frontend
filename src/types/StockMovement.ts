import type { Product } from './Product'
import type { User } from './User'

export type StockMovementType = 'in' | 'out' | 'adjustment'

export type StockMovement = {
  id: string
  productId: string
  product?: Product
  type: StockMovementType
  quantity: number
  reason?: string
  userId: string
  user?: User
  organizationId: string
  createdAt?: string
}

export type StockMovementPayload = {
  productId: string
  type: StockMovementType
  quantity: number
  reason?: string
}
