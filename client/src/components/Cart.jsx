import React, { useState } from 'react'
import CheckoutModal from './CheckoutModal'

export default function Cart({ cart }) {
  const [showModal, setShowModal] = useState(false)
  const [receipt, setReceipt] = useState(null)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      {cart?.items?.length ? (
        <>
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-2 text-gray-800"
            >
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between mt-4 font-medium text-gray-900">
            <span>Total:</span>
            <span>${cart.total?.toFixed(2)}</span>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}

      {showModal && (
        <CheckoutModal
          cart={cart}
          onClose={() => {
            setShowModal(false)
            setReceipt(null)
          }}
          onComplete={(data) => {
            setReceipt(data.receipt)
          }}
        />
      )}

      {receipt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Receipt
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>ID:</strong> {receipt.id}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Total:</strong> ${receipt.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Date:</strong> {receipt.timestamp}
            </p>
            <button
              onClick={() => setReceipt(null)}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
