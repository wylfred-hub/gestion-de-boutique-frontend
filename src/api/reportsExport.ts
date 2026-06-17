import { apiClient } from './client'

export type ReportExportType = 'stock' | 'sales' | 'movements'
export type ReportExportFormat = 'csv' | 'pdf'

export async function exportReport({
  type,
  format,
  filters,
}: {
  type: ReportExportType
  format: ReportExportFormat
  filters?: Record<string, unknown>
}): Promise<{ url: string; filename?: string }> {
  const response = await apiClient.post(
    '/reports/export',
    {
      type,
      format,
      ...(filters ?? {}),
    },
    {
      responseType: 'blob',
    },
  )

  const blob = response.data as Blob
  const cd = response.headers['content-disposition'] as string | undefined

  let filename: string | undefined
  if (cd) {
    const match = cd.match(/filename\*?=(?:UTF-8''|"|')?([^";]+)/i)
    if (match?.[1]) filename = decodeURIComponent(match[1])
  }







  const url = URL.createObjectURL(blob)



  return { url, filename }
}


