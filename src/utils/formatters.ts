function toFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return null
  return n
}

export function formatCurrency(value: unknown, currency = 'XAF') {
  const n = toFiniteNumber(value)
  if (n === null) return '-'

  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatNumber(value: unknown) {
  const n = toFiniteNumber(value)
  if (n === null) return '-'

  return new Intl.NumberFormat('fr-CM', {
    maximumFractionDigits: 0,
  }).format(n)
}


export function formatDate(value?: string | null) {
  if (!value) return '-'

  let date: Date

  // Format Laravel: "14/06/2026 08:40" → convertir en ISO
  if (/^\d{2}\/\d{2}\/\d{4}/.test(value)) {
    const [datePart, timePart] = value.split(' ')
    const [day, month, year] = datePart.split('/')
    date = new Date(`${year}-${month}-${day}${timePart ? ' ' + timePart : ''}`)
  } else {
    date = new Date(value)
  }

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('fr-CM', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
