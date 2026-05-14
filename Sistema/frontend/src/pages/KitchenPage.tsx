import React, { useState } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { KitchenOrderCard } from '@components/KitchenOrderCard'
import { Order } from '@types/index'

const KitchenPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      items: [
        {
          id: '1',
          productId: '1',
          product: { id: '1', name: 'Ceviche de Pescado', price: 25.90, categoryId: '1', available: true, createdAt: new Date().toISOString() },
          quantity: 2,
          unitPrice: 25.90,
          subtotal: 51.80,
          observations: 'Extra limón',
        },
        {
          id: '2',
          productId: '4',
          product: { id: '4', name: 'Lomo Saltado', price: 32.00, categoryId: '2', available: true, createdAt: new Date().toISOString() },
          quantity: 1,
          unitPrice: 32.00,
          subtotal: 32.00,
        },
      ],
      subtotal: 83.80,
      igv: 15.08,
      total: 98.88,
      status: 'pending',
      createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    },
    {
      id: 'ORD-002',
      items: [
        {
          id: '3',
          productId: '5',
          product: { id: '5', name: 'Ají de Gallina', price: 28.50, categoryId: '2', available: true, createdAt: new Date().toISOString() },
          quantity: 3,
          unitPrice: 28.50,
          subtotal: 85.50,
          observations: 'Sin ají picante',
        },
      ],
      subtotal: 85.50,
      igv: 15.39,
      total: 100.89,
      status: 'cooking',
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
      id: 'ORD-003',
      items: [
        {
          id: '4',
          productId: '2',
          product: { id: '2', name: 'Causita Limeña', price: 18.50, categoryId: '1', available: true, createdAt: new Date().toISOString() },
          quantity: 2,
          unitPrice: 18.50,
          subtotal: 37.00,
        },
      ],
      subtotal: 37.00,
      igv: 6.66,
      total: 43.66,
      status: 'pending',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    },
  ])

  const handleStatusChange = (orderId: string, newStatus: 'cooking' | 'ready') => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order))
    )
  }

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'cooking')

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Cocina (KDS)" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-warning-yellow bg-opacity-20 border-2 border-warning-yellow rounded-lg p-4">
                <p className="text-sm text-gray-300">Pendientes</p>
                <p className="text-3xl font-bold text-warning-yellow mt-1">
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <div className="bg-neon-purple bg-opacity-20 border-2 border-neon-purple rounded-lg p-4">
                <p className="text-sm text-gray-300">Preparando</p>
                <p className="text-3xl font-bold text-neon-purple mt-1">
                  {orders.filter((o) => o.status === 'cooking').length}
                </p>
              </div>
              <div className="bg-success-green bg-opacity-20 border-2 border-success-green rounded-lg p-4">
                <p className="text-sm text-gray-300">Listos</p>
                <p className="text-3xl font-bold text-success-green mt-1">
                  {orders.filter((o) => o.status === 'ready').length}
                </p>
              </div>
            </div>

            {/* Pedidos */}
            {pendingOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 bg-dark-card rounded-lg border border-dark-border">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-xl font-bold text-white">Todas las órdenes completadas</p>
                <p className="text-gray-400 text-sm mt-2">Buen trabajo chef!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KitchenPage
