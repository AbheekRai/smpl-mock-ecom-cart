import React, { useState } from 'react'
import { checkout } from '../api'

export default function CheckoutModal({ cart, onClose, onComplete }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [processing, setProcessing] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!name || !email) return alert('Please enter name and email')
    setProcessing(true)
    try {
      const res = await checkout({ name, email })
      setReceipt(res.receipt)
      onComplete && onComplete()
    } catch (err) {
      console.error(err)
      alert('Checkout failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded p-4 max-w-md w-full relative">
        <button className="absolute right-2 top-2" onClick={onClose}>✕</button>
        {!receipt ? (
          <>
            <h3 className="text-lg font-medium mb-2">Checkout</h3>
            <form onSubmit={submit} className="space-y-2">
              <div>
                <label className="block text-sm">Name</label>
                <input className="w-full border px-2 py-1 rounded" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm">Email</label>
                <input type="email" className="w-full border px-2 py-1 rounded" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div className="text-sm text-gray-600">Total: ${cart.total?.toFixed(2) || '0.00'}</div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-3 py-1 border rounded" onClick={onClose}>Cancel</button>
                <button className="bg-indigo-600 text-white px-3 py-1 rounded" disabled={processing}>{processing ? 'Processing...' : 'Place order'}</button>
              </div>
            </form>
          </>
        ) : (
          <div>
            <h3 className="text-lg font-medium">Receipt</h3>
            <div className="text-sm mt-2">Receipt ID: {receipt.id}</div>
            <div className="text-sm">Total: ${receipt.total.toFixed(2)}</div>
            <div className="text-sm">Timestamp: {receipt.timestamp}</div>
            <div className="flex justify-end mt-3">
              <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={()=>{ setReceipt(null); onClose(); }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
