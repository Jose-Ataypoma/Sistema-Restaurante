import React, { useState, useEffect } from 'react'
import { Sidebar } from '@components/Sidebar'
import { Header } from '@components/Header'
import { ProductCard } from '@components/ProductCard'
import { OrderPanel } from '@components/OrderPanel'
import { Product, Category, Order, OrderItem, Table } from '@app-types/index'
import { API_BASE_URL } from '@utils/constants'
import { useNavigate } from 'react-router-dom'

const POSPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: `ORD-${Date.now()}`,
    items: [],
    subtotal: 0,
    igv: 0,
    total: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const table = localStorage.getItem('selectedTable')
    if (!table) {
      navigate('/tables')
      return
    }
    setSelectedTable(JSON.parse(table))
    loadProducts()
  }, [navigate])

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`)
      const data = await res.json()
      if (data.success) {
        setProducts(data.data)
        const categoryMap = new Map<string, Category>()
        data.data.forEach((p: Product) => {
          if (!categoryMap.has(p.categoryId)) {
            categoryMap.set(p.categoryId, { id: p.categoryId, name: p.categoryId })
          }
        })
        const uniqueCategories = Array.from(categoryMap.values())
        setCategories(uniqueCategories)
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0].id)
        }
      }
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSendToKitchen = async () => {
    if (!selectedTable || currentOrder.items.length === 0) {
      alert('Selecciona una mesa y agrega productos')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable.id,
          items: currentOrder.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            observations: item.observations,
          })),
          subtotal: currentOrder.subtotal,
          igv: currentOrder.igv,
          total: currentOrder.total,
        }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.removeItem('selectedTable')
        navigate('/tables')
      }
    } catch (error) {
      console.error('Error al enviar orden:', error)
      alert('Error al enviar la orden')
    }
  }

  if (loading || !selectedTable) {
    return (
      <div className="flex h-screen bg-dark items-center justify-center">
        <p className="text-white text-xl">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title={`Punto de Venta (POS) - Mesa ${selectedTable.number}`} />
        <div className="flex-1 overflow-hidden flex gap-4 p-4">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex gap-2 mb-4 pb-4 border-b border-dark-border overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-neon-purple text-black shadow-glow'
                      : 'bg-dark-card text-gray-300 border border-dark-border hover:border-neon-purple'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </div>
          </div>

          <div className="w-80 bg-dark-card rounded-lg border border-dark-border overflow-hidden">
            <OrderPanel
              order={currentOrder}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onSendToKitchen={handleSendToKitchen}
              onPay={() => navigate('/cash')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSPage
