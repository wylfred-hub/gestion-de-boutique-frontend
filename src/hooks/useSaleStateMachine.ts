import type { SaleStatus } from '../types'

const transitions: Record<SaleStatus, SaleStatus[]> = {
  encours: ['confirmee', 'annulee'],
  confirmee: ['annulee'],
  annulee: [],
}


export function useSaleStateMachine(status: SaleStatus) {
  const nextStatuses = transitions[status] ?? []

  return {
    canTransitionTo: (nextStatus: SaleStatus) => nextStatuses.includes(nextStatus),
    nextStatuses,
  }
}

