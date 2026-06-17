import { useCallback, useState } from 'react'

export function useApi<TData, TArgs extends unknown[]>(request: (...args: TArgs) => Promise<TData>) {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(
    async (...args: TArgs) => {
      setLoading(true)
      setError(null)

      try {
        const response = await request(...args)
        setData(response)
        return response
      } catch (caughtError) {
        const normalizedError = caughtError instanceof Error ? caughtError : new Error('Erreur API')
        setError(normalizedError)
        throw normalizedError
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  return { data, error, loading, execute }
}
