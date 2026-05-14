# Integración SUNAT - Guía Técnica

## 📋 Requisitos Previos

1. **Cuenta SUNAT**
   - RUC activo
   - Clave SOL
   - Certificado digital

2. **Datos de Restaurante**
   - Razón social
   - RUC
   - Dirección fiscal
   - Teléfono
   - Email

3. **Configuración API SUNAT**
   - Endpoint de producción o testing
   - Credenciales SOAP/REST
   - Certificado digital

## 🔑 Obtener Credenciales SUNAT

### Paso 1: Ingresar a SUNAT
1. Ir a https://cpe.sunat.gob.pe/
2. Ingresar con usuario y contraseña

### Paso 2: Descargar Certificado
1. Acceder a "Mis datos"
2. Descargar certificado .pfx o .pem
3. Guardar contraseña del certificado

### Paso 3: Configurar en Sistema
```bash
# Backend .env
SUNAT_API_URL=https://cpe.sunat.gob.pe/api
SUNAT_USERNAME=your_ruc
SUNAT_PASSWORD=your_sol_password
SUNAT_RUC=20123456789
SUNAT_CERTIFICATE=path/to/certificate.pem
SUNAT_CERTIFICATE_PASSWORD=cert_password
```

## 📡 API Endpoints SUNAT

### Envío de Comprobante
```typescript
POST /api/sunat/send
Content-Type: application/json

{
  "tipoDocumento": "01",  // 01=Factura, 03=Boleta
  "numero": "F001-00000123",
  "ruc": "20123456789",
  "razonSocial": "Mi Restaurante SAC",
  "direccion": "Calle Principal 123",
  "cliente": {
    "tipoDocumento": "01",  // 01=RUC, 06=DNI
    "documento": "20987654321",
    "razonSocial": "Cliente SA"
  },
  "moneda": "PEN",
  "fechaEmision": "2024-05-13",
  "totalGravado": 450.00,
  "totalIGV": 81.00,
  "totalGratuito": 0,
  "totalDescuento": 0,
  "totalImporte": 531.00,
  "detalles": [
    {
      "cantidad": 2,
      "descripcion": "Ceviche de Pescado",
      "precioUnitario": 25.90,
      "precioVentaUnitario": 25.90,
      "montoDescuento": 0,
      "montoBaseIGV": 25.90,
      "porcentajeIGV": 18,
      "montoIGV": 4.66,
      "montoTotalLinea": 30.56
    }
  ]
}
```

### Respuesta Exitosa
```json
{
  "numeroTicket": "123456789",
  "estado": "ACEPTADO",
  "codigoSeguridad": "12345678",
  "codigoQR": "data:image/png;base64,iVBORw0KG...",
  "enlaceComprobante": "https://cpe.sunat.gob.pe/consulta?ticket=123456789",
  "fecha": "2024-05-13T14:35:00Z"
}
```

## 🔄 Flujo de Facturación

```
1. Usuario selecciona método de pago
   ↓
2. Sistema captura DNI/RUC
   ↓
3. Valida con SUNAT
   ├─ RUC: Obtiene razón social
   └─ DNI: Valida formato
   ↓
4. Prepara comprobante (Boleta/Factura)
   ↓
5. Envía a SUNAT
   ├─ Success: Genera QR
   └─ Error: Muestra mensaje
   ↓
6. Guarda en BD
   ├─ Estado: ACEPTADO/RECHAZADO
   ├─ Número: SUNAT
   └─ QR: Base64
   ↓
7. Imprime/Envía al cliente
   ├─ Comprobante PDF
   └─ Correo electrónico
```

## 🎯 Validaciones

### Validar RUC
```typescript
function validarRUC(ruc: string): boolean {
  // RUC debe tener 11 dígitos
  if (!/^\d{11}$/.test(ruc)) return false
  
  // Validación de dígito verificador
  const digitos = ruc.split('')
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  
  let suma = 0
  for (let i = 0; i < 10; i++) {
    suma += parseInt(digitos[i]) * multiplicadores[i]
  }
  
  const digito = 11 - (suma % 11)
  const dvEsperado = digito === 11 ? 0 : digito === 10 ? 1 : digito
  
  return parseInt(digitos[10]) === dvEsperado
}
```

### Validar DNI
```typescript
function validarDNI(dni: string): boolean {
  // DNI debe tener 8 dígitos
  if (!/^\d{8}$/.test(dni)) return false
  
  const letras = 'TRWAGFPDXYZSNQVHJOE'
  const digito = parseInt(dni) % 23
  
  return letras[digito] === dni[8]
}
```

## 📱 Tipos de Comprobante

### Boleta Electrónica
- **Uso**: Personas naturales
- **Requisito**: DNI
- **Retención**: Sin retención
- **Plazo**: Inmediato

```typescript
{
  tipoDocumento: "03",  // Boleta
  cliente: {
    tipoDocumento: "06",  // DNI
    documento: "12345678"
  }
}
```

### Factura Electrónica
- **Uso**: Empresas
- **Requisito**: RUC
- **Retención**: Posible
- **Plazo**: Hasta 30 días

```typescript
{
  tipoDocumento: "01",  // Factura
  cliente: {
    tipoDocumento: "01",  // RUC
    documento: "20123456789"
  }
}
```

## 💾 Almacenamiento en BD

### Tabla comprobantes_sunat
```sql
CREATE TABLE comprobantes_sunat (
  id UUID PRIMARY KEY,
  tipo VARCHAR(50),           -- 'boleta' | 'factura'
  numero VARCHAR(50) UNIQUE,  -- F001-00000123
  ruc VARCHAR(11),            -- 20123456789
  dni VARCHAR(8),             -- 12345678
  pedido_id UUID,
  codigo_qr TEXT,             -- Base64
  estado VARCHAR(50),         -- 'pending' | 'accepted' | 'rejected'
  numero_ticket VARCHAR(20),  -- De SUNAT
  codigo_seguridad VARCHAR(10), -- De SUNAT
  mensaje_error TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🖨️ Generación de PDF

### Estructura del Comprobante

```
═══════════════════════════════════════════
           MI RESTAURANTE SAC
═══════════════════════════════════════════

RUC: 20123456789
Dirección: Calle Principal 123, Lima

───────────────────────────────────────────
BOLETA ELECTRÓNICA
Número: B001-00000123
Fecha: 2024-05-13 14:35:00
───────────────────────────────────────────

CLIENTE:
Nombre: Juan Pérez García
DNI: 12345678
Dirección: Av. Secundaria 456

───────────────────────────────────────────
DETALLE:
Cantidad | Descripción      | Precio | Subtotal
───────────────────────────────────────────
    2    | Ceviche Pescado  | 25.90  |  51.80
    1    | Lomo Saltado     | 32.00  |  32.00
───────────────────────────────────────────

Subtotal:          S/  83.80
IGV (18%):         S/  15.08
TOTAL:             S/  98.88

───────────────────────────────────────────
Método de Pago: Efectivo

  ┌─────────────────────┐
  │   [   QR CODE   ]   │
  └─────────────────────┘

Código: 12345678
URL: https://cpe.sunat.gob.pe/consulta?...

═══════════════════════════════════════════
Válido como comprobante de pago
```

## 🔗 URLs SUNAT

### Producción
```
API: https://cpe.sunat.gob.pe/api
Web: https://cpe.sunat.gob.pe/
Consulta: https://cpe.sunat.gob.pe/consulta
```

### Testing
```
API: https://cpe-uat.sunat.gob.pe/api
Web: https://cpe-uat.sunat.gob.pe/
Consulta: https://cpe-uat.sunat.gob.pe/consulta
```

## 🧪 Testing SUNAT

### Credenciales de Prueba
```
Usuario: 20000000001MODDATOS
Contraseña: MODDATOS
RUC: 20000000001
```

### Comprobantes de Prueba
```
Factura: F001-00000001
Boleta: B001-00000001
```

## ⚠️ Errores Comunes

### Error: RUC no válido
```
Causa: RUC con dígito verificador incorrecto
Solución: Validar con función validarRUC()
```

### Error: Certificado expirado
```
Causa: Certificado digital vencido
Solución: Renovar en SUNAT
```

### Error: DNI/RUC no existe
```
Causa: Documento no registrado en SUNAT
Solución: Pedir cliente que verifique en SUNAT
```

### Error: Monto inconsistente
```
Causa: Cálculo de IGV incorrecto
Solución: IGV = Subtotal * 0.18
```

## 📊 Monitoreo

### Logs a guardar
```typescript
{
  timestamp: "2024-05-13T14:35:00Z",
  accion: "enviar_comprobante",
  tipo: "boleta",
  ruc_cliente: "20123456789",
  monto: 98.88,
  estado: "enviado",
  respuesta_sunat: "ACEPTADO",
  numero_ticket: "123456789",
  error?: null
}
```

## 🔐 Seguridad

### Proteger Credenciales
- ✅ Usar variables de entorno
- ✅ No subir certificados a Git
- ✅ Encriptar en BD
- ✅ Logs sin datos sensibles
- ✅ HTTPS obligatorio

### Validaciones
- ✅ Validar entrada (RUC/DNI)
- ✅ Validar respuesta SUNAT
- ✅ Validar cálculos
- ✅ Reintentos automáticos
- ✅ Timeout configurado

## 📞 Contacto SUNAT

- **Soporte**: https://www.sunat.gob.pe/
- **Email**: contacto@sunat.gob.pe
- **Teléfono**: (01) 315-0700
- **Horario**: L-V 08:00-17:00

---

**Versión**: 1.0  
**Última actualización**: Mayo 2024
