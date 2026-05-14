# ⚡ Quick Start - NeoPos en 5 minutos

## 🚀 Opción 1: Con Docker (Recomendado)

### Paso 1: Preparación (1 min)
```bash
# Clonar o descargar proyecto
cd Sistema

# Crear archivos de entorno
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
EOF

cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=neopos_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION=7d
EOF
```

### Paso 2: Ejecutar (1 min)
```bash
# Iniciar servicios
docker-compose up -d

# Esperar 20 segundos a que todo inicie
sleep 20
```

### Paso 3: Verificar (1 min)
```bash
# Ver logs
docker-compose logs -f

# O en otra terminal
docker-compose ps
```

### Paso 4: Acceder (2 min)
Abre en tu navegador:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Nginx | http://localhost |
| Database | localhost:5432 |

**Credenciales de Acceso:**
```
Usuario: admin
Contraseña: admin
```

---

## 🛠️ Opción 2: Sin Docker (Desarrollo Local)

### Requisitos
- Node.js 20+
- PostgreSQL 12+

### Frontend (1 min)
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### Backend (1 min)
En otra terminal:
```bash
cd backend
npm install

# Crear BD
createdb neopos_db
psql neopos_db < ../database/schema.sql

npm run dev
# http://localhost:5000
```

---

## 📋 Checklist de Verificación

- [ ] Frontend cargando en http://localhost:3000
- [ ] Backend respondiendo en http://localhost:5000/health
- [ ] Base de datos conectada y con datos iniciales
- [ ] Puedes hacer login con admin/admin
- [ ] Puedes ver el Dashboard con gráficos
- [ ] Socket.IO conectado (sin errores de conexión)

---

## 🐛 Problemas Comunes

### Error: Puerto ya en uso
```bash
# Cambiar puerto en docker-compose.yml
# O liberar puerto
lsof -i :5000
kill -9 <PID>
```

### Error: Base de datos no conecta
```bash
# Verificar DB está corriendo
docker-compose logs postgres

# Reiniciar
docker-compose down
docker-compose up -d postgres
```

### Error: API no responde
```bash
# Esperar más tiempo (30-40 segundos)
sleep 40

# Verificar logs
docker-compose logs backend
```

---

## 🎮 Probar Funcionalidades

### 1. Dashboard
1. Login en http://localhost:3000
2. Verás gráficos y estadísticas
3. Datos de prueba precargados

### 2. POS (Punto de Venta)
1. Click en "POS" en la barra lateral
2. Selecciona categoría (ej: Entradas)
3. Click en producto para agregar
4. Observa panel derecho con totales
5. Click "Enviar a Cocina"

### 3. Mesas
1. Click en "Mesas"
2. Verás mapa con mesas (verde=libre, rojo=ocupada)
3. Click en mesa para seleccionar
4. Información en tiempo real

### 4. Cocina (KDS)
1. Click en "Cocina"
2. Verás tarjetas de órdenes
3. Click "Preparando" → "Listo"
4. Actualizaciones en tiempo real

### 5. SUNAT
1. Click en "SUNAT"
2. Panel para enviar comprobantes
3. Ingresa DNI para boleta
4. Click "Enviar a SUNAT"

### 6. Caja
1. Click en "Caja"
2. Ver estado (Abierta/Cerrada)
3. Registrar pagos
4. Ver movimientos del día

---

## 📁 Archivos Importantes

```
Sistema/
├── README.md                    # Documentación completa
├── EXECUTION.md                 # Guía detallada
├── ARCHITECTURE.md              # Diagrama arquitectura
├── VISUAL_ARCHITECTURE.md       # Visualización
├── SUNAT_INTEGRATION.md         # Integración SUNAT
├── docker-compose.yml           # Configuración Docker
└── database/schema.sql          # Schema BD
```

---

## 🔥 Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f backend

# Reiniciar base de datos
docker-compose down -v
docker-compose up -d postgres

# Acceder a base de datos
docker-compose exec postgres psql -U postgres neopos_db

# Limpiar todo
docker-compose down -v
docker volume rm sistema_postgres_data

# Build personalizado
docker-compose build --no-cache frontend
docker-compose up -d
```

---

## 📊 Base de Datos

### Conectar a PostgreSQL
```bash
# Mediante Docker
docker-compose exec postgres psql -U postgres neopos_db

# Localmente
psql -h localhost -U postgres -d neopos_db
```

### Queries útiles
```sql
-- Ver usuarios
SELECT id, username, email, role FROM usuarios;

-- Ver productos
SELECT * FROM productos LIMIT 5;

-- Ver pedidos hoy
SELECT * FROM pedidos WHERE DATE(created_at) = TODAY();

-- Ver tabla de mesas
SELECT numero, estado FROM mesas ORDER BY numero;
```

---

## 🌐 Acceso Remoto

### Para acceder desde otra computadora
1. Cambiar `localhost` por IP del servidor
```
http://192.168.1.100:3000  (Frontend)
http://192.168.1.100:5000  (Backend)
```

2. Asegurar firewall permite tráfico
```bash
# Linux
sudo ufw allow 3000
sudo ufw allow 5000
```

---

## 📱 Responsive Design

El sistema está optimizado para:
- 💻 Desktop (1920x1080 recomendado)
- 📱 Tablet (iPad, Android tablets)
- ✅ Touch-friendly
- ✅ Dark mode premium

---

## 🔐 Seguridad

### En Desarrollo
- JWT tokens automáticos
- CORS habilitado
- Variables de entorno

### En Producción
- [ ] Cambiar JWT_SECRET
- [ ] Cambiar DB_PASSWORD
- [ ] Habilitar HTTPS
- [ ] Configurar certificados SSL
- [ ] Actualizar variables SUNAT
- [ ] Habilitar backups

---

## 📞 Soporte Rápido

| Problema | Solución |
|----------|----------|
| No carga | Esperar 30s, F5 refresh |
| API lenta | Reiniciar backend: `docker-compose restart backend` |
| BD lenta | Reiniciar BD: `docker-compose restart postgres` |
| Certificados | Regenerar: `docker-compose down -v && docker-compose up -d` |
| Puertos | Cambiar en `docker-compose.yml` |

---

## 🎯 Próximos Pasos

1. **Explorar código**
   - Frontend: `frontend/src`
   - Backend: `backend/src`

2. **Personalizar**
   - Cambiar colores en `tailwind.config.js`
   - Agregar nuevas páginas
   - Modificar componentes

3. **Integrar SUNAT**
   - Leer `SUNAT_INTEGRATION.md`
   - Obtener credenciales
   - Configurar variables

4. **Deploy**
   - Revisar `EXECUTION.md` sección Deploy
   - Railway.app o DigitalOcean
   - Configurar CI/CD

---

## 🎓 Aprendizaje

Para entender mejor el proyecto:
1. Leer `ARCHITECTURE.md` - Diagrama general
2. Leer `VISUAL_ARCHITECTURE.md` - Stack visual
3. Explorar `frontend/src/pages` - Interfaz
4. Explorar `backend/src` - API
5. Ver `database/schema.sql` - Datos

---

⚡ **¡Sistema listo en 5 minutos!**

¿Necesitas ayuda? Lee los archivos de documentación completos.

Última actualización: Mayo 2024 | v1.0.0
