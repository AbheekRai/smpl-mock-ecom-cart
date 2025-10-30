import React from 'react'
import ProductCard from './ProductCard'

export default function ProductList({ products, reloadCart, loading }) {
  if (loading) return <div>Loading products...</div>
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {products.map(p => <ProductCard key={p.id || p._id} product={p} reloadCart={reloadCart} />)}
    </div>
  )
}
