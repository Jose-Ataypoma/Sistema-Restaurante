import React, { useState, useEffect } from 'react'
import { Table } from '@app-types/index'
import { TABLE_STATUS } from '@utils/constants'

interface TableMapProps {
  tables: Table[]
  onSelectTable: (table: Table) => void
}

export const TableMap: React.FC<TableMapProps> = ({ tables, onSelectTable }) => {
  const getOccupiedTime = (occupiedSince?: string) => {
    if (!occupiedSince) return ''
    const minutes = Math.floor((Date.now() - new Date(occupiedSince).getTime()) / 60000)
    return `${minutes}m`
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tables.map((table) => {
        const statusConfig = TABLE_STATUS[table.status as keyof typeof TABLE_STATUS]
        const time = getOccupiedTime(table.occupiedSince)

        return (
          <button
            key={table.id}
            onClick={() => onSelectTable(table)}
            className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 ${
              table.status === 'free'
                ? 'border-success-green bg-opacity-10 bg-success-green hover:shadow-glow'
                : table.status === 'occupied'
                  ? 'border-danger-red bg-opacity-10 bg-danger-red hover:shadow-glow-pink'
                  : 'border-warning-yellow bg-opacity-10 bg-warning-yellow'
            }`}
          >
            <div className="text-3xl font-bold text-white">#{table.number}</div>
            <div className="text-xs font-semibold" style={{ color: statusConfig.color }}>
              {statusConfig.label}
            </div>
            {table.seats && <div className="text-xs text-gray-400">{table.seats} pax</div>}
            {time && <div className="text-xs text-yellow-400 font-semibold">{time}</div>}
            {table.status === 'paying' && (
              <div className="text-xs bg-accent-purple px-2 py-1 rounded">💰 {table.totalAmount?.toFixed(2)} S/</div>
            )}
          </button>
        )
      })}
    </div>
  )
}
