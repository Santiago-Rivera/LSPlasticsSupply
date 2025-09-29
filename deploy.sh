#!/bin/bash

echo "🚀 Desplegando L&S Plastics con Balanceador de Carga..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar dependencias
log "Verificando dependencias..."
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado"
    exit 1
fi

# Detener servicios existentes
log "Deteniendo servicios existentes..."
docker-compose down --remove-orphans

# Limpiar imágenes antiguas
log "Limpiando imágenes antiguas..."
docker system prune -f

# Construir imágenes optimizadas
log "Construyendo imágenes optimizadas..."
docker-compose build --parallel --no-cache

# Crear red personalizada si no existe
log "Configurando red del balanceador..."
docker network create load-balance-network 2>/dev/null || true

# Iniciar servicios en orden
log "Iniciando servicios de infraestructura..."
docker-compose up -d redis postgres

# Esperar a que estén listos
log "Esperando a que Redis y PostgreSQL estén listos..."
sleep 10

# Verificar Redis
log "Verificando Redis..."
until docker-compose exec redis redis-cli ping | grep -q PONG; do
    warn "Esperando a Redis..."
    sleep 2
done
log "✅ Redis está listo"

# Verificar PostgreSQL
log "Verificando PostgreSQL..."
until docker-compose exec postgres pg_isready -U admin -d lsplastics | grep -q "accepting connections"; do
    warn "Esperando a PostgreSQL..."
    sleep 2
done
log "✅ PostgreSQL está listo"

# Iniciar aplicaciones
log "Iniciando instancias de la aplicación..."
docker-compose up -d app1 app2 app3

# Esperar a que las aplicaciones estén listas
log "Esperando a que las aplicaciones estén listas..."
sleep 30

# Verificar health de cada instancia
for i in {1..3}; do
    log "Verificando salud de app$i..."
    for attempt in {1..10}; do
        if docker-compose exec app$i curl -f http://localhost:3000/api/health &>/dev/null; then
            log "✅ app$i está saludable"
            break
        else
            warn "app$i no responde, intento $attempt/10..."
            sleep 3
        fi

        if [ $attempt -eq 10 ]; then
            error "app$i falló en iniciarse después de 10 intentos"
            docker-compose logs app$i
        fi
    done
done

# Iniciar balanceador de carga
log "Iniciando balanceador de carga Nginx..."
docker-compose up -d nginx-load-balancer

# Esperar al balanceador
sleep 10

# Verificar balanceador de carga
log "Verificando balanceador de carga..."
if curl -f http://localhost/api/health &>/dev/null; then
    log "✅ Balanceador de carga funcionando"
else
    error "❌ Balanceador de carga falló"
    docker-compose logs nginx-load-balancer
    exit 1
fi

# Iniciar servicios de monitoreo
log "Iniciando servicios de monitoreo..."
docker-compose up -d prometheus grafana

# Mostrar estado final
log "Estado de todos los servicios:"
docker-compose ps

# Mostrar URLs de acceso
echo ""
log "🎉 ¡Despliegue completado exitosamente!"
echo ""
echo "📊 URLs de acceso:"
echo "   🌐 Aplicación principal: http://localhost"
echo "   ❤️  Health check: http://localhost/api/health"
echo "   📈 Métricas: http://localhost/api/metrics"
echo "   📊 Prometheus: http://localhost:9090"
echo "   📋 Grafana: http://localhost:3001 (admin/admin123)"
echo ""
echo "🔄 Comandos útiles:"
echo "   docker-compose logs -f          # Ver logs en tiempo real"
echo "   docker-compose ps               # Ver estado de servicios"
echo "   docker-compose down             # Detener todo"
echo "   docker-compose scale app1=5     # Escalar instancias"
echo ""

# Test de carga básico
log "Ejecutando test de carga básico..."
for i in {1..20}; do
    curl -s http://localhost/api/health > /dev/null &
done
wait
log "✅ Test de carga básico completado"

log "🚀 Sistema de balanceador de carga listo para uso masivo!"
