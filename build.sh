#!/bin/bash
# Script de build personalizado para Vercel

echo "🚀 Starting custom build process..."

# Instalar dependencias con legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Verificar que productos.json existe
if [ ! -f "public/productos.json" ]; then
    echo "⚠️ Warning: productos.json not found in public directory"
fi

# Ejecutar build
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
