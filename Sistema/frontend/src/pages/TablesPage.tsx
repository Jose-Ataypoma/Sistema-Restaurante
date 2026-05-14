import React, { useState } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { TableMap } from '@components/TableMap'
import { Table } from '@types/index'

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, seats: 2, status: 'free' },
    { id: '2', number: 2, seats: 4, status: 'occupied', occupiedSince: new Date(Date.now() - 45 * 60000).toISOString(), totalAmount: 89.50 },
    { id: '3', number: 3, seats: 6, status: 'free' },
    { id: '4', number: 4, seats: 2, status: 'paying', occupiedSince: new Date(Date.now() - 120 * 60000).toISOString(), totalAmount: 156.80 },
    { id: '5', number: 5, seats: 4, status: 'occupied', occupiedSince: new Date(Date.now() - 20 * 60000).toISOString() },
    { id: '6', number: 6, seats: 2, status: 'free' },
    { id: '7', number: 7, seats: 4, status: 'occupied', occupiedSince: new Date(Date.now() - 65 * 60000).toISOString() },
    { id: '8', number: 8, seats: 6, status: 'free' },
  ])

  const handleSelectTable = (table: Table) => {
    console.log('Mesa seleccionada:', table)
  }

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Gestión de Mesas" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400">Total Mesas</p>
                <p className="text-3xl font-bold text-white mt-1">{tables.length}</p>
              </div>
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400">Ocupadas</p>
                <p className="text-3xl font-bold text-danger-red mt-1">
                  {tables.filter((t) => t.status === 'occupied').length}
                </p>
              </div>
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400">Libres</p>
                <p className="text-3xl font-bold text-success-green mt-1">
                  {tables.filter((t) => t.status === 'free').length}
                </p>
              </div>
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400">Pagando</p>
                <p className="text-3xl font-bold text-accent-purple mt-1">
                  {tables.filter((t) => t.status === 'paying').length}
                </p>
              </div>
            </div>

            {/* Mapa de mesas */}
            <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Mapa de Mesas</h2>
                <button className="bg-neon-purple text-black px-4 py-2 rounded-lg font-bold hover:bg-neon-pink transition-colors">
                  ➕ Nueva Mesa
                </button>
              </div>
              <TableMap tables={tables} onSelectTable={handleSelectTable} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TablesPage
