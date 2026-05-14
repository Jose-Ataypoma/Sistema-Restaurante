import React from 'react'
import { useAuthStore } from '@hooks/useStore'

export const Header: React.FC<{ title: string }> = ({ title }) => {
  const { user } = useAuthStore()

  return (
    <div className="bg-dark-card border-b border-dark-border px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {new Date().toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{user?.username}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink"></div>
      </div>
    </div>
  )
}
