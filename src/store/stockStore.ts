import { create } from 'zustand'
import type { StockMovement } from '../types'

type StockState = {
  movements: StockMovement[]
  setMovements: (movements: StockMovement[]) => void
  addMovement: (movement: StockMovement) => void
}

export const useStockStore = create<StockState>((set) => ({
  movements: [],
  setMovements: (movements) => set({ movements }),
  addMovement: (movement) => set((state) => ({ movements: [movement, ...state.movements] })),
}))
