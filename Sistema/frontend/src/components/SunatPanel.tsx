import React, { useState } from 'react'
import { SunatDocument } from '@types/index'

interface SunatPanelProps {
  orderId: string
  total: number
  onSubmit?: (data: any) => void
}

export const SunatPanel: React.FC<SunatPanelProps> = ({ orderId, total, onSubmit }) => {
  const [docType, setDocType] = useState<'boleta' | 'factura'>('boleta')
  const [ruc, setRuc] = useState('')
  const [dni, setDni] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = () => {
    if (docType === 'factura' && !ruc) {
      alert('RUC es requerido para factura')
      return
    }
    if (docType === 'boleta' && !dni) {
      alert('DNI es requerido para boleta')
      return
    }

    setStatus('sending')
    setTimeout(() => {
      setStatus('success')
      onSubmit?.({ docType, ruc, dni, orderId, total })
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {/* Tipo de documento */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Tipo de Comprobante</label>
        <div className="flex gap-2">
          <button
            onClick={() => setDocType('boleta')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              docType === 'boleta'
                ? 'bg-neon-purple text-black shadow-glow'
                : 'bg-dark-card text-gray-300 border border-dark-border'
            }`}
          >
            📄 Boleta
          </button>
          <button
            onClick={() => setDocType('factura')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              docType === 'factura'
                ? 'bg-neon-purple text-black shadow-glow'
                : 'bg-dark-card text-gray-300 border border-dark-border'
            }`}
          >
            📋 Factura
          </button>
        </div>
      </div>

      {/* Documento */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          {docType === 'boleta' ? 'DNI' : 'RUC'}
        </label>
        <input
          type="text"
          value={docType === 'boleta' ? dni : ruc}
          onChange={(e) => (docType === 'boleta' ? setDni(e.target.value) : setRuc(e.target.value))}
          placeholder={docType === 'boleta' ? 'Ingrese DNI' : 'Ingrese RUC'}
          className="w-full bg-dark-bg border border-dark-border text-white px-4 py-2 rounded-lg focus:outline-none focus:border-neon-purple"
        />
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Total a Facturar</label>
        <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-neon-purple">S/ {total.toFixed(2)}</p>
        </div>
      </div>

      {/* Status */}
      {status === 'success' && (
        <div className="bg-green-950 border border-success-green rounded-lg p-4 text-center">
          <p className="text-success-green font-semibold">✓ Enviado a SUNAT</p>
          <p className="text-xs text-gray-400 mt-1">Procesando comprobante...</p>
        </div>
      )}

      {/* Botón envío */}
      <button
        onClick={handleSubmit}
        disabled={status === 'sending'}
        className={`w-full py-3 rounded-lg font-bold transition-all text-lg ${
          status === 'success'
            ? 'bg-success-green text-white'
            : status === 'sending'
              ? 'bg-warning-yellow text-black opacity-75'
              : 'bg-neon-purple text-black hover:bg-neon-pink shadow-glow'
        }`}
      >
        {status === 'sending' ? '⏳ Enviando...' : status === 'success' ? '✓ Enviado' : '🚀 Enviar a SUNAT'}
      </button>

      {/* Historial */}
      <div className="mt-6 pt-4 border-t border-dark-border">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Últimos Comprobantes</h3>
        <div className="space-y-2">
          <div className="bg-dark-card p-3 rounded-lg border border-dark-border text-xs">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Factura E001-00000123</span>
              <span className="text-success-green font-bold">Aceptado ✓</span>
            </div>
            <p className="text-gray-500">2024-05-13 • S/ 150.00</p>
          </div>
          <div className="bg-dark-card p-3 rounded-lg border border-dark-border text-xs">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Boleta 0001-00000456</span>
              <span className="text-warning-yellow font-bold">Pendiente ⏳</span>
            </div>
            <p className="text-gray-500">2024-05-13 • S/ 89.90</p>
          </div>
        </div>
      </div>
    </div>
  )
}
