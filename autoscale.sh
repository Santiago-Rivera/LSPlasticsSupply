#!/bin/bash

# Script de auto-escalado para L&S Plastics
# Monitorea el uso de CPU y memoria y escala automáticamente

LOG_FILE="/var/log/autoscale.log"
MAX_INSTANCES=10
MIN_INSTANCES=3
CPU_THRESHOLD=70
MEMORY_THRESHOLD=80
CHECK_INTERVAL=30

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

get_cpu_usage() {
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}" | \
    grep "app[0-9]" | awk '{sum+=substr($2,1,length($2)-1)} END {print sum/NR}'
}

get_memory_usage() {
    docker stats --no-stream --format "table {{.Container}}\t{{.MemPerc}}" | \
    grep "app[0-9]" | awk '{sum+=substr($2,1,length($2)-1)} END {print sum/NR}'
}

get_current_instances() {
    docker-compose ps app* | grep "Up" | wc -l
}

scale_up() {
    local current_instances=$(get_current_instances)
    local new_count=$((current_instances + 1))

    if [ $new_count -le $MAX_INSTANCES ]; then
        log "🔼 Escalando hacia arriba: $current_instances -> $new_count instancias"
        docker-compose up -d --scale app$new_count=1

        # Esperar a que la nueva instancia esté lista
        sleep 20

        # Recargar configuración de Nginx
        docker-compose exec nginx-load-balancer nginx -s reload

        log "✅ Escalado completado: $new_count instancias activas"
    else
        log "⚠️  No se puede escalar: máximo de instancias alcanzado ($MAX_INSTANCES)"
    fi
}

scale_down() {
    local current_instances=$(get_current_instances)
    local new_count=$((current_instances - 1))

    if [ $new_count -ge $MIN_INSTANCES ]; then
        log "🔽 Escalando hacia abajo: $current_instances -> $new_count instancias"
        docker-compose stop app$current_instances
        docker-compose rm -f app$current_instances

        # Recargar configuración de Nginx
        docker-compose exec nginx-load-balancer nginx -s reload

        log "✅ Reducción completada: $new_count instancias activas"
    else
        log "⚠️  No se puede reducir: mínimo de instancias alcanzado ($MIN_INSTANCES)"
    fi
}

# Función principal de monitoreo
monitor_and_scale() {
    while true; do
        local cpu_usage=$(get_cpu_usage)
        local memory_usage=$(get_memory_usage)
        local current_instances=$(get_current_instances)

        log "📊 CPU: ${cpu_usage}% | Memoria: ${memory_usage}% | Instancias: $current_instances"

        # Lógica de escalado basada en métricas
        if (( $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) )) || \
           (( $(echo "$memory_usage > $MEMORY_THRESHOLD" | bc -l) )); then
            log "🚨 Alto uso detectado - CPU: ${cpu_usage}% | Memoria: ${memory_usage}%"
            scale_up
        elif (( $(echo "$cpu_usage < 30" | bc -l) )) && \
             (( $(echo "$memory_usage < 40" | bc -l) )) && \
             [ $current_instances -gt $MIN_INSTANCES ]; then
            log "📉 Bajo uso detectado - reduciendo instancias"
            scale_down
        fi

        sleep $CHECK_INTERVAL
    done
}

# Verificar dependencias
if ! command -v bc &> /dev/null; then
    echo "Instalando bc para cálculos..."
    apt-get update && apt-get install -y bc
fi

log "🚀 Iniciando sistema de auto-escalado"
log "⚙️  Configuración: CPU>${CPU_THRESHOLD}% | Memoria>${MEMORY_THRESHOLD}% | Min:$MIN_INSTANCES | Max:$MAX_INSTANCES"

# Iniciar monitoreo
monitor_and_scale
