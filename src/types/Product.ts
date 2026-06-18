import type { Category } from './Category'

export type ProductPayload = {
  categoryId: string
  name: string
  reference: string | null
  description: string | null
  purchasePrice: number
  sellingPrice: number
  unit: string
  barcode: string | null
  image: string | null
  stockAlert: number
  isActive: boolean
}

export type Product = {

  id: string
  organizationId: string
  categoryId: string

  name: string
  reference: string | null
  description: string | null

  // Backend naming (purchasePrice/sellingPrice). Le front utilise aussi parfois price/ costPrice.
  purchasePrice: number
  sellingPrice: number
  unit: string

  // Alias attendus par l’UI (pour coller aux champs déjà utilisés dans les composants/pages)
  sku?: string | null
  price?: number
  costPrice?: number


  barcode: string | null
  image: string | null

  // Stocks backend
  stockQuantity: number
  stockAlert: number

  // Alias UI
  alertThreshold?: number


  isActive: boolean

  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  category?: Category
}
