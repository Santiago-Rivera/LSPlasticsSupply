/* eslint-disable */
// noinspection ExceptionCaughtLocallyJS

"use client";
import {useCallback, useEffect, useMemo, useState} from 'react';

// Hook para cache del lado del cliente
export function useClientCache(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoizar las opciones para evitar recreaciones innecesarias
    const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

    // Crear una función estable para fetchData
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(url, memoizedOptions);

            if (!response.ok) {
                const errorMessage = `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error('Cache fetch error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [url, memoizedOptions]); // Incluir memoizedOptions en dependencias

    useEffect(() => {
        void fetchData();
    }, [fetchData]); // Usar fetchData como dependencia

    return { data, loading, error };
}

// Componente de monitoreo de rendimiento simple
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

        // Obtener información de la instancia
        const instance = typeof window !== 'undefined' 
            ? (process.env.NEXT_PUBLIC_VERCEL_URL || window.location.hostname || 'localhost')
            : 'localhost';

        setMetrics(prev => ({
            ...prev,
            loadTime: Math.round(loadTime),
            instance
        }));
    }, []); // Sin dependencias adicionales

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 9999
        }}>
            <div>Load: {metrics.loadTime}ms</div>
            <div>Instance: {metrics.instance}</div>
        </div>
    );
}

// Exportación corregida para evitar asignación antes de usar como default
const ClientCacheExports = { useClientCache, PerformanceMonitor };
export default ClientCacheExports;
