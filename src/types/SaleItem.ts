import type { Product } from './Product'

export type SaleItem = {
  id: string
  saleId: string
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
  total: number

  // backend Laravel (noms alternatifs)
  unit_price?: number
  total_price?: number
}

// (Compat) items renvoyés par le backend peuvent être en snake_case.
export type SaleItemFromApi = Omit<SaleItem, 'saleId' | 'productId' | 'total'> & {
  sale_id?: string
  product_id?: string
  total_price?: number
}



export type SaleItemPayload = {
  productId: string
  quantity: number
  unitPrice: number
}
