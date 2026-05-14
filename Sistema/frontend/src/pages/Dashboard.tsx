import React, { useState } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Dashboard: React.FC = () => {
  const salesData = [
    { date: 'Lun', ventas: 1200, pedidos: 24 },
    { date: 'Mar', ventas: 1900, pedidos: 32 },
    { date: 'Mié', ventas: 1600, pedidos: 28 },
    { date: 'Jue', ventas: 2200, pedidos: 41 },
    { date: 'Vie', ventas: 2800, pedidos: 52 },
    { date: 'Sab', ventas: 3200, pedidos: 61 },
    { date: 'Dom', ventas: 2500, pedidos: 47 },
  ]

  const paymentData = [
    { name: 'Efectivo', value: 4500, color: '#10b981' },
    { name: 'Tarjeta', value: 3200, color: '#3b82f6' },
    { name: 'Yape', value: 1800, color: '#fbbf24' },
    { name: 'Plin', value: 1200, color: '#8b5cf6' },
  ]

  const topProducts = [
    { name: 'Ceviche', cantidad: 156, ingresos: 2340 },
    { name: 'Lomo Saltado', cantidad: 128, ingresos: 1920 },
    { name: 'Ají de Gallina', cantidad: 102, ingresos: 1428 },
    { name: 'Causa Limeña', cantidad: 89, ingresos: 890 },
  ]

  const stats = [
    { title: 'Ventas Hoy', value: 'S/ 13,700', icon: '📊', color: 'from-neon-purple to-neon-pink' },
    { title: 'Pedidos', value: '127', icon: '📋', color: 'from-accent-purple to-neon-cyan' },
    { title: 'Clientes', value: '89', icon: '👥', color: 'from-success-green to-neon-cyan' },
    { title: 'Ticket Promedio', value: 'S/ 107.87', icon: '💰', color: 'from-warning-yellow to-danger-red' },
  ]

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 border border-dark-border shadow-lg hover:shadow-glow transition-all`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-100">{stat.title}</h3>
                    <span className="text-3xl">{stat.icon}</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Ventas */}
              <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
                <h2 className="text-lg font-bold text-white mb-4">Ventas Semanales</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #b833ff' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="#b833ff"
                      strokeWidth={3}
                      dot={{ fill: '#b833ff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pedidos"
                      stroke="#00ffff"
                      strokeWidth={3}
                      dot={{ fill: '#00ffff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Métodos de Pago */}
              <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
                <h2 className="text-lg font-bold text-white mb-4">Métodos de Pago</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={paymentData} cx="50%" cy="50%" labelLine={false} label>
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #b833ff' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Productos más vendidos */}
            <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
              <h2 className="text-lg font-bold text-white mb-4">Productos Más Vendidos</h2>
              <div className="space-y-3">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.cantidad} unidades</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-neon-purple">S/ {product.ingresos.toFixed(2)}</p>
                      <div className="w-24 h-2 bg-dark-border rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neon-purple to-neon-pink"
                          style={{ width: `${(product.ingresos / 2340) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
