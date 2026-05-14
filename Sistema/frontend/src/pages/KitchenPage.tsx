import React, { useState, useEffect } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { KitchenOrderCard } from '@components/KitchenOrderCard'
import { Order } from '@app-types/index'
import { API_BASE_URL, WS_URL } from '@utils/constants'
import { io, Socket } from 'socket.io-client'

const KitchenPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    loadOrders()
    const newSocket = io(WS_URL)
    setSocket(newSocket)

    newSocket.on('new_order', (order: Order) => {
      setOrders((prev) => [order, ...prev])
    })

    newSocket.on('order_updated', (data: { orderId: string; status: string }) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === data.orderId ? { ...o, status: data.status as any } : o))
      )
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`)
      const data = await res.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        )
      }
    } catch (error) {
      console.error('Error al actualizar orden:', error)
    }
  }

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'cooking')
  const pending = orders.filter((o) => o.status === 'pending').length
  const cooking = orders.filter((o) => o.status === 'cooking').length
  const ready = orders.filter((o) => o.status === 'ready').length

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
                <p className="text-3xl font-bold text-warning-yellow mt-1">{pending}</p>
              </div>
              <div className="bg-neon-purple bg-opacity-20 border-2 border-neon-purple rounded-lg p-4">
                <p className="text-sm text-gray-300">Preparando</p>
                <p className="text-3xl font-bold text-neon-purple mt-1">{cooking}</p>
              </div>
              <div className="bg-success-green bg-opacity-20 border-2 border-success-green rounded-lg p-4">
                <p className="text-sm text-gray-300">Listos</p>
                <p className="text-3xl font-bold text-success-green mt-1">{ready}</p>
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
                <p className="text-gray-400 text-sm mt-2">¡Buen trabajo chef!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KitchenPage
