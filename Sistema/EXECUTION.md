# GUÍA DE EJECUCIÓN - NeoPos

## 🚀 Inicio Rápido (Docker)

### Paso 1: Clonar el repositorio
```bash
git clone <repositorio-url>
cd Sistema
```

### Paso 2: Configurar variables de entorno
```bash
# Frontend
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
EOF

# Backend
cat > backend/.env << EOF
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

DB_HOST=postgres
DB_PORT=5432
DB_NAME=neopos_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=7d

SUNAT_API_URL=https://api.sunat.example.com
SUNAT_USERNAME=your_sunat_username
SUNAT_PASSWORD=your_sunat_password
SUNAT_RUC=your_ruc
EOF
```

### Paso 3: Ejecutar Docker Compose
```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Esperar a que inicie (15-30 segundos)
```

### Paso 4: Acceder
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Nginx**: http://localhost

### Paso 5: Credenciales
```
Usuario: admin
Contraseña: admin
Email: admin@neopos.com
```

---

## 🛠️ Desarrollo Local (Sin Docker)

### Requisitos
- Node.js 20+
- PostgreSQL 12+
- npm o yarn

### Backend

1. **Navegar a carpeta**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Crear base de datos**
```bash
# En PostgreSQL
createdb neopos_db
psql neopos_db < ../database/schema.sql
```

4. **Configurar .env**
```bash
cat > .env << EOF
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=neopos_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=dev_secret_key
JWT_EXPIRATION=7d
EOF
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
# API en http://localhost:5000
```

### Frontend

1. **Navegar a carpeta**
```bash
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar .env**
```bash
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
EOF
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
# Frontend en http://localhost:3000
```

---

## 🐳 Comandos Docker Útiles

### Ver estado
```bash
docker-compose ps
```

### Ver logs
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Acceder a base de datos
```bash
docker-compose exec postgres psql -U postgres neopos_db
```

### Limpiar todo
```bash
docker-compose down -v
```

### Rebuild
```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## 📦 Build para Producción

### Frontend
```bash
cd frontend
npm install
npm run build
# Genera dist/
```

### Backend
```bash
cd backend
npm install
npm run build
# Genera dist/
```

---

## 🔧 Variables de Entorno

### Backend (.env)
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Ambiente | `development`, `production` |
| `PORT` | Puerto del servidor | `5000` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:3000` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Puerto PostgreSQL | `5432` |
| `DB_NAME` | Nombre BD | `neopos_db` |
| `DB_USER` | Usuario BD | `postgres` |
| `DB_PASSWORD` | Contraseña BD | `postgres` |
| `JWT_SECRET` | Clave JWT | (generada) |
| `JWT_EXPIRATION` | Expiración JWT | `7d` |
| `SUNAT_API_URL` | URL SUNAT | `https://api.sunat.gob.pe` |
| `SUNAT_USERNAME` | Usuario SUNAT | (credencial) |
| `SUNAT_PASSWORD` | Contraseña SUNAT | (credencial) |

### Frontend (.env)
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL Backend | `http://localhost:5000/api` |
| `VITE_WS_URL` | URL WebSocket | `http://localhost:5000` |

---

## 📊 Acceso a Base de Datos

### Comandos PostgreSQL

```bash
# Conectar
psql -U postgres -d neopos_db

# Ver tablas
\dt

# Ver esquema
\d usuarios

# Salir
\q
```

### Queries útiles

```sql
-- Ver usuarios
SELECT id, username, email, role FROM usuarios;

-- Ver pedidos de hoy
SELECT * FROM pedidos WHERE DATE(created_at) = TODAY();

-- Ver comprobantes SUNAT
SELECT * FROM comprobantes_sunat ORDER BY created_at DESC;

-- Ingresos por método de pago
SELECT metodo, SUM(monto) FROM pagos GROUP BY metodo;
```

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test
npm run coverage
```

### Backend
```bash
cd backend
npm run test
npm run coverage
```

---

## 🔐 Seguridad en Producción

### Checklist

- [ ] Cambiar JWT_SECRET
- [ ] Cambiar contraseña PostgreSQL
- [ ] Habilitar SSL/TLS en Nginx
- [ ] Configurar CORS adecuadamente
- [ ] Usar variables de entorno secretas
- [ ] Habilitar backups automáticos
- [ ] Configurar firewall
- [ ] Habilitar logs
- [ ] Configurar monitoreo
- [ ] Usar HTTPS en todo

### Generar certificados SSL

```bash
# Auto-signed (desarrollo)
openssl req -x509 -newkey rsa:4096 -keyout docker/ssl/key.pem -out docker/ssl/cert.pem -days 365 -nodes

# Let's Encrypt (producción)
certbot certonly --standalone -d yourdomain.com
```

---

## 📱 Acceso Remoto (Producción)

### Variable FRONTEND_URL
```bash
# Development
FRONTEND_URL=http://localhost:3000

# Production
FRONTEND_URL=https://pos.turestaurante.com
```

### Variable API en Frontend
```bash
# Development
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://api.turestaurante.com/api
```

---

## 🐛 Troubleshooting

### Puerto en uso
```bash
# Cambiar puerto en docker-compose.yml
# O liberar puerto
lsof -i :5000
kill -9 <PID>
```

### Base de datos no conecta
```bash
# Verificar conexión
docker-compose exec backend npm run test:db

# Ver logs
docker-compose logs postgres
```

### Frontend no conecta con API
```bash
# Verificar VITE_API_URL
# Verificar CORS en backend
# Verificar firewall
```

### Certificado SSL inválido
```bash
# Regenerar certificados
rm docker/ssl/*
openssl req -x509 -newkey rsa:4096 -keyout docker/ssl/key.pem -out docker/ssl/cert.pem -days 365 -nodes
docker-compose up -d
```

---

## 📞 Soporte

Para ayuda:
- 📧 Email: soporte@neopos.com
- 💬 Chat: https://chat.neopos.com
- 📚 Docs: https://docs.neopos.com
- 🐛 Issues: https://github.com/neopos/sistema/issues

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2024
