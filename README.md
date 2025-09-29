# L&S Plastics - E-commerce con Pasarelas de Pago

Este proyecto de Next.js incluye integración completa con múltiples pasarelas de pago: **Stripe**, **PayPal** y **Transferencias Bancarias**.

## 🚀 Características

- ✅ **Stripe**: Pagos con tarjetas de crédito/débito
- ✅ **PayPal**: Pagos con cuenta PayPal
- ✅ **Transferencias Bancarias**: Pagos offline con instrucciones automáticas
- ✅ **Interfaz moderna**: Componentes responsivos y atractivos
- ✅ **Validación de pagos**: Manejo de errores y confirmaciones
- ✅ **API Routes**: Endpoints seguros para procesar pagos

## 📦 Dependencias Incluidas

```json
{
  "@stripe/stripe-js": "^7.9.0",
  "@stripe/react-stripe-js": "^4.0.2",
  "stripe": "^18.5.0",
  "@paypal/react-paypal-js": "^8.9.1"
}
```

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

### 2. Configurar Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Obtén tus claves API (test o producción)
3. Actualiza en `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Configurar PayPal

1. Ve a [PayPal Developer](https://developer.paypal.com/)
2. Crea una aplicación y obtén las credenciales
3. Actualiza en `.env.local`:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_CLIENT_SECRET=tu_client_secret
```

### 4. Configurar Transferencias Bancarias

Edita los datos bancarios en `components/BankTransferCheckout.jsx`:

```javascript
const bankAccounts = [
  {
    bank: 'Tu Banco',
    accountType: 'Cuenta Corriente',
    accountNumber: 'Tu número de cuenta',
    accountHolder: 'Titular de la cuenta',
    identification: 'CUIT/CUIL'
  }
];
```

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── create-payment-intent/     # API para Stripe
│   │   ├── paypal/capture/            # API para PayPal
│   │   └── bank-transfer/create-order/ # API para transferencias
│   └── tienda/
│       └── checkout/                  # Página de checkout
├── components/
│   ├── PaymentGateway.jsx             # Componente principal
│   ├── StripeCheckout.jsx             # Checkout de Stripe
│   ├── PayPalCheckout.jsx             # Checkout de PayPal
│   └── BankTransferCheckout.jsx       # Checkout de transferencias
└── lib/
    ├── stripe.js                      # Configuración Stripe
    └── paypal.js                      # Configuración PayPal
```

## 🔄 Flujo de Pago

### Stripe (Tarjetas)
1. Usuario ingresa datos de tarjeta
2. Se crea Payment Intent en el servidor
3. Stripe procesa el pago
4. Confirmación inmediata

### PayPal
1. Usuario hace clic en botón PayPal
2. Redirige a PayPal para autenticación
3. PayPal procesa el pago
4. Retorna con confirmación

### Transferencia Bancaria
1. Usuario llena formulario con datos
2. Sistema muestra instrucciones de transferencia
3. Cliente realiza transferencia offline
4. Verificación manual del pago

## 🧪 Testing

Para probar los pagos en modo desarrollo:

### Stripe Test Cards
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Error: 4000 0000 0000 0002
```

### PayPal Sandbox
- Usa el entorno sandbox de PayPal
- Crea cuentas de prueba en PayPal Developer

## 🔒 Seguridad

- ✅ Las claves secretas están en el servidor
- ✅ Validación de datos en el backend
- ✅ HTTPS requerido para producción
- ✅ Tokens temporales para pagos

## 📱 Responsive Design

El checkout es completamente responsive y funciona en:
- 📱 Móviles
- 📱 Tablets  
- 💻 Desktop

## 🎨 Personalización

Puedes personalizar los estilos editando:
- `components/PaymentGateway.jsx` - Estilos principales
- `components/StripeCheckout.jsx` - Estilos de Stripe
- `components/PayPalCheckout.jsx` - Estilos de PayPal
- `lib/paypal.js` - Configuración de botones PayPal

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Otros servicios
- Asegúrate de configurar las variables de entorno
- Configura los webhooks de Stripe y PayPal
- Usa HTTPS en producción

## 📞 Soporte

Si necesitas ayuda, contacta a:
- **Email**: info@lsplastics.com  
- **Teléfono**: +1 234-567-8900

## 📄 Licencia

MIT License - Libre para uso comercial y personal.
