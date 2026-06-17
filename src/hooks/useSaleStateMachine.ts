import type { SaleStatus } from '../types'

const transitions: Record<SaleStatus, SaleStatus[]> = {
  draft: ['confirmed', 'cancelled'],
  confirmed: ['paid', 'cancelled'],
  paid: [],
  cancelled: [],
}

export function useSaleStateMachine(status: SaleStatus) {
  const nextStatuses = transitions[status] ?? []

  return {
    canTransitionTo: (nextStatus: SaleStatus) => nextStatuses.includes(nextStatus),
    nextStatuses,
  }
}

