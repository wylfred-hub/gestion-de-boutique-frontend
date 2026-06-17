type ApiErrorProps = {
  message?: string
}

export function ApiError({ message = 'Une erreur est survenue.' }: ApiErrorProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {message}
    </div>
  )
}
