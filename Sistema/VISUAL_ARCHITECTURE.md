# 🏗️ Sistema POS - Visualización de Arquitectura

## 🎯 Vista de Alto Nivel

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         CLIENTE (NAVEGADOR)                          ┃
┃  ┌────────────────────────────────────────────────────────────────┐ ┃
┃  │  React 18 • TypeScript • TailwindCSS • Vite                   │ ┃
┃  │                                                                │ ┃
┃  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ ┃
┃  │  │  📊         │  │  🛒          │  │  👨‍🍳        │       │ ┃
┃  │  │  Dashboard  │  │  POS / Mesas │  │  Cocina KDS  │       │ ┃
┃  │  │             │  │              │  │              │       │ ┃
┃  │  │  • Ventas   │  │  • Productos │  │  • Órdenes   │       │ ┃
┃  │  │  • Gráficos │  │  • Carrito   │  │  • Estados   │       │ ┃
┃  │  │  • KPIs     │  │  • Totales   │  │  • Tiempo    │       │ ┃
┃  │  └──────────────┘  └──────────────┘  └──────────────┘       │ ┃
┃  │                                                                │ ┃
┃  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ ┃
┃  │  │  💵          │  │  📄          │  │  ⚙️          │       │ ┃
┃  │  │  Caja        │  │  SUNAT       │  │  Config      │       │ ┃
┃  │  │              │  │              │  │              │       │ ┃
┃  │  │  • Pagos     │  │  • Factura   │  │  • Usuarios  │       │ ┃
┃  │  │  • Métodos   │  │  • Boleta    │  │  • Empresa   │       │ ┃
┃  │  │  • Efectivo  │  │  • QR        │  │  • Sistema   │       │ ┃
┃  │  └──────────────┘  └──────────────┘  └──────────────┘       │ ┃
┃  │                                                                │ ┃
┃  │  Estado Global: Zustand                                       │ ┃
┃  │  WebSocket: Socket.IO Client                                  │ ┃
┃  └────────────────────────────────────────────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                            HTTP/HTTPS ↕
                           WebSocket ↕
         ┌─────────────────────────────────────────────┐
         │  NGINX - Reverse Proxy (Puerto 80/443)     │
         │  • SSL/TLS Termination                      │
         │  • Load Balancing                           │
         │  • Caching Static                           │
         │  • Gzip Compression                         │
         └──────────┬──────────────────┬───────────────┘
                    │ HTTP             │ HTTP
        ┌───────────┴────────┐  ┌──────┴───────────────┐
        │ Frontend - 3000    │  │ Backend - 5000       │
        ├────────────────────┤  ├─────────────────────┤
        │ Node.js / Vite     │  │ Node.js / Express   │
        │ Dist Files         │  │ Socket.IO           │
        │ Static Serving     │  │ JWT Auth            │
        │                    │  │ CORS                │
        │ HTTP → Browser     │  │ REST API            │
        └────────────────────┘  └──────────┬──────────┘
                                           │ TCP
                                ┌──────────┴──────────┐
                                │  PostgreSQL (5432) │
                                ├────────────────────┤
                                │ • Usuarios         │
                                │ • Productos        │
                                │ • Pedidos          │
                                │ • Mesas            │
                                │ • Pagos            │
                                │ • SUNAT Docs       │
                                │ • Caja             │
                                │ • Clientes         │
                                └────────────────────┘

        ┌──────────────────────────────────────────────┐
        │  INTEGRACIONES EXTERNAS                     │
        ├──────────────────────────────────────────────┤
        │ 🌐 SUNAT API                                 │
        │    • Validación DNI/RUC                      │
        │    • Envío Comprobantes                      │
        │    • Estado Operaciones                      │
        └──────────────────────────────────────────────┘
```

---

## 📊 Stack Tecnológico Resumido

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND - Experiencia Visual Premium                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ React 18.2.0         - UI Framework              │  │
│  │ TypeScript 5.2       - Type Safety               │  │
│  │ TailwindCSS 3.3      - Styling (Dark Mode)       │  │
│  │ Vite 5.0             - Ultra Fast Bundler        │  │
│  │ Zustand 4.4          - State Management          │  │
│  │ Recharts 2.10        - Charts & Graphs           │  │
│  │ Socket.IO Client 4.7 - Real-time Updates        │  │
│  │ Axios 1.6            - HTTP Client               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BACKEND - API Robusta y Escalable                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Node.js 20 (LTS)     - Runtime                   │  │
│  │ Express.js 4.18      - Web Framework             │  │
│  │ TypeScript 5.2       - Type Safety               │  │
│  │ Socket.IO 4.7        - Real-time WebSockets      │  │
│  │ PostgreSQL (pg)      - Database Driver           │  │
│  │ JWT                  - Authentication            │  │
│  │ Bcrypt               - Password Hashing          │  │
│  │ CORS                 - Cross-Origin Support      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BASE DE DATOS - PostgreSQL 16                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 8 Tablas Principales                              │  │
│  │ Índices para Performance                          │  │
│  │ Relaciones Foreign Key                            │  │
│  │ Timestamps automáticos                           │  │
│  │ UUID como Primary Keys                           │  │
│  │ Transacciones ACID                               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  INFRAESTRUCTURA - Containerización & Orquestación      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Docker              - Containerización            │  │
│  │ Docker Compose      - Orquestación Local         │  │
│  │ Nginx               - Reverse Proxy              │  │
│  │ SSL/TLS             - Encriptación               │  │
│  │ Volúmenes           - Persistencia de datos      │  │
│  │ Networks            - Comunicación entre        │  │
│  │                       contenedores               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Tema Visual

```
┌──────────────────────────────────────────────────────────┐
│  DARK MODE PREMIUM - Colores Corporativos               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Fondo:      █████ #0a0a0a (Negro Ultra Profundo)      │
│  Card:       ████▓ #1a1a1a (Gris Oscuro)               │
│  Border:     ███░░ #2a2a2a (Gris)                      │
│  Primario:   ███░░ #b833ff (Morado Neón) ✨            │
│  Secundario: ██░░░ #00ffff (Cyan Neón) 💫              │
│  Éxito:      ██░░░ #10b981 (Verde Esmeralda) ✅        │
│  Error:      ██░░░ #ef4444 (Rojo Alerta) ❌            │
│  Alerta:     ██░░░ #fbbf24 (Amarillo) ⚠️               │
│                                                          │
│  Estilo:     SaaS Moderno                              │
│  Fuente:     -apple-system, BlinkMacSystemFont         │
│  Redondes:   12px (lg), 8px (md), 4px (sm)             │
│  Sombras:    Glow neon para efectos premium             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Datos Principales

### 1️⃣ Flujo POS Básico
```
Usuario selecciona producto
    ↓
Producto agregado a carrito (Zustand)
    ↓
Panel derecha actualiza totales
    ↓
Usuario presiona "Enviar a Cocina"
    ↓
POST /api/orders
    ↓
Backend valida y guarda
    ↓
Socket.IO emite evento
    ↓
Cocina recibe notificación (KDS)
```

### 2️⃣ Flujo de Facturación SUNAT
```
Cliente paga
    ↓
Usuario ingresa DNI/RUC
    ↓
Sistema valida formato
    ↓
Prepara comprobante (Boleta/Factura)
    ↓
POST /api/sunat/send
    ↓
Backend → SUNAT API (HTTPS)
    ↓
SUNAT responde (Aceptado/Rechazado)
    ↓
Genera código QR
    ↓
Guarda en BD
    ↓
Imprime/Envía al cliente
```

### 3️⃣ Flujo Tiempo Real (WebSocket)
```
Evento en Cocina
    ↓
Chef presiona "Listo"
    ↓
socket.emit('order_status_change')
    ↓
Backend recibe y actualiza BD
    ↓
io.emit() a todos conectados
    ↓
Frontend (Salón) se notifica
    ↓
UI actualiza en tiempo real
```

---

## 📦 Estructura de Carpetas

```
Sistema/
│
├── 📁 frontend/                    # Aplicación React
│   ├── src/
│   │   ├── 📁 components/         # Componentes React reutilizables
│   │   │   ├── Sidebar.tsx        # Navegación lateral
│   │   │   ├── Header.tsx         # Barra superior
│   │   │   ├── TableMap.tsx       # Mapa de mesas
│   │   │   ├── ProductCard.tsx    # Tarjeta de producto
│   │   │   ├── OrderPanel.tsx     # Panel de pedido
│   │   │   ├── KitchenOrderCard   # Tarjeta cocina
│   │   │   ├── SunatPanel.tsx     # Panel SUNAT
│   │   │   └── CashRegister.tsx   # Registro caja
│   │   │
│   │   ├── 📁 pages/              # Páginas/Vistas
│   │   │   ├── Dashboard.tsx      # Dashboard principal
│   │   │   ├── TablesPage.tsx     # Gestión mesas
│   │   │   ├── POSPage.tsx        # Punto de venta
│   │   │   ├── KitchenPage.tsx    # Cocina KDS
│   │   │   ├── SUNATPage.tsx      # Facturación SUNAT
│   │   │   └── CashPage.tsx       # Caja
│   │   │
│   │   ├── 📁 hooks/              # Custom React Hooks
│   │   │   └── useStore.ts        # Zustand stores
│   │   │
│   │   ├── 📁 types/              # Tipos TypeScript
│   │   │   └── index.ts           # Definiciones de tipos
│   │   │
│   │   ├── 📁 utils/              # Utilidades
│   │   │   ├── api.ts             # Cliente API
│   │   │   └── constants.ts       # Constantes
│   │   │
│   │   ├── App.tsx                # Componente raíz
│   │   ├── App.css                # Estilos globales
│   │   └── main.tsx               # Punto de entrada
│   │
│   ├── public/                    # Assets estáticos
│   ├── index.html                 # HTML principal
│   ├── package.json               # Dependencias
│   ├── vite.config.ts             # Config Vite
│   ├── tsconfig.json              # Config TypeScript
│   ├── tailwind.config.js         # Config TailwindCSS
│   ├── postcss.config.js          # Config PostCSS
│   └── .env.example               # Variables ejemplo
│
├── 📁 backend/                    # API Express
│   ├── src/
│   │   ├── 📁 routes/             # Rutas API
│   │   ├── 📁 controllers/        # Lógica de negocios
│   │   ├── 📁 models/             # Modelos BD
│   │   ├── 📁 middleware/         # Auth, validación
│   │   ├── 📁 services/           # Servicios (SUNAT, etc)
│   │   ├── 📁 config/             # Configuración
│   │   └── server.ts              # Servidor principal
│   │
│   ├── package.json               # Dependencias
│   ├── tsconfig.json              # Config TypeScript
│   ├── .env.example               # Variables ejemplo
│   └── Dockerfile                 # Containerización
│
├── 📁 database/                   # Scripts SQL
│   └── schema.sql                 # Schema PostgreSQL
│
├── 📁 docker/                     # Config Docker
│   ├── nginx.conf                 # Config Nginx
│   └── ssl/                       # Certificados SSL
│
├── 📁 .github/                    # Configuración GitHub
│   └── copilot-instructions.md    # Instrucciones Copilot
│
├── docker-compose.yml             # Orquestación
├── .gitignore                     # Git ignore
├── README.md                      # Documentación principal
├── ARCHITECTURE.md                # Diagrama arquitectura
├── EXECUTION.md                   # Guía de ejecución
└── SUNAT_INTEGRATION.md           # Integración SUNAT
```

---

## 🚀 Flujo de Desarrollo

```
Development
    ↓
    ├── npm run dev (Frontend)
    ├── npm run dev (Backend)
    └── PostgreSQL local
    ↓
Testing Local
    ↓
Build
    ├── npm run build (Frontend)
    └── npm run build (Backend)
    ↓
Docker Build
    ├── docker build (Frontend)
    ├── docker build (Backend)
    └── docker-compose build
    ↓
Docker Compose
    ├── Frontend container
    ├── Backend container
    ├── PostgreSQL container
    └── Nginx container
    ↓
Deploy
    ├── Docker registry push
    └── Cloud platform (Railway/DigitalOcean)
```

---

## 🔐 Seguridad por Capas

```
┌─────────────────────────────────────────┐
│ Frontend                                │
│ • Input validation                      │
│ • XSS Prevention (React)                │
│ • CORS preflight                        │
└─────────────────────────────────────────┘
            ↓ HTTPS
┌─────────────────────────────────────────┐
│ Nginx (Reverse Proxy)                   │
│ • SSL/TLS Termination                   │
│ • Rate limiting                         │
│ • Request filtering                     │
└─────────────────────────────────────────┘
            ↓ HTTP
┌─────────────────────────────────────────┐
│ Backend (Express)                       │
│ • JWT Verification                      │
│ • CORS Validation                       │
│ • Input sanitization                    │
│ • SQL Injection Prevention               │
└─────────────────────────────────────────┘
            ↓ TCP
┌─────────────────────────────────────────┐
│ PostgreSQL                              │
│ • User authentication                   │
│ • Row-level security                    │
│ • Encrypted fields                      │
│ • Audit logs                            │
└─────────────────────────────────────────┘
```

---

**Hecho con ❤️ para Restaurantes Peruanos** 🇵🇪

Última actualización: Mayo 2024 | v1.0.0
