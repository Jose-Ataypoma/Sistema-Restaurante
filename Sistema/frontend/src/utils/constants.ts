export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000'

export const COLORS = {
  dark: '#0a0a0a',
  darkBg: '#0f0f0f',
  darkCard: '#1a1a1a',
  darkBorder: '#2a2a2a',
  neonPurple: '#b833ff',
  neonPink: '#ff00ff',
  neonCyan: '#00ffff',
  successGreen: '#10b981',
  dangerRed: '#ef4444',
  warningYellow: '#fbbf24',
  accentPurple: '#8b5cf6',
}

export const TABLE_STATUS = {
  free: { color: COLORS.successGreen, label: 'Libre' },
  occupied: { color: COLORS.dangerRed, label: 'Ocupada' },
  reserved: { color: COLORS.warningYellow, label: 'Reservada' },
  paying: { color: COLORS.accentPurple, label: 'Pagando' },
}

export const ORDER_STATUS = {
  pending: { color: COLORS.warningYellow, label: 'Pendiente' },
  cooking: { color: COLORS.neonPurple, label: 'Preparando' },
  ready: { color: COLORS.successGreen, label: 'Listo' },
  paid: { color: COLORS.neonCyan, label: 'Pagado' },
  cancelled: { color: '#666666', label: 'Cancelado' },
}
