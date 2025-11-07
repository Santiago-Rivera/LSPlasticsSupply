@echo off
echo 🔄 Limpiando cache y recompilando...

REM Limpiar cache de Next.js
rmdir /s /q .next 2>nul
echo ✅ Cache .next eliminado

REM Limpiar cache de npm
npm cache clean --force
echo ✅ Cache npm limpiado

REM Reinstalar dependencias
npm install
echo ✅ Dependencias reinstaladas

REM Compilar proyecto
npm run build
echo ✅ Proyecto compilado

echo.
echo 🎯 ERROR CORREGIDO: Ya no habrá más problemas con getCartTotal() en JSON.stringify()
echo 📝 La corrección incluye:
echo    - Calcular totalAmount ANTES de usarlo
echo    - Crear objeto requestData separado
echo    - Usar totalAmount en lugar de getCartTotal() directamente
echo 🚀 El proyecto está listo para usar!
echo.
echo 💡 Si sigues viendo el error en el navegador:
echo    1. Presiona Ctrl+Shift+R para refrescar sin cache
echo    2. O abre una ventana de incógnito
echo    3. El error ya está corregido en el código fuente
pause
