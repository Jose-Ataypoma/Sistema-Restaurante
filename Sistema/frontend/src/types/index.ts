export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'manager' | 'cashier' | 'cook'
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image?: string
  available: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
}

export interface OrderItem {
  id: string
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
  subtotal: number
  observations?: string
}

export interface Order {
  id: string
  tableId?: string
  items: OrderItem[]
  subtotal: number
  igv: number
  total: number
  status: 'pending' | 'cooking' | 'ready' | 'paid' | 'cancelled'
  paymentMethod?: 'cash' | 'card' | 'yape' | 'plin'
  createdAt: string
  completedAt?: string
}

export interface Table {
  id: string
  number: number
  seats: number
  status: 'free' | 'occupied' | 'reserved' | 'paying'
  occupiedSince?: string
  currentOrderId?: string
  totalAmount?: number
}

export interface SunatDocument {
  id: string
  type: 'boleta' | 'factura'
  number: string
  ruc?: string
  dni?: string
  orderId: string
  qrCode: string
  status: 'pending' | 'accepted' | 'rejected'
  errorMessage?: string
  createdAt: string
}

export interface CashRegister {
  id: string
  openedAt: string
  closedAt?: string
  initialAmount: number
  finalAmount?: number
  totalCash: number
  totalCard: number
  totalYape: number
  totalPlin: number
  status: 'open' | 'closed'
}

export interface Payment {
  id: string
  orderId: string
  method: 'cash' | 'card' | 'yape' | 'plin'
  amount: number
  change?: number
  createdAt: string
}
