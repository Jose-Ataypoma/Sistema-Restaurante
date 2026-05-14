import React from 'react'
import { Order, OrderItem } from '@types/index'
import { ORDER_STATUS } from '@utils/constants'

interface OrderPanelProps {
  order: Order | null
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onSendToKitchen?: () => void
  onPay?: () => void
}

export const OrderPanel: React.FC<OrderPanelProps> = ({
  order,
  onRemoveItem,
  onUpdateQuantity,
  onSendToKitchen,
  onPay,
}) => {
  if (!order || order.items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-lg font-semibold">Pedido vacío</p>
        <p className="text-sm">Selecciona productos para comenzar</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-dark-card rounded-lg border border-dark-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-lg font-bold text-white">Pedido Actual</h2>
        <p className="text-xs text-gray-400 mt-1">ID: {order.id}</p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {order.items.map((item: OrderItem) => (
          <div key={item.id} className="bg-dark-bg rounded-lg p-3 border border-dark-border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.product?.name}</p>
                <p className="text-xs text-gray-400">S/ {item.unitPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-danger-red hover:text-red-600 text-lg font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex items-center justify-between bg-dark-card rounded p-2">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="text-gray-300 hover:text-neon-purple font-bold transition-colors"
              >
                −
              </button>
              <span className="text-white font-semibold">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="text-gray-300 hover:text-neon-purple font-bold transition-colors"
              >
                +
              </button>
            </div>

            <div className="text-right mt-2 text-sm font-semibold text-neon-purple">
              S/ {item.subtotal.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Totales */}
      <div className="p-4 border-t border-dark-border space-y-2">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Subtotal:</span>
          <span>S/ {order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>IGV (18%):</span>
          <span>S/ {order.igv.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-neon-purple border-t border-dark-border pt-2">
          <span>Total:</span>
          <span>S/ {order.total.toFixed(2)}</span>
        </div>

        {/* Observaciones */}
        <input
          type="text"
          placeholder="Observaciones (ej: sin ají)"
          className="w-full bg-dark-bg border border-dark-border text-white px-3 py-2 rounded text-xs mt-3 focus:outline-none focus:border-neon-purple"
        />

        {/* Botones */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {onSendToKitchen && (
            <button
              onClick={onSendToKitchen}
              className="bg-neon-purple text-black font-bold py-3 rounded-lg hover:bg-neon-pink transition-colors text-sm"
            >
              👨‍🍳 Enviar a Cocina
            </button>
          )}
          {onPay && (
            <button
              onClick={onPay}
              className="bg-success-green text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              💰 Cobrar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
