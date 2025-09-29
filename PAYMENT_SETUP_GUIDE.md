# Guía de Configuración para Pagos Reales - L&S Plastics

## 🔧 CONFIGURACIÓN REQUERIDA PARA PAGOS REALES

### 1. STRIPE (Tarjetas de Crédito/Débito)
Para procesar tarjetas reales, necesitas:

**Crear cuenta en Stripe:**
1. Ve a https://stripe.com
2. Crea una cuenta de negocio
3. Completa la verificación de identidad
4. Obtén tus claves API:
   - Clave Pública: `pk_live_...`
   - Clave Secreta: `sk_live_...`

**Configurar en .env.local:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_aqui
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_aqui
```

### 2. PAYPAL
Para procesar pagos reales con PayPal:

**Crear cuenta PayPal Business:**
1. Ve a https://developer.paypal.com
2. Crea una aplicación
3. Obtén tus credenciales:
   - Client ID
   - Client Secret

**Configurar en .env.local:**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_aqui
PAYPAL_CLIENT_SECRET=tu_client_secret_aqui
```

### 3. GOOGLE PAY
Para procesar pagos con Google Pay:

**Configurar Google Pay Console:**
1. Ve a https://pay.google.com/business/console
2. Registra tu negocio
3. Obtén tu Merchant ID

**Configurar en .env.local:**
```
NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID=tu_merchant_id_aqui
NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT=PRODUCTION
```

### 4. CONFIGURACIÓN GENERAL
```
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
CURRENCY=USD
NODE_ENV=production
```

## 🚀 PASOS PARA ACTIVAR PAGOS REALES

### Paso 1: Reemplazar credenciales
Edita el archivo `.env.local` con tus credenciales reales

### Paso 2: Verificar dominios
- Agrega tu dominio a las configuraciones de Stripe
- Configura webhooks en PayPal
- Verifica tu dominio en Google Pay

### Paso 3: Probar en modo sandbox
Antes de producción, prueba con credenciales de sandbox

### Paso 4: Activar producción
Cambia `NODE_ENV=production` y usa claves live

## ⚠️ IMPORTANTE PARA PRODUCCIÓN

### Seguridad:
- Nunca expongas claves secretas en el frontend
- Usa HTTPS obligatorio para pagos reales
- Implementa webhooks para confirmaciones

### Cumplimiento:
- Registro PCI DSS si procesas tarjetas
- Términos y condiciones actualizados
- Política de privacidad y reembolsos

### Monitoreo:
- Logs de transacciones
- Alertas de pagos fallidos
- Dashboard de métricas

## 📧 SOPORTE
Para ayuda con la configuración, contacta:
- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/docs
- Google Pay: https://developers.google.com/pay
