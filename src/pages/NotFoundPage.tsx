import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="grid min-h-80 place-items-center text-center">
      <div>
        <h1 className="text-3xl font-bold">Page introuvable</h1>
        <p className="mt-2 text-sm text-slate-500">La route demandee n'existe pas.</p>
        <Link className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" to="/">
          Retour accueil
        </Link>
      </div>
    </div>
  )
}
