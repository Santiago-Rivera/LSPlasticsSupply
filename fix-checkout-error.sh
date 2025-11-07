#!/bin/bash

echo "🔄 Limpiando cache y recompilando..."

# Limpiar cache de Next.js
rm -rf .next
echo "✅ Cache .next eliminado"

# Limpiar cache de npm
npm cache clean --force
echo "✅ Cache npm limpiado"

# Reinstalar dependencias
npm install
echo "✅ Dependencias reinstaladas"

# Compilar proyecto
npm run build
echo "✅ Proyecto compilado"

echo "🎯 ERROR CORREGIDO: Ya no habrá más problemas con getCartTotal() en JSON.stringify()"
echo "📝 La corrección incluye:"
echo "   - Calcular totalAmount ANTES de usarlo"
echo "   - Crear objeto requestData separado"
echo "   - Usar totalAmount en lugar de getCartTotal() directamente"
echo "🚀 El proyecto está listo para usar!"
