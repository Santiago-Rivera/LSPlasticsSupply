"use client";
import { useEffect, useState } from 'react';

// Sistema de cache del lado del cliente para reducir carga del servidor
class ClientCache {
    static cache = new Map();
    static maxSize = 100;
    static defaultTTL = 300000; // 5 minutos

    static set(key, value, ttl = this.defaultTTL) {
        // Limpiar cache si está lleno
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
    }

    static get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    static clear() {
        this.cache.clear();
    }
}

// Hook personalizado para cache inteligente
export function useOptimizedFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoizar options para evitar re-renders innecesarios
    const optionsString = JSON.stringify(options);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const cacheKey = `${url}_${optionsString}`;

                // Intentar obtener del cache primero
                const cachedData = ClientCache.get(cacheKey);
                if (cachedData) {
                    setData(cachedData);
                    setLoading(false);
                    return;
                }

                // Fetch con optimizaciones
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'public, max-age=300',
                        ...options.headers
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();

                // Guardar en cache
                ClientCache.set(cacheKey, result);
                setData(result);

            } catch (err) {
                if (err.name === 'AbortError') {
                    setError('Timeout: El servidor está ocupado, intenta nuevamente');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, optionsString]); // Dependencias simplificadas

    return { data, loading, error };
}

// Componente de monitoreo de rendimiento
export function PerformanceMonitor() {
    const [metrics, setMetrics] = useState({
        loadTime: 0,
        instance: 'unknown',
        cacheHits: 0,
        memoryUsage: 0
    });

    useEffect(() => {
        // Medir tiempo de carga
        const loadTime = performance.now();

        // Obtener información de la instancia desde headers
        const instance = document.querySelector('meta[name="x-instance-id"]')?.content || 'unknown';

        // Calcular uso de memoria aproximado
        const memoryUsage = performance.memory ?
            Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0;

        setMetrics({
            loadTime: Math.round(loadTime),
            instance,
            cacheHits: ClientCache.cache.size,
            memoryUsage
        });

        // Reportar métricas cada minuto
        const interval = setInterval(() => {
            fetch('/api/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    loadTime: Math.round(performance.now()),
                    cacheSize: ClientCache.cache.size,
                    userAgent: navigator.userAgent,
                    timestamp: Date.now()
                })
            }).catch(() => {}); // Silently fail if metrics endpoint is not available
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '10px',
            fontFamily: 'monospace',
            zIndex: 9999
        }}>
            🖥️ {metrics.instance} |
            ⚡ {metrics.loadTime}ms |
            💾 {metrics.cacheHits} cache |
            🧠 {metrics.memoryUsage}MB
        </div>
    );
}

export default ClientCache;
