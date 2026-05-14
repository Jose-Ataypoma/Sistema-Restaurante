import React, { useState } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { CashRegister } from '@components/CashRegister'

const CashPage: React.FC = () => {
  const [cashStatus, setCashStatus] = useState<'open' | 'closed'>('open')

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Caja" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Panel de caja */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-dark-card rounded-lg p-6 border border-dark-border h-fit">
                <CashRegister
                  status={cashStatus}
                  totalCash={4500}
                  totalCard={3200}
                  totalYape={1800}
                  totalPlin={1200}
                  onOpen={() => setCashStatus('open')}
                  onClose={() => setCashStatus('closed')}
                  onAddPayment={(data) => console.log('Pago registrado:', data)}
                />
              </div>

              {/* Últimas transacciones */}
              <div className="lg:col-span-2 bg-dark-card rounded-lg p-6 border border-dark-border">
                <h2 className="text-lg font-bold text-white mb-4">Movimientos de Hoy</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[
                    { id: '1', type: 'Efectivo', amount: 89.50, method: 'cash', time: '14:35' },
                    { id: '2', type: 'Tarjeta', amount: 156.80, method: 'card', time: '14:32' },
                    { id: '3', type: 'Yape', amount: 45.00, method: 'yape', time: '14:28' },
                    { id: '4', type: 'Efectivo', amount: 120.30, method: 'cash', time: '14:20' },
                    { id: '5', type: 'Plin', amount: 67.50, method: 'plin', time: '14:15' },
                    { id: '6', type: 'Tarjeta', amount: 234.00, method: 'card', time: '14:10' },
                  ].map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between bg-dark-bg rounded-lg p-3 border border-dark-border hover:border-neon-purple transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {transaction.method === 'cash'
                            ? '💵'
                            : transaction.method === 'card'
                              ? '💳'
                              : transaction.method === 'yape'
                                ? '📱'
                                : '📲'}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{transaction.type}</p>
                          <p className="text-xs text-gray-400">{transaction.time}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-neon-purple">S/ {transaction.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Informe de caja */}
            <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
              <h2 className="text-lg font-bold text-white mb-4">📊 Informe de Caja Diario</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                  <p className="text-xs text-gray-400 font-semibold">Apertura</p>
                  <p className="text-2xl font-bold text-white mt-1">S/ 500.00</p>
                  <p className="text-xs text-gray-500 mt-1">09:00 AM</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                  <p className="text-xs text-gray-400 font-semibold">Ingresos</p>
                  <p className="text-2xl font-bold text-success-green mt-1">S/ 10,700.00</p>
                  <p className="text-xs text-gray-500 mt-1">Actual</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                  <p className="text-xs text-gray-400 font-semibold">Egresos</p>
                  <p className="text-2xl font-bold text-danger-red mt-1">S/ 300.00</p>
                  <p className="text-xs text-gray-500 mt-1">Cambios</p>
                </div>
                <div className="bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg p-4 border border-neon-purple">
                  <p className="text-xs text-gray-900 font-semibold">Total Caja</p>
                  <p className="text-2xl font-bold text-white mt-1">S/ 10,900.00</p>
                  <p className="text-xs text-gray-900 mt-1">Esperado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashPage
