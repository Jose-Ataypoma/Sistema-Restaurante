import React, { useState } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { SunatPanel } from '@components/SunatPanel'

const SUNATPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)

  const sunatDocuments = [
    {
      id: '1',
      type: 'factura',
      number: 'E001-00000123',
      ruc: '20123456789',
      status: 'accepted' as const,
      amount: 150.00,
      date: '2024-05-13',
      qrCode: 'https://via.placeholder.com/100',
    },
    {
      id: '2',
      type: 'boleta',
      number: 'B001-00000456',
      dni: '12345678',
      status: 'pending' as const,
      amount: 89.90,
      date: '2024-05-13',
      qrCode: 'https://via.placeholder.com/100',
    },
    {
      id: '3',
      type: 'factura',
      number: 'E001-00000122',
      ruc: '20987654321',
      status: 'rejected' as const,
      amount: 200.00,
      date: '2024-05-12',
      qrCode: 'https://via.placeholder.com/100',
      errorMessage: 'RUC no válido en SUNAT',
    },
  ]

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="SUNAT - Facturación Electrónica" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Información */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panel nuevo comprobante */}
              <div className="lg:col-span-1 bg-dark-card rounded-lg p-6 border border-dark-border h-fit">
                <h2 className="text-lg font-bold text-white mb-4">Nuevo Comprobante</h2>
                <SunatPanel
                  orderId="ORD-999"
                  total={450.50}
                  onSubmit={(data) => console.log('Enviado a SUNAT:', data)}
                />
              </div>

              {/* Historial */}
              <div className="lg:col-span-2 bg-dark-card rounded-lg p-6 border border-dark-border">
                <h2 className="text-lg font-bold text-white mb-4">Historial de Comprobantes</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sunatDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`rounded-lg p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
                        doc.status === 'accepted'
                          ? 'border-success-green bg-green-950 bg-opacity-20'
                          : doc.status === 'rejected'
                            ? 'border-danger-red bg-red-950 bg-opacity-20'
                            : 'border-warning-yellow bg-yellow-950 bg-opacity-20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-white">
                            {doc.type === 'factura' ? '📋 Factura' : '📄 Boleta'} {doc.number}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {doc.type === 'factura' ? 'RUC' : 'DNI'}: {doc.type === 'factura' ? doc.ruc : doc.dni}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-neon-purple">S/ {doc.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">{doc.date}</p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center gap-2 mt-3">
                        {doc.status === 'accepted' && (
                          <span className="bg-success-green text-white text-xs font-bold px-2 py-1 rounded">
                            ✓ Aceptado
                          </span>
                        )}
                        {doc.status === 'rejected' && (
                          <span className="bg-danger-red text-white text-xs font-bold px-2 py-1 rounded">
                            ✗ Rechazado
                          </span>
                        )}
                        {doc.status === 'pending' && (
                          <span className="bg-warning-yellow text-black text-xs font-bold px-2 py-1 rounded">
                            ⏳ Pendiente
                          </span>
                        )}

                        {doc.errorMessage && (
                          <span className="text-xs text-danger-red">{doc.errorMessage}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Validaciones SUNAT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
                <h3 className="text-lg font-bold text-white mb-4">📊 Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Comprobantes:</span>
                    <span className="font-bold text-white">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Aceptados:</span>
                    <span className="font-bold text-success-green">124</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rechazados:</span>
                    <span className="font-bold text-danger-red">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pendientes:</span>
                    <span className="font-bold text-warning-yellow">1</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-dark-border">
                    <span className="text-gray-300">Total Facturado:</span>
                    <span className="font-bold text-neon-purple">S/ 8,345.20</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
                <h3 className="text-lg font-bold text-white mb-4">⚙️ Configuración</h3>
                <div className="space-y-3">
                  <button className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg hover:border-neon-purple transition-colors text-sm font-semibold">
                    🔑 Conectar SUNAT
                  </button>
                  <button className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg hover:border-neon-purple transition-colors text-sm font-semibold">
                    📋 Ver Certificados
                  </button>
                  <button className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg hover:border-neon-purple transition-colors text-sm font-semibold">
                    🔄 Sincronizar
                  </button>
                  <button className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg hover:border-neon-purple transition-colors text-sm font-semibold">
                    📥 Descargar Comprobantes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SUNATPage
