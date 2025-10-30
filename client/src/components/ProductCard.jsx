import React, { useState } from 'react'
import { addToCart } from '../api'

export default function ProductCard({ product, reloadCart }) {
  const [adding, setAdding] = useState(false)
  const handleAdd = async () => {
    setAdding(true)
    try {
      await addToCart(product.id || product._id, 1)
      reloadCart()
    } catch (err) {
      console.error(err)
      alert('Could not add to cart')
    } finally {
      setAdding(false)
    }
  }
  return (
    <div className="bg-white rounded shadow p-3 flex flex-col">
      <img className="h-40 w-full object-cover rounded" src={product.image || product.image_url || 'https://via.placeholder.com/400x300'} alt={product.name} />
      <div className="mt-3 flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-semibold">${(product.price).toFixed(2)}</div>
        <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={handleAdd} disabled={adding || product.stock_quantity===0}>
          {product.stock_quantity===0 ? 'Out of stock' : adding ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  )
}
