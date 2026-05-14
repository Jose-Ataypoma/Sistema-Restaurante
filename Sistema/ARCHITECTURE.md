# Arquitectura del Sistema NeoPos

## Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTE - NAVEGADOR                           │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │        React 18 + TypeScript + TailwindCSS                   │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │  │
│  │  │   Dashboard    │  │   Mesas/POS    │  │   Cocina KDS │  │  │
│  │  │   Reportes     │  │   Punto Venta  │  │   Órdenes RT │  │  │
│  │  │   Analítica    │  │   Carrito      │  │   Estados    │  │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │        SUNAT │ CAJA │ PRODUCTOS │ CONFIGURACIÓN    │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  Estado: Zustand | Socket.IO Client                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP/HTTPS
                               │ WebSocket
                               ▼
         ┌─────────────────────────────────────────────────┐
         │              NGINX (Reverse Proxy)              │
         │  - SSL/TLS Termination                          │
         │  - Load Balancing                               │
         │  - Caching                                      │
         │  - Compression (gzip)                           │
         └──────────┬──────────────────────┬───────────────┘
                    │ HTTP                 │ HTTP
                    ▼                       ▼
       ┌──────────────────────┐   ┌──────────────────────┐
       │  FRONTEND - PORT 3000 │   │  BACKEND - PORT 5000 │
       │  ├─ Node.js          │   │  ├─ Node.js          │
       │  ├─ Vite             │   │  ├─ Express.js       │
       │  └─ Dist files       │   │  ├─ Socket.IO        │
       └──────────────────────┘   │  ├─ JWT Auth         │
                                  │  ├─ CORS             │
                                  │  └─ API Routes       │
                                  └──────────┬───────────┘
                                             │ TCP
                                             ▼
                                  ┌──────────────────────┐
                                  │   PostgreSQL DB      │
                                  │  ├─ usuarios         │
                                  │  ├─ productos        │
                                  │  ├─ categorías       │
                                  │  ├─ pedidos          │
                                  │  ├─ mesas            │
                                  │  ├─ pagos            │
                                  │  ├─ cajas            │
                                  │  ├─ clientes         │
                                  │  └─ comprobantes     │
                                  └──────────────────────┘

         ┌────────────────────────────────────────────────┐
         │     INTEGRACIONES EXTERNAS                    │
         ├────────────────────────────────────────────────┤
         │ 🌐 SUNAT API (Facturación Electrónica)        │
         │    - Validación DNI/RUC                       │
         │    - Envío de comprobantes                    │
         │    - Estado de operaciones                    │
         │                                                │
         │ 📊 Almacenamiento en la Nube (Opcional)       │
         │    - Railway.app / DigitalOcean               │
         │    - Backups automáticos                      │
         └────────────────────────────────────────────────┘
```

## Flujo de Datos - Pedido Completo

```
1. CLIENTE SELECCIONA PRODUCTOS
   ┌─────────────────┐
   │  React POS Page │
   └────────┬────────┘
            │ (localStorage + Zustand)
            ▼
   ┌─────────────────┐
   │   Shopping Cart │ (en el navegador)
   └────────┬────────┘
            │

2. ENVÍO A COCINA
   ┌─────────────────┐
   │  POST /api/orders─────────┐
   └────────┬────────┘          │
            │                    │
            ▼                    ▼
   ┌─────────────────┐    ┌──────────────────┐
   │  Express.js API │───▶│  PostgreSQL DB   │
   │  (validate)     │    │  (save order)    │
   └────────┬────────┘    └──────────────────┘
            │
            │ Socket.IO emit
            ▼
   ┌─────────────────┐
   │   KDS (Cocina)  │ (Notificación en tiempo real)
   │   Display       │
   └────────┬────────┘
            │

3. COCINA PROCESA
   ┌─────────────────┐
   │  Chef actualiza │
   │  estado orden   │
   └────────┬────────┘
            │ PUT /api/orders/:id
            ▼
   ┌──────────────────────┐
   │  Backend actualiza BD│
   │  (cooking → ready)   │
   └────────┬─────────────┘
            │ Socket.IO
            ▼
   ┌──────────────────────┐
   │ Salón se notifica    │
   │ (Pedido listo!)      │
   └──────────────────────┘

4. PAGO Y FACTURACIÓN
   ┌─────────────────┐
   │  Cliente paga   │
   │  (método)       │
   └────────┬────────┘
            │
            ▼
   ┌──────────────────────┐
   │ POST /api/sunat/send │
   │ (DNI/RUC)            │
   └────────┬─────────────┘
            │ HTTPS
            ▼
   ┌──────────────────────┐
   │     SUNAT API        │
   │  (Validación)        │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │  Comprobante        │
   │  (Boleta/Factura)   │
   │  + QR Code          │
   └──────────────────────┘

5. CIERRE DE CAJA
   ┌─────────────────┐
   │  POST /api/cash │
   │  /close         │
   └────────┬────────┘
            │
            ▼
   ┌──────────────────────┐
   │  Informe Diario      │
   │  (Métodos de pago)   │
   │  (Totales)           │
   └──────────────────────┘
```

## Componentes Principales

### Frontend
```
src/
├── components/
│   ├── Sidebar.tsx          # Navegación principal
│   ├── Header.tsx           # Barra superior
│   ├── TableMap.tsx         # Mapa de mesas
│   ├── ProductCard.tsx      # Tarjeta producto
│   ├── OrderPanel.tsx       # Panel de pedido
│   ├── KitchenOrderCard.tsx # Tarjeta cocina
│   ├── SunatPanel.tsx       # Panel SUNAT
│   └── CashRegister.tsx     # Registro de caja
├── pages/
│   ├── Dashboard.tsx        # Dashboard analítico
│   ├── TablesPage.tsx       # Gestión de mesas
│   ├── POSPage.tsx          # Punto de venta
│   ├── KitchenPage.tsx      # KDS Cocina
│   ├── SUNATPage.tsx        # Facturación
│   └── CashPage.tsx         # Caja
├── hooks/
│   └── useStore.ts          # Zustand stores
├── types/
│   └── index.ts             # Tipos TypeScript
└── utils/
    ├── api.ts               # Cliente API
    └── constants.ts         # Constantes
```

### Backend
```
src/
├── routes/                  # Rutas API
├── controllers/             # Lógica de negocio
├── models/                  # Modelos BD
├── middleware/              # Auth, validación
├── services/                # Servicios (SUNAT, etc)
├── config/                  # Configuración
└── server.ts                # Entrada principal
```

## Base de Datos - Diagrama ER

```
┌─────────────────┐
│    USUARIOS     │
├─────────────────┤
│ id (UUID) - PK  │
│ username        │◄─────────────────────┐
│ email           │                      │
│ password_hash   │                      │
│ role            │                      │
│ status          │                      │
└─────────────────┘                      │
         △                               │
         │ (1)                           │
         │                               │
         │ (N)                           │
    ┌────────────────┐                   │
    │     PEDIDOS    │◄──────────────────┘
    ├────────────────┤
    │ id (UUID) - PK │
    │ mesa_id ──────┐│
    │ usuario_id ───┘│
    │ subtotal       │
    │ igv            │
    │ total          │
    │ estado         │
    │ metodo_pago    │
    └────┬───────────┘
         │ (1)
         │
         │ (N)
    ┌────────────────────┐
    │ DETALLE_PEDIDOS    │
    ├────────────────────┤
    │ id (UUID) - PK     │
    │ pedido_id ──────┐  │
    │ producto_id ───┐│  │
    │ cantidad       ││  │
    │ precio_unitario││  │
    │ subtotal       ││  │
    │ observaciones  ││  │
    └────────────────┘│  │
                      │  │
                      │  └─────┐
    ┌─────────────────┐         │
    │   PRODUCTOS     │◄────────┘
    ├─────────────────┤
    │ id (UUID) - PK  │
    │ nombre          │
    │ descripcion     │
    │ precio          │
    │ categoria_id ───┐
    │ disponible      │
    │ stock           │
    └─────────────────┘
                   △
                   │ (N)
                   │ (1)
    ┌──────────────────┐
    │   CATEGORIAS     │
    ├──────────────────┤
    │ id (UUID) - PK   │
    │ nombre           │
    │ icono            │
    │ color            │
    │ orden            │
    └──────────────────┘

    ┌─────────────────┐
    │     MESAS       │
    ├─────────────────┤
    │ id (UUID) - PK  │
    │ numero          │
    │ asientos        │
    │ estado          │
    │ ocupada_desde   │
    │ pedido_actual───┼──────┐
    └─────────────────┘      │
                             ▼
                     (Relación a PEDIDOS)

    ┌─────────────────┐
    │     PAGOS       │
    ├─────────────────┤
    │ id (UUID) - PK  │
    │ pedido_id ──────┼──────┐
    │ metodo          │      │
    │ monto           │      ▼
    │ vuelto          │  (PEDIDOS)
    └─────────────────┘

    ┌──────────────────────┐
    │ COMPROBANTES_SUNAT   │
    ├──────────────────────┤
    │ id (UUID) - PK       │
    │ tipo                 │
    │ numero               │
    │ pedido_id ───────────┼──────┐
    │ ruc                  │      │
    │ dni                  │      ▼
    │ codigo_qr            │  (PEDIDOS)
    │ estado               │
    │ mensaje_error        │
    └──────────────────────┘

    ┌─────────────────┐
    │     CAJAS       │
    ├─────────────────┤
    │ id (UUID) - PK  │
    │ usuario_id ─────┼──────┐
    │ abierta_en      │      │
    │ cerrada_en      │      ▼
    │ monto_inicial   │  (USUARIOS)
    │ monto_final     │
    │ total_efectivo  │
    │ total_tarjeta   │
    │ estado          │
    └─────────────────┘

    ┌─────────────────┐
    │    CLIENTES     │
    ├─────────────────┤
    │ id (UUID) - PK  │
    │ nombre          │
    │ email           │
    │ telefono        │
    │ ruc             │
    │ dni             │
    │ direccion       │
    │ activo          │
    └─────────────────┘
```

## Flujo de Autenticación

```
1. LOGIN
   ┌────────────┐
   │ Credenciales│
   │(user, pwd)  │
   └─────┬──────┘
         │ POST /api/auth/login
         ▼
   ┌─────────────────┐
   │ Express Backend │
   │ - Hash Check    │
   │ - JWT Generate  │
   └─────┬───────────┘
         │ Token JWT
         ▼
   ┌─────────────────┐
   │ React App       │
   │ - localStorage  │
   │ - Zustand Auth  │
   └─────────────────┘

2. REQUESTS AUTENTICADOS
   ┌───────────────────────────┐
   │ Header: Authorization     │
   │ Bearer <JWT_TOKEN>        │
   └─────────┬─────────────────┘
             │
             ▼
   ┌─────────────────────────────┐
   │ Express Middleware          │
   │ - Verificar JWT             │
   │ - Extraer usuario_id        │
   │ - Continuar si válido       │
   └─────────┬───────────────────┘
             │
             ▼
   ┌──────────────────────┐
   │ Route Handler/       │
   │ Controller           │
   └──────────────────────┘
```

## Deployments Soportados

### Local Development
- npm dev (frontend y backend)
- PostgreSQL local
- Socket.IO directo

### Docker Compose
- 3 contenedores: Frontend, Backend, PostgreSQL
- 1 contenedor Nginx (proxy)
- Volúmenes persistentes
- Network bridge

### Railway.app
- Uno-click deploy
- PostgreSQL managed
- Automático CI/CD

### DigitalOcean
- Droplet Ubuntu
- Docker instalado
- Manual setup

---

**Última actualización**: Mayo 2024
