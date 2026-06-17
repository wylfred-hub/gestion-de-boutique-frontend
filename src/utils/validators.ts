export function isRequired(value: unknown) {
  return value !== undefined && value !== null && String(value).trim().length > 0
}

export function isPositiveNumber(value: number) {
  return Number.isFinite(value) && value > 0
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
