"use client";
import { useState, useEffect } from 'react';

export default function LoadBalancerMonitor() {
    const [metrics, setMetrics] = useState({
        instances: [],
        totalRequests: 0,
        avgResponseTime: 0,
        errorRate: 0,
        activeConnections: 0
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/metrics');
                const data = await response.json();
                setMetrics(data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        // Actualizar métricas cada 5 segundos
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);

        return () => clearInterval(interval);
    }, []);

    // Solo mostrar en desarrollo o si se presiona Ctrl+Shift+M
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                setIsVisible(!isVisible);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isVisible]);

    if (!isVisible) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                zIndex: 9999,
                cursor: 'pointer'
            }}
            onClick={() => setIsVisible(true)}>
                📊
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            minWidth: '300px',
            maxHeight: '80vh',
            overflow: 'auto'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
            }}>
                <strong>🚀 Load Balancer Monitor</strong>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}>
                    ✕
                </button>
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong>📊 Métricas Generales:</strong>
            </div>
            <div>📈 Requests Totales: {metrics.totalRequests}</div>
            <div>⚡ Tiempo Respuesta: {metrics.avgResponseTime}ms</div>
            <div>❌ Tasa de Error: {metrics.errorRate}%</div>
            <div>🔗 Conexiones Activas: {metrics.activeConnections}</div>

            {metrics.instanceLoad && (
                <>
                    <div style={{ marginTop: '12px', marginBottom: '8px' }}>
                        <strong>🖥️ Instancias:</strong>
                    </div>
                    {Object.entries(metrics.instanceLoad).map(([instance, data]) => (
                        <div key={instance} style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '8px',
                            borderRadius: '4px',
                            marginBottom: '4px'
                        }}>
                            <div style={{ fontWeight: 'bold' }}>{instance}</div>
                            <div>📊 Requests: {data.requests}</div>
                            <div>⚡ Avg Time: {Math.round(data.avgResponseTime)}ms</div>
                            <div>🧠 Memory: {Math.round(data.memoryUsage)}MB</div>
                        </div>
                    ))}
                </>
            )}

            <div style={{
                marginTop: '12px',
                fontSize: '10px',
                opacity: 0.7
            }}>
                Presiona Ctrl+Shift+M para ocultar
            </div>
        </div>
    );
}
