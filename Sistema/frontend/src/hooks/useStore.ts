import { create } from 'zustand'
import { User, Order, Table, OrderItem } from '@app-types/index'

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

interface OrderState {
  currentOrder: Order | null
  orders: Order[]
  addItem: (item: OrderItem) => void
  removeItem: (itemId: string) => void
  updateItem: (itemId: string, quantity: number) => void
  setCurrentOrder: (order: Order | null) => void
  setOrders: (orders: Order[]) => void
  clearCurrentOrder: () => void
}

interface TableState {
  tables: Table[]
  selectedTableId: string | null
  setTables: (tables: Table[]) => void
  selectTable: (tableId: string) => void
  deselectTable: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  token: localStorage.getItem('token'),
  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  orders: [],
  addItem: (item) =>
    set((state) => {
      if (!state.currentOrder) return state
      const existingItem = state.currentOrder.items.find((i) => i.productId === item.productId)
      if (existingItem) {
        return {
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          },
        }
      }
      return {
        currentOrder: {
          ...state.currentOrder,
          items: [...state.currentOrder.items, item],
        },
      }
    }),
  removeItem: (itemId) =>
    set((state) => {
      if (!state.currentOrder) return state
      return {
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.filter((i) => i.id !== itemId),
        },
      }
    }),
  updateItem: (itemId, quantity) =>
    set((state) => {
      if (!state.currentOrder) return state
      return {
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        },
      }
    }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setOrders: (orders) => set({ orders }),
  clearCurrentOrder: () => set({ currentOrder: null }),
}))

export const useTableStore = create<TableState>((set) => ({
  tables: [],
  selectedTableId: null,
  setTables: (tables) => set({ tables }),
  selectTable: (tableId) => set({ selectedTableId: tableId }),
  deselectTable: () => set({ selectedTableId: null }),
}))
