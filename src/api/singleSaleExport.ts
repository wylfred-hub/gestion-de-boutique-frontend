import { apiClient } from './client'

export type SingleSaleExportFormat = 'csv' | 'pdf'

export async function exportSingleSale({
  saleId,
  format,
}: {
  saleId: string | number
  format: SingleSaleExportFormat
}): Promise<{ url: string; filename?: string }> {
  const response = await apiClient.post(
    `/reports/sales/${saleId}/export`,
    { format },
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
