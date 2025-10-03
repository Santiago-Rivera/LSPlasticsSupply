# Guía de Despliegue en Vercel - LSPlasticsSupply

## 🚀 Correcciones Aplicadas para el Error "Failed to fetch"

### Cambios Realizados

1. **Actualización de React** (React 19 → React 18)
   - Downgrade a React 18.3.1 y React-DOM 18.3.1 para mejor compatibilidad con Vercel

2. **Configuración de Next.js** (`next.config.mjs`)
   - Eliminada opción obsoleta `swcMinify`
   - Eliminada opción `output: 'standalone'` que causaba problemas
   - Configuración optimizada para Vercel

3. **Archivos Agregados:**
   - `vercel.json` - Configuración específica para Vercel
   - `.vercelignore` - Archivos a ignorar durante el deploy

## 📋 Variables de Entorno en Vercel

Asegúrate de configurar estas variables en el dashboard de Vercel:

```
NEXT_PUBLIC_APP_URL=plasticssupplyls.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXXXX
INSTANCE_ID=vercel_production
```

**Nota:** Reemplaza los valores `XXXXXXXXXX` con tus claves reales de Stripe desde tu archivo `.env.local`

## 🔧 Configuración en Vercel

### Root Directory

./

(O déjalo vacío)

### Build Command

npm run build

### Output Directory

.next

(Automático con Next.js)

### Install Command

npm install

## ✅ Pasos para Desplegar

1. **Commit y Push de los cambios:**

   ```bash
   git add .
   git commit -m "Fix: Vercel deployment configuration"
   git push origin master
   ```

2. **En Vercel Dashboard:**
   - Ve a tu proyecto
   - Click en "Settings" → "Environment Variables"
   - Agrega las 4 variables de entorno listadas arriba
   - Guarda los cambios

3. **Redeploy:**
   - Ve a "Deployments"
   - Click en "Redeploy" en el último deployment
   - O haz un nuevo push al repositorio

## 🐛 Solución de Problemas Comunes

### Error "Failed to fetch" durante build

✅ **SOLUCIONADO** - Downgrade a React 18 y configuración optimizada

### Error de Variables de Entorno

- Verifica que todas las variables estén configuradas en Vercel
- No incluyas comillas en los valores
- Usa el formato exacto mostrado arriba

### Error de Build

- Asegúrate de que `node_modules` esté en `.vercelignore`
- Verifica que el Root Directory sea `./` o vacío

## 📊 Verificación Post-Despliegue

Una vez desplegado, verifica:

- [ ] La página principal carga correctamente
- [ ] Las imágenes se muestran
- [ ] El carrito de compras funciona
- [ ] Los pagos con Stripe funcionan
- [ ] No hay errores en la consola del navegador

## 🔒 Seguridad

- ✅ Claves de Stripe de producción configuradas
- ✅ Variables secretas solo en variables de entorno
- ✅ `.env.local` en `.gitignore`
- ✅ Rate limiting configurado en middleware

---

**Nota:** Si después de estos cambios aún tienes problemas, revisa los logs de build en Vercel para más detalles específicos del error.
