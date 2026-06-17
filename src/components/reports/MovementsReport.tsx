// Le backend `/reports/movements` renvoie une LISTE de mouvements.
// Le type historique `MovementsReport` (total/in/out) ne correspond donc pas.
// On accepte donc un tableau “any-like” ici, pour afficher les données réelles.


type StockMovementRow = {
  id: number | string
  date?: string
  produit?: string
  reference?: string
  type?: string
  quantity?: number | string
  quantity_before?: number | string
  quantity_after?: number | string
  reason?: string | null
  utilisateur?: string | null
}

type MovementsReportProps = {
  report: unknown
}

function safeNumber(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

export function MovementsReport({ report }: MovementsReportProps) {
  const rows = Array.isArray(report) ? (report as StockMovementRow[]) : []

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3">
        <h3 className="font-semibold">Mouvements (inventaire)</h3>
        <p className="text-xs text-slate-500">Historique des entrées/sorties/ajustements</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Date</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Référence</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Produit</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Type</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Qté</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Avant</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Après</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Utilisateur</th>
              <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-700">Raison</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-3 text-center text-sm text-slate-500">
                  Aucun mouvement
                </td>
              </tr>
            ) : (
              rows.map((m) => (
                <tr key={String(m.id)} className="odd:bg-white even:bg-slate-50">
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{m.date ?? '-'}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{m.reference ?? '-'}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{m.produit ?? '-'}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{m.type ?? '-'}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{safeNumber(m.quantity)}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{safeNumber(m.quantity_before)}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{safeNumber(m.quantity_after)}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800">{m.utilisateur ?? '-'}</td>
                  <td className="border-b border-slate-200 p-2 text-xs text-slate-800 max-w-[240px] truncate">
                    {m.reason ?? '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}





