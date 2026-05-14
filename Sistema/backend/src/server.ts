import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import pool from './config/database'

dotenv.config()

const app: Express = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

// Rutas de productos
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre AS name, descripcion AS description, precio::float AS price, categoria_id AS categoryId, imagen_url AS image, disponible AS available
       FROM productos
       WHERE disponible = TRUE
       ORDER BY nombre`
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error al cargar productos:', error)
    res.status(500).json({ success: false, error: 'No se pudo cargar los productos' })
  }
})

// Rutas de mesas
app.get('/api/tables', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, numero AS number, asientos AS seats, 
              CASE estado 
                WHEN 'libre' THEN 'free'
                WHEN 'ocupada' THEN 'occupied'
                WHEN 'reservada' THEN 'reserved'
                WHEN 'pagando' THEN 'paying'
                ELSE estado 
              END AS status, 
              ocupada_desde AS occupiedSince
       FROM mesas
       ORDER BY numero`
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error al cargar mesas:', error)
    res.status(500).json({ success: false, error: 'No se pudo cargar las mesas' })
  }
})

// Crear nueva mesa
app.post('/api/tables', async (req: Request, res: Response) => {
  try {
    const { number, seats } = req.body
    if (!number || !seats) {
      return res.status(400).json({ success: false, error: 'Número y asientos requeridos' })
    }
    const { rows } = await pool.query(
      `INSERT INTO mesas (numero, asientos, estado)
       VALUES ($1, $2, 'libre')
       RETURNING id, numero AS number, asientos AS seats, 'free'::text AS status`,
      [number, seats]
    )
    io.emit('table_created', rows[0])
    res.json({ success: true, data: rows[0] })
  } catch (error: any) {
    console.error('Error al crear mesa:', error)
    res.status(500).json({ success: false, error: error.message || 'No se pudo crear la mesa' })
  }
})

// Obtener órdenes
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const { rows: orders } = await pool.query(
      `SELECT id, mesa_id AS tableId, subtotal::float, igv::float, total::float, 
              CASE estado 
                WHEN 'pendiente' THEN 'pending'
                WHEN 'preparando' THEN 'cooking'
                WHEN 'listo' THEN 'ready'
                WHEN 'pagado' THEN 'paid'
                WHEN 'cancelado' THEN 'cancelled'
                ELSE estado 
              END AS status, 
              metodo_pago AS paymentMethod, created_at AS createdAt
       FROM pedidos
       ORDER BY created_at DESC
       LIMIT 50`
    )
    
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const { rows: items } = await pool.query(
          `SELECT dp.id, dp.producto_id AS productId, p.nombre, dp.cantidad AS quantity, dp.precio_unitario::float AS unitPrice, dp.subtotal::float, dp.observaciones AS observations
           FROM detalle_pedidos dp
           JOIN productos p ON dp.producto_id = p.id
           WHERE dp.pedido_id = $1`,
          [order.id]
        )
        return { ...order, items }
      })
    )
    
    res.json({ success: true, data: ordersWithItems })
  } catch (error) {
    console.error('Error al cargar órdenes:', error)
    res.status(500).json({ success: false, error: 'No se pudo cargar las órdenes' })
  }
})

// Crear orden
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { tableId, items, subtotal, igv, total } = req.body
    
    const { rows: [order] } = await pool.query(
      `INSERT INTO pedidos (mesa_id, usuario_id, subtotal, igv, total, estado)
       VALUES ($1, $2, $3, $4, $5, 'pendiente')
       RETURNING id, mesa_id AS tableId, subtotal::float, igv::float, total::float, 'pending'::text AS status, created_at AS createdAt`,
      [tableId, '1', subtotal, igv, total]
    )

    for (const item of items) {
      await pool.query(
        `INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal, observaciones)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.productId, item.quantity, item.unitPrice, item.subtotal, item.observations || null]
      )
    }

    // Actualizar estado de mesa
    if (tableId) {
      await pool.query(
        `UPDATE mesas SET estado = 'ocupada', ocupada_desde = CURRENT_TIMESTAMP, pedido_actual_id = $1
         WHERE id = $2`,
        [order.id, tableId]
      )
    }

    const fullOrder = { ...order, items }
    io.emit('new_order', fullOrder)
    io.emit('order_created', fullOrder)
    
    res.json({ success: true, data: fullOrder })
  } catch (error: any) {
    console.error('Error al crear orden:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Actualizar estado de orden
app.put('/api/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const statusMap: { [key: string]: string } = {
      'pending': 'pendiente',
      'cooking': 'preparando',
      'ready': 'listo',
      'paid': 'pagado',
      'cancelled': 'cancelado',
    }
    
    const dbStatus = statusMap[status] || status

    const { rows } = await pool.query(
      `UPDATE pedidos SET estado = $1 WHERE id = $2
       RETURNING id, mesa_id AS tableId, 
                  CASE estado 
                    WHEN 'pendiente' THEN 'pending'
                    WHEN 'preparando' THEN 'cooking'
                    WHEN 'listo' THEN 'ready'
                    WHEN 'pagado' THEN 'paid'
                    WHEN 'cancelado' THEN 'cancelled'
                    ELSE estado 
                  END AS status`,
      [dbStatus, id]
    )

    if (rows.length > 0) {
      io.emit('order_updated', { orderId: id, status })
    }
    
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error('Error al actualizar orden:', error)
    res.status(500).json({ success: false, error: 'No se pudo actualizar la orden' })
  }
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, error: 'Error interno del servidor' })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' })
})

// Iniciar servidor
const startServer = async () => {
  try {
    const client = await pool.connect()
    client.release()

    httpServer.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║          🚀 NeoPos API Iniciado Correctamente            ║
╠═══════════════════════════════════════════════════════════╣
║  Servidor:  http://localhost:${PORT}                         ║
║  WebSocket: ws://localhost:${PORT}                           ║
║  BD: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'neopos_db'}
║  Ambiente:  ${process.env.NODE_ENV || 'development'}                         ║
╚═══════════════════════════════════════════════════════════╝
  `)
    })
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error)
    process.exit(1)
  }
}

startServer()

export { app, io }
