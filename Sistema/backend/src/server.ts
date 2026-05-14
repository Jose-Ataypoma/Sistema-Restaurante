import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

dotenv.config()

const app: Express = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`)
  })

  // Eventos de órdenes en tiempo real
  socket.on('new_order', (order) => {
    io.emit('order_created', order)
  })

  socket.on('order_status_change', (data) => {
    io.emit('order_updated', data)
  })

  socket.on('table_status_change', (data) => {
    io.emit('table_updated', data)
  })
})

// Rutas de prueba
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'API funcionando correctamente ✅', timestamp: new Date().toISOString() })
})

app.get('/api/version', (req: Request, res: Response) => {
  res.json({ version: '1.0.0', name: 'NeoPos API' })
})

// Rutas de autenticación (placeholder)
app.post('/api/auth/login', (req: Request, res: Response) => {
  res.json({
    success: true,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@neopos.com',
      role: 'admin',
    },
  })
})

// Rutas de productos (placeholder)
app.get('/api/products', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Ceviche de Pescado',
        price: 25.90,
        categoryId: '1',
        available: true,
      },
      {
        id: '2',
        name: 'Lomo Saltado',
        price: 32.0,
        categoryId: '2',
        available: true,
      },
    ],
  })
})

// Rutas de mesas (placeholder)
app.get('/api/tables', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: '1', number: 1, seats: 2, status: 'free' },
      { id: '2', number: 2, seats: 4, status: 'occupied' },
      { id: '3', number: 3, seats: 6, status: 'free' },
    ],
  })
})

// Rutas de órdenes (placeholder)
app.post('/api/orders', (req: Request, res: Response) => {
  const order = {
    id: `ORD-${Date.now()}`,
    items: req.body.items || [],
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  res.json({ success: true, data: order })
})

// Rutas de SUNAT (placeholder)
app.post('/api/sunat/send', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: `DOC-${Date.now()}`,
      status: 'pending',
      message: 'Enviado a SUNAT para procesamiento',
    },
  })
})

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err)
  res.status(500).json({ success: false, error: 'Error interno del servidor' })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' })
})

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║          🚀 NeoPos API Iniciado Correctamente            ║
╠═══════════════════════════════════════════════════════════╣
║  Servidor:  http://localhost:${PORT}                         ║
║  WebSocket: ws://localhost:${PORT}                           ║
║  Ambiente:  ${process.env.NODE_ENV || 'development'}                         ║
╚═══════════════════════════════════════════════════════════╝
  `)
})

export { app, io }
