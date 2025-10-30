import React, { useEffect, useState } from 'react'
import { getProducts, getCart } from './api'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import CheckoutModal from './components/CheckoutModal'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([getProducts(), getCart()])
      setProducts(p)
      setCart(c)
    } catch (err) {
      console.error(err)
      alert('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Vibe Commerce — Mock Cart</h1>
        <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={()=>setShowCheckout(true)}>
          Checkout ({cart.items.length})
        </button>
      </header>

      <main className="grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <ProductList products={products} reloadCart={() => getCart().then(setCart)} loading={loading} />
        </section>
        <aside>
          <Cart cart={cart} reloadCart={() => getCart().then(setCart)} />
        </aside>
      </main>

      {showCheckout && (
        <CheckoutModal cart={cart} onClose={() => setShowCheckout(false)} onComplete={() => { setShowCheckout(false); load(); }} />
      )}

      <footer className="mt-8 text-center text-sm text-gray-500">Simple mock e-commerce for internship test</footer>
    </div>
  )
}
