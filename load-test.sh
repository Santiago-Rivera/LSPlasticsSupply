#!/bin/bash

# Script de prueba de carga para verificar el balanceador
echo "🧪 Iniciando pruebas de carga para L&S Plastics..."

# Configuración de la prueba
BASE_URL="http://localhost"
CONCURRENT_USERS=100
REQUESTS_PER_USER=50
TOTAL_REQUESTS=$((CONCURRENT_USERS * REQUESTS_PER_USER))

echo "⚙️ Configuración de prueba:"
echo "   🌐 URL Base: $BASE_URL"
echo "   👥 Usuarios concurrentes: $CONCURRENT_USERS"
echo "   📊 Requests por usuario: $REQUESTS_PER_USER"
echo "   📈 Total de requests: $TOTAL_REQUESTS"
echo ""

# Función para simular usuario
simulate_user() {
    local user_id=$1
    local requests=0
    local errors=0

    for i in $(seq 1 $REQUESTS_PER_USER); do
        # Simular navegación real
        case $((RANDOM % 5)) in
            0)
                # Página principal
                response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/")
                ;;
            1)
                # Productos
                response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/productos")
                ;;
            2)
                # Categorías
                response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/tienda/categorias")
                ;;
            3)
                # Health check
                response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/api/health")
                ;;
            4)
                # Carrito
                response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/cart")
                ;;
        esac

        if [ "$response" != "200" ]; then
            errors=$((errors + 1))
        fi

        requests=$((requests + 1))

        # Pequeña pausa para simular comportamiento real
        sleep 0.1
    done

    echo "Usuario $user_id completado: $requests requests, $errors errores"
}

# Verificar que el servidor esté funcionando
echo "🔍 Verificando que el servidor esté funcionando..."
if ! curl -f -s "$BASE_URL/api/health" > /dev/null; then
    echo "❌ Error: El servidor no está respondiendo en $BASE_URL"
    echo "   Asegúrate de que el balanceador de carga esté funcionando:"
    echo "   docker-compose up -d"
    exit 1
fi

echo "✅ Servidor funcionando correctamente"
echo ""

# Obtener métricas iniciales
echo "📊 Obteniendo métricas iniciales..."
initial_metrics=$(curl -s "$BASE_URL/api/metrics" | jq -r '.requests // 0')
echo "   Requests iniciales: $initial_metrics"
echo ""

# Ejecutar prueba de carga
echo "🚀 Iniciando prueba de carga..."
start_time=$(date +%s)

# Lanzar usuarios concurrentes en background
for i in $(seq 1 $CONCURRENT_USERS); do
    simulate_user $i &
done

# Esperar a que todos los usuarios terminen
wait

end_time=$(date +%s)
duration=$((end_time - start_time))

echo ""
echo "✅ Prueba de carga completada en ${duration} segundos"

# Obtener métricas finales
echo "📊 Obteniendo métricas finales..."
sleep 5 # Esperar a que se procesen las métricas

final_metrics=$(curl -s "$BASE_URL/api/metrics")
final_requests=$(echo $final_metrics | jq -r '.requests // 0')
avg_response_time=$(echo $final_metrics | jq -r '.avgResponseTime // 0')
error_rate=$(echo $final_metrics | jq -r '.errorRate // 0')
requests_per_second=$(echo $final_metrics | jq -r '.requestsPerSecond // 0')

echo ""
echo "📈 RESULTADOS DE LA PRUEBA:"
echo "   ⏱️  Duración total: ${duration} segundos"
echo "   📊 Requests procesados: $final_requests"
echo "   ⚡ Tiempo promedio de respuesta: ${avg_response_time}ms"
echo "   ❌ Tasa de error: ${error_rate}%"
echo "   🚀 Requests por segundo: ${requests_per_second}"
echo ""

# Verificar estado de las instancias
echo "🖥️ Estado de las instancias:"
docker-compose ps app1 app2 app3

echo ""
echo "💡 Para monitorear en tiempo real:"
echo "   📊 Métricas: $BASE_URL/api/metrics"
echo "   ❤️  Health: $BASE_URL/api/health"
echo "   📈 Prometheus: http://localhost:9090"
echo "   📋 Grafana: http://localhost:3001"

# Verificar si alguna instancia falló
failed_instances=$(docker-compose ps app1 app2 app3 | grep -c "Exit")
if [ $failed_instances -gt 0 ]; then
    echo ""
    echo "⚠️ WARNING: $failed_instances instancia(s) fallaron durante la prueba"
    echo "   Revisa los logs: docker-compose logs app1 app2 app3"
else
    echo ""
    echo "🎉 ¡Todas las instancias pasaron la prueba de carga!"
fi

echo "✅ Prueba de balanceador de carga completada"
