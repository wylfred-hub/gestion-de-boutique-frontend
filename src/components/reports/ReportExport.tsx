import { Download } from 'lucide-react'

type ReportExportFormat = 'csv' | 'pdf'

type ReportExportProps = {
  onExport?: (format: ReportExportFormat) => void
}

export function ReportExport({ onExport }: ReportExportProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        type="button"
        onClick={() => onExport?.('csv')}
      >
        <Download size={16} />
        Export CSV
      </button>
      <button
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        type="button"
        onClick={() => onExport?.('pdf')}
      >
        <Download size={16} />
        Export PDF
      </button>
    </div>
  )
}

