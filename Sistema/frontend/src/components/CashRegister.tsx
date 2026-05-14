import React, { useState } from 'react'

interface CashRegisterProps {
  status: 'open' | 'closed'
  totalCash: number
  totalCard: number
  totalYape: number
  totalPlin: number
  onOpen?: (amount: number) => void
  onClose?: () => void
  onAddPayment?: (data: any) => void
}

export const CashRegister: React.FC<CashRegisterProps> = ({
  status,
  totalCash,
  totalCard,
  totalYape,
  totalPlin,
  onOpen,
  onClose,
  onAddPayment,
}) => {
  const [method, setMethod] = useState<'cash' | 'card' | 'yape' | 'plin'>('cash')
  const [amount, setAmount] = useState('')
  const [change, setChange] = useState(0)

  const totalAll = totalCash + totalCard + totalYape + totalPlin

  const methods = [
    { id: 'cash' as const, label: '💵 Efectivo', color: 'bg-green-600', value: totalCash },
    { id: 'card' as const, label: '💳 Tarjeta', color: 'bg-blue-600', value: totalCard },
    { id: 'yape' as const, label: '📱 Yape', color: 'bg-yellow-600', value: totalYape },
    { id: 'plin' as const, label: '📲 Plin', color: 'bg-purple-600', value: totalPlin },
  ]

  return (
    <div className="space-y-6">
      {/* Estado de caja */}
      <div className="flex gap-2">
        <div
          className={`flex-1 px-4 py-3 rounded-lg font-bold text-center transition-all ${
            status === 'open'
              ? 'bg-success-green text-white shadow-glow'
              : 'bg-danger-red text-white shadow-glow-pink'
          }`}
        >
          {status === 'open' ? '🟢 Caja Abierta' : '🔴 Caja Cerrada'}
        </div>
        {status === 'closed' && onOpen && (
          <button
            onClick={() => onOpen(0)}
            className="flex-1 bg-neon-purple text-black font-bold py-3 rounded-lg hover:bg-neon-pink transition-colors"
          >
            🔓 Abrir Caja
          </button>
        )}
        {status === 'open' && onClose && (
          <button
            onClick={onClose}
            className="flex-1 bg-danger-red text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            🔒 Cerrar Caja
          </button>
        )}
      </div>

      {/* Totales por método */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">Movimientos de Dinero</h2>
        <div className="grid grid-cols-2 gap-3">
          {methods.map((m) => (
            <div
              key={m.id}
              className={`${m.color} bg-opacity-20 border-2 ${m.color} border-opacity-50 rounded-lg p-4`}
            >
              <p className="text-sm text-gray-300">{m.label}</p>
              <p className="text-2xl font-bold text-white mt-1">S/ {m.value.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total general */}
        <div className="bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg p-4 border border-neon-purple">
          <p className="text-sm text-gray-900 font-semibold">Total de Caja</p>
          <p className="text-4xl font-bold text-white mt-2">S/ {totalAll.toFixed(2)}</p>
        </div>
      </div>

      {/* Registro de pago */}
      {status === 'open' && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-bold text-white">Registrar Pago</h3>

          {/* Método */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Método de Pago</label>
            <div className="grid grid-cols-2 gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    method === m.id
                      ? 'bg-neon-purple text-black'
                      : 'bg-dark-bg text-gray-300 border border-dark-border'
                  }`}
                >
                  {m.label.split(' ')[0]} {m.label.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Monto Recibido</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0
                setAmount(e.target.value)
                setChange(val - 0) // 0 sería el total del pedido
              }}
              placeholder="S/ 0.00"
              className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-neon-purple text-lg font-semibold"
            />
          </div>

          {/* Vuelto */}
          {change > 0 && (
            <div className="bg-warning-yellow bg-opacity-10 border border-warning-yellow rounded-lg p-3">
              <p className="text-xs text-gray-400">Vuelto</p>
              <p className="text-2xl font-bold text-warning-yellow">S/ {change.toFixed(2)}</p>
            </div>
          )}

          {/* Botón cobrar */}
          <button
            onClick={() => onAddPayment?.({ method, amount: parseFloat(amount), change })}
            className="w-full bg-success-green text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors text-lg"
          >
            💰 Cobrar e Imprimir
          </button>
        </div>
      )}
    </div>
  )
}
