import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@hooks/useStore'

interface NavItem {
  path: string
  icon: string
  label: string
  role?: string[]
}

const navItems: NavItem[] = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/mesas', icon: '🪑', label: 'Mesas' },
  { path: '/pos', icon: '🛒', label: 'POS' },
  { path: '/pedidos', icon: '📋', label: 'Pedidos' },
  { path: '/cocina', icon: '👨‍🍳', label: 'Cocina' },
  { path: '/caja', icon: '💰', label: 'Caja' },
  { path: '/productos', icon: '📦', label: 'Productos' },
  { path: '/categorias', icon: '🏷️', label: 'Categorías' },
  { path: '/clientes', icon: '👥', label: 'Clientes' },
  { path: '/sunat', icon: '📄', label: 'SUNAT' },
  { path: '/reportes', icon: '📈', label: 'Reportes' },
  { path: '/configuracion', icon: '⚙️', label: 'Configuración' },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center text-xl font-bold">
            ⚡
          </div>
          <div>
            <h1 className="text-lg font-bold text-neon-purple">NeoPos</h1>
            <p className="text-xs text-gray-400">Premium POS</p>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          <p>{user?.username}</p>
          <p className="text-neon-purple">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.path
                ? 'bg-neon-purple text-black font-semibold shadow-glow'
                : 'text-gray-300 hover:bg-dark-border hover:text-neon-purple'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="w-full px-4 py-2 bg-danger-red hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
