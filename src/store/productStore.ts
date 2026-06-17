import { create } from 'zustand'
import type { Product } from '../types'

type ProductState = {
  products: Product[]
  setProducts: (products: Product[]) => void
  upsertProduct: (product: Product) => void
  removeProduct: (id: string) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  upsertProduct: (product) =>
    set((state) => ({
      products: state.products.some((item) => item.id === product.id)
        ? state.products.map((item) => (item.id === product.id ? product : item))
        : [product, ...state.products],
    })),
  removeProduct: (id) => set((state) => ({ products: state.products.filter((product) => product.id !== id) })),
}))
