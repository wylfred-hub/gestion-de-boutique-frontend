// import type { Product } from '../../types'
// import { ProductCard } from './ProductCard'

// type ProductListProps = {
//   products: Product[]
// }

// export function ProductList({ products }: ProductListProps) {
//   if (products.length === 0) {
//     return <p className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucun produit.</p>
//   }

//   return (
//     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   )
// }


import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

type ProductListProps = {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return <p className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-500">Aucun produit.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}