import React, { useState } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { ProductCard } from '@components/ProductCard'
import { OrderPanel } from '@components/OrderPanel'
import { Product, Category, Order, OrderItem } from '@types/index'

const POSPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('1')
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: 'ORD-001',
    items: [],
    subtotal: 0,
    igv: 0,
    total: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  const categories: Category[] = [
    { id: '1', name: 'Entradas', icon: '🥗', color: '#10b981' },
    { id: '2', name: 'Fondos', icon: '🍚', color: '#b833ff' },
    { id: '3', name: 'Bebidas', icon: '🥤', color: '#00ffff' },
    { id: '4', name: 'Postres', icon: '🍰', color: '#fbbf24' },
  ]

  const products: Product[] = [
    { id: '1', name: 'Ceviche de Pescado', description: 'Fresco y delicioso', price: 25.90, categoryId: '1', available: true, createdAt: new Date().toISOString() },
    { id: '2', name: 'Causita Limeña', description: 'Tradicional peruana', price: 18.50, categoryId: '1', available: true, createdAt: new Date().toISOString() },
    { id: '3', name: 'Anticuchos', description: 'Brochetas de carne', price: 22.00, categoryId: '1', available: true, createdAt: new Date().toISOString() },
    { id: '4', name: 'Lomo Saltado', description: 'Nuestro clásico', price: 32.00, categoryId: '2', available: true, createdAt: new Date().toISOString() },
    { id: '5', name: 'Ají de Gallina', description: 'Cremoso y sabroso', price: 28.50, categoryId: '2', available: true, createdAt: new Date().toISOString() },
    { id: '6', name: 'Arroz con Pollo', description: 'Completo y nutritivo', price: 24.00, categoryId: '2', available: true, createdAt: new Date().toISOString() },
    { id: '7', name: 'Coca Cola', description: 'Botella 500ml', price: 4.00, categoryId: '3', available: true, createdAt: new Date().toISOString() },
    { id: '8', name: 'Cerveza Cristal', description: 'Botella 355ml', price: 8.50, categoryId: '3', available: true, createdAt: new Date().toISOString() },
    { id: '9', name: 'Agua Mineral', description: 'Sin gas 500ml', price: 2.50, categoryId: '3', available: true, createdAt: new Date().toISOString() },
    { id: '10', name: 'Tres Leches', description: 'Postre clásico', price: 12.00, categoryId: '4', available: true, createdAt: new Date().toISOString() },
    { id: '11', name: 'Chocotorta', description: 'Chocolate puro', price: 11.50, categoryId: '4', available: false, createdAt: new Date().toISOString() },
    { id: '12', name: 'Mazamorra Morada', description: 'Andina y deliciosa', price: 9.00, categoryId: '4', available: true, createdAt: new Date().toISOString() },
  ]

  const filteredProducts = products.filter((p) => p.categoryId === selectedCategory)

  const handleAddToCart = (product: Product) => {
    const newItem: OrderItem = {
      id: Math.random().toString(36),
      productId: product.id,
      product,
      quantity: 1,
      unitPrice: product.price,
      subtotal: product.price,
    }

    const existingItem = currentOrder.items.find((item) => item.productId === product.id)
    if (existingItem) {
      existingItem.quantity++
      existingItem.subtotal = existingItem.quantity * existingItem.unitPrice
    } else {
      currentOrder.items.push(newItem)
    }

    updateOrder()
  }

  const updateOrder = () => {
    const subtotal = currentOrder.items.reduce((sum, item) => sum + item.subtotal, 0)
    const igv = subtotal * 0.18
    const total = subtotal + igv

    setCurrentOrder({
      ...currentOrder,
      subtotal: parseFloat(subtotal.toFixed(2)),
      igv: parseFloat(igv.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    })
  }

  const handleRemoveItem = (itemId: string) => {
    currentOrder.items = currentOrder.items.filter((item) => item.id !== itemId)
    updateOrder()
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    const item = currentOrder.items.find((i) => i.id === itemId)
    if (item) {
      item.quantity = quantity
      item.subtotal = quantity * item.unitPrice
      updateOrder()
    }
  }

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Punto de Venta (POS)" />
        <div className="flex-1 overflow-hidden flex gap-4 p-4">
          {/* Main Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Categorías */}
            <div className="flex gap-2 mb-4 pb-4 border-b border-dark-border">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-neon-purple text-black shadow-glow'
                      : 'bg-dark-card text-gray-300 border border-dark-border hover:border-neon-purple'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Productos Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Panel - Right Sidebar */}
          <div className="w-80 bg-dark-card rounded-lg border border-dark-border overflow-hidden">
            <OrderPanel
              order={currentOrder}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onSendToKitchen={() => console.log('Enviado a cocina')}
              onPay={() => console.log('Ir a pago')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSPage
