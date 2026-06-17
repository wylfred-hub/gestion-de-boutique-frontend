

type MiniBarsProps = {
  title: string
  valueLabel: string
  items: Array<{ label: string; value: number; accent?: 'emerald' | 'rose' | 'slate' }>
}

function accentToClass(accent?: 'emerald' | 'rose' | 'slate') {
  switch (accent) {
    case 'emerald':
      return {
        bar: 'bg-emerald-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
      }
    case 'rose':
      return {
        bar: 'bg-rose-500',
        bg: 'bg-rose-50',
        text: 'text-rose-800',
      }
    default:
      return {
        bar: 'bg-slate-500',
        bg: 'bg-slate-50',
        text: 'text-slate-800',
      }
  }
}

export function MiniBars({ title, valueLabel, items }: MiniBarsProps) {
  const max = Math.max(0, ...items.map((i) => (Number.isFinite(i.value) ? i.value : 0)))

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <div className="mt-1 text-sm text-slate-600">{valueLabel}</div>
        </div>
        <div className="text-right text-xs text-slate-500">max: {max}</div>
      </div>

      <div className="flex h-32 items-end gap-1 overflow-x-auto">
        {items.map((it) => {
          const { bar, text } = accentToClass(it.accent)
          const heightPct = max <= 0 ? 0 : Math.round((Math.max(0, it.value) / max) * 100)

          return (
            <div key={it.label} className="flex flex-col items-center gap-1">
              <div
                className={`w-6 rounded-sm ${bar}`}
                style={{ height: `${Math.max(6, heightPct)}%` }}
                title={`${it.label}: ${it.value}`}
              />
              <div className={`max-w-[56px] truncate text-[10px] ${text}`}>{it.label}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

