import React, { useState, useEffect } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { TableMap } from '@components/TableMap'
import { Table } from '@app-types/index'
import { API_BASE_URL } from '@utils/constants'
import { useNavigate } from 'react-router-dom'

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ number: '', seats: 2 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadTables()
  }, [])

  const loadTables = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tables`)
      const data = await res.json()
      if (data.success) {
        setTables(data.data)
      }
    } catch (error) {
      console.error('Error al cargar mesas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.number) return

    try {
      const res = await fetch(`${API_BASE_URL}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: parseInt(formData.number), seats: parseInt(String(formData.seats)) }),
      })
      const data = await res.json()
      if (data.success) {
        setTables([...tables, data.data])
        setFormData({ number: '', seats: 2 })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error al crear mesa:', error)
    }
  }

  const handleSelectTable = (table: Table) => {
    if (table.status === 'free') {
      localStorage.setItem('selectedTable', JSON.stringify(table))
      navigate('/pos')
    } else {
      alert(`Mesa ${table.number} no está disponible`)
    }
  }

  const occupied = tables.filter((t) => t.status === 'occupied').length
  const free = tables.filter((t) => t.status === 'free').length

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Gestión de Mesas" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400">Total Mesas</p>
                <p className="text-3xl font-bold text-white mt-1">{tables.length}</p>
              </div>
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400">Ocupadas</p>
                <p className="text-3xl font-bold text-danger-red mt-1">{occupied}</p>
              </div>
              <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
                <p className="text-xs text-gray-400">Libres</p>
                <p className="text-3xl font-bold text-success-green mt-1">{free}</p>
              </div>
            </div>

            {/* Mapa de mesas */}
            <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Mapa de Mesas</h2>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-neon-purple text-black px-4 py-2 rounded-lg font-bold hover:bg-neon-pink transition-colors"
                >
                  ➕ Nueva Mesa
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleCreateTable} className="mb-6 bg-dark-bg p-4 rounded-lg border border-dark-border">
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Número de mesa"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="bg-dark-card border border-dark-border rounded px-3 py-2 text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Cantidad de asientos"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                      className="bg-dark-card border border-dark-border rounded px-3 py-2 text-white"
                      min="1"
                    />
                    <button type="submit" className="bg-success-green text-black px-4 py-2 rounded font-bold hover:bg-opacity-80">
                      Crear Mesa
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <p className="text-gray-400">Cargando mesas...</p>
              ) : (
                <TableMap tables={tables} onSelectTable={handleSelectTable} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TablesPage
