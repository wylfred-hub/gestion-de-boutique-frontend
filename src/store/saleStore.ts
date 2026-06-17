// import { create } from 'zustand'
// import type { Sale } from '../types'

// type SaleState = {
//   sales: Sale[]
//   setSales: (sales: Sale[]) => void
//   upsertSale: (sale: Sale) => void
// }

// export const useSaleStore = create<SaleState>((set) => ({
//   sales: [],
//   setSales: (sales) => set({ sales }),
//   upsertSale: (sale) =>
//     set((state) => ({
//       sales: state.sales.some((item) => item.id === sale.id)
//         ? state.sales.map((item) => (item.id === sale.id ? sale : item))
//         : [sale, ...state.sales],
//     })),
// }))


import { create } from 'zustand'
import type { Sale } from '../types'

type SaleState = {
  sales: Sale[]
  setSales: (sales: Sale[]) => void
  upsertSale: (sale: Sale) => void
  removeSale: (id: string) => void
}

export const useSaleStore = create<SaleState>((set) => ({
  sales: [],
  setSales: (sales) => set({ sales }),
  upsertSale: (sale) =>
    set((state) => ({
      sales: state.sales.some((item) => item.id === sale.id)
        ? state.sales.map((item) => (item.id === sale.id ? sale : item))
        : [sale, ...state.sales],
    })),
  removeSale: (id) =>
    set((state) => ({
      sales: state.sales.filter((item) => item.id !== id),
    })),
}))