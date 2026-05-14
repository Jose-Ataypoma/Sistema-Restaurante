import React from 'react'
import { Order } from '@types/index'

interface KitchenOrderCardProps {
  order: Order
  onStatusChange: (orderId: string, status: 'cooking' | 'ready') => void
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ order, onStatusChange }) => {
  const getOrderTime = () => {
    const minutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)
    return `${minutes}m ago`
  }

  const isUrgent = (Date.now() - new Date(order.createdAt).getTime()) > 15 * 60000

  return (
    <div
      className={`rounded-lg p-4 border-2 ${
        isUrgent
          ? 'border-danger-red bg-red-950 bg-opacity-30 shadow-glow-pink'
          : 'border-neon-purple bg-dark-card shadow-glow'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-xl font-bold text-white">Pedido #{order.id}</h3>
          <p className="text-xs text-gray-400">{getOrderTime()}</p>
        </div>
        <div
          className={`text-2xl ${isUrgent ? 'animate-pulse text-danger-red' : 'text-warning-yellow'}`}
        >
          ⏱️
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4 bg-dark-bg rounded p-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex-1">
              <p className="font-semibold text-white">{item.product?.name}</p>
              {item.observations && (
                <p className="text-xs text-warning-yellow italic">{item.observations}</p>
              )}
            </div>
            <span className="bg-neon-purple text-black font-bold px-3 py-1 rounded-full text-sm">
              x{item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button
            onClick={() => onStatusChange(order.id, 'cooking')}
            className="flex-1 bg-warning-yellow text-black font-bold py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            👨‍🍳 Preparando
          </button>
        )}
        {(order.status === 'pending' || order.status === 'cooking') && (
          <button
            onClick={() => onStatusChange(order.id, 'ready')}
            className="flex-1 bg-success-green text-white font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            ✓ Listo
          </button>
        )}
      </div>
    </div>
  )
}
