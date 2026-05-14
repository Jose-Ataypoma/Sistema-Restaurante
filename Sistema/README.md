# NeoPos - Sistema POS Premium para Restaurantes en Perú

Sistema moderno de Punto de Venta (POS) para restaurantes pequeños en Perú, integrado con SUNAT para facturación electrónica. Construido con tecnologías actuales: React, TypeScript, TailwindCSS, Express.js, PostgreSQL, Socket.IO, JWT, Docker y Nginx.

## 🎯 Características Principales

### Dashboard
- 📊 Análisis de ventas en tiempo real
- 📈 Gráficos de productos más vendidos
- 💰 Resumen de métodos de pago
- 🎯 KPIs diarios

### Gestión de Mesas
- 🪑 Mapa visual de mesas del restaurante
- 🟢 Estados: Libre, Ocupada, Pagando
- ⏱️ Contador de tiempo de ocupación
- 📋 Información de pedidos por mesa

### Punto de Venta (POS)
- 🛒 Carrito de compras interactivo
- 📦 Gestión de productos por categorías
- 💵 Cálculo automático de totales e IGV
- 📝 Observaciones por artículo

### Cocina (KDS - Kitchen Display System)
- 📋 Pedidos en tiempo real con Socket.IO
- ⏳ Alertas de pedidos urgentes
- 🔴 Estados: Pendiente, Preparando, Listo
- 🔔 Notificaciones en tiempo real

### Facturación SUNAT
- 📄 Boleta electrónica
- 📋 Factura electrónica
- ✅ Validación automática SUNAT
- 🔗 Integración API SUNAT
- 📊 Historial de comprobantes

### Caja
- 💰 Apertura y cierre de caja
- 💵 Métodos de pago (Efectivo, Tarjeta, Yape, Plin)
- 🧮 Cálculo de vuelto
- 📊 Informe diario de movimientos

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI moderna
- **TypeScript** - Type safety
- **TailwindCSS** - Estilos premium
- **Vite** - Bundler rápido
- **Zustand** - State management
- **Recharts** - Gráficos
- **Socket.IO Client** - Tiempo real

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **TypeScript** - Type safety
- **Socket.IO** - WebSockets
- **JWT** - Autenticación
- **PostgreSQL** - Base de datos

### Infraestructura
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Nginx** - Reverse proxy
- **PostgreSQL** - Base de datos

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- Node.js 20+
- Docker y Docker Compose
- Git

### Instalación Local (Sin Docker)

1. **Clonar repositorio**
```bash
git clone <repo-url>
cd Sistema
```

2. **Frontend**
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

3. **Backend**
```bash
cd ../backend
npm install
npm run dev
# http://localhost:5000
```

4. **Base de datos**
```bash
# Crear base de datos y ejecutar schema.sql
psql -U postgres -d neopos_db -f ../database/schema.sql
```

### Instalación con Docker

1. **Clonar repositorio**
```bash
git clone <repo-url>
cd Sistema
```

2. **Variables de entorno**
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

3. **Ejecutar Docker Compose**
```bash
docker-compose up -d
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Nginx: http://localhost

### Base de Datos

La base de datos se inicializa automáticamente con Docker Compose. Para inicializar manualmente:

```bash
psql -U postgres -h localhost -d neopos_db -f database/schema.sql
```

## 📁 Estructura del Proyecto

```
Sistema/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/          # Páginas principales
│   │   ├── hooks/          # Custom hooks (Zustand)
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Utilidades
│   │   └── App.tsx         # Componente principal
│   ├── public/             # Assets
│   └── package.json
├── backend/                # API Express
│   ├── src/
│   │   ├── routes/         # Rutas API
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de BD
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Servicios
│   │   ├── config/         # Configuración
│   │   └── server.ts       # Servidor principal
│   └── package.json
├── database/               # Scripts SQL
│   └── schema.sql         # Schema PostgreSQL
├── docker/                # Configuración Docker
│   ├── nginx.conf         # Configuración Nginx
│   └── ssl/               # Certificados SSL
├── docker-compose.yml     # Orquestación
└── .gitignore
```

## 🔑 Credenciales por Defecto

Usuario: `admin`  
Contraseña: `admin`  
Email: `admin@neopos.com`

⚠️ **Cambiar credenciales en producción**

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Perfil actual

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar
- `DELETE /api/products/:id` - Eliminar

### Mesas
- `GET /api/tables` - Listar mesas
- `PUT /api/tables/:id` - Actualizar mesa

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido
- `PUT /api/orders/:id` - Actualizar pedido

### SUNAT
- `POST /api/sunat/send` - Enviar comprobante
- `GET /api/sunat/documents` - Historial

### Caja
- `POST /api/cash/open` - Abrir caja
- `POST /api/cash/close` - Cerrar caja

## 🔄 WebSocket Events (Socket.IO)

```javascript
// Servidor escucha
socket.on('new_order', (order) => {...})
socket.on('order_status_change', (data) => {...})
socket.on('table_status_change', (data) => {...})

// Cliente emite
io.emit('order_created', order)
io.emit('order_updated', data)
io.emit('table_updated', data)
```

## 🎨 Tema y Estilos

### Colores
- **Negro/Gris**: `#0a0a0a`, `#0f0f0f`, `#1a1a1a`
- **Morado Neón**: `#b833ff`
- **Rosa Neón**: `#ff00ff`
- **Cyan Neón**: `#00ffff`
- **Verde Éxito**: `#10b981`
- **Rojo Peligro**: `#ef4444`
- **Amarillo Alerta**: `#fbbf24`

### Fuentes
- Sistema: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- Escala: TailwindCSS

## 🔐 Seguridad

- ✅ JWT para autenticación
- ✅ Bcrypt para contraseñas
- ✅ CORS habilitado
- ✅ Validación de entrada
- ✅ Variables de entorno
- ✅ SSL/TLS en producción

## 📊 Requisitos SUNAT

Para la integración con SUNAT:
1. Tener credenciales de SUNAT
2. RUC del restaurante registrado
3. Certificado digital válido
4. Datos correctos de razón social

## 🚀 Deployment

### Railway.app
```bash
git push
# Railway detecta y despliega automáticamente
```

### DigitalOcean
```bash
# Crear droplet Ubuntu 22.04
# SSH al servidor
git clone <repo-url>
cd Sistema
docker-compose up -d
```

### Producción
- Cambiar `NODE_ENV` a `production`
- Usar variables de entorno seguras
- Configurar HTTPS/SSL
- Habilitar backups de BD
- Configurar monitoreo

## 📝 Licencia

Propiedad Privada - Sistema POS Premium

## 👥 Contacto

Para soporte: contacto@neopos.com

---

**Hecho con ❤️ para restaurantes en Perú**
