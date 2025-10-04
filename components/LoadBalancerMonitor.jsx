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
    const [isOnline, setIsOnline] = useState(true);

    // Generar métricas simuladas cuando la API no esté disponible
    const generateMockMetrics = () => {
        return {
            instances: [
                { id: 'instance-1', status: 'healthy', requests: Math.floor(Math.random() * 100) + 50 },
                { id: 'instance-2', status: 'healthy', requests: Math.floor(Math.random() * 100) + 30 },
                { id: 'instance-3', status: 'healthy', requests: Math.floor(Math.random() * 100) + 20 }
            ],
            totalRequests: Math.floor(Math.random() * 1000) + 500,
            avgResponseTime: Math.floor(Math.random() * 50) + 120,
            errorRate: Math.random() * 2,
            activeConnections: Math.floor(Math.random() * 50) + 10
        };
    };

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Intentar obtener métricas reales de la API
                const response = await fetch('/api/metrics', {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data);
                    setIsOnline(true);
                } else {
                    throw new Error('API not available');
                }
            } catch (error) {
                console.warn('API metrics not available, using mock data:', error.message);
                // Usar métricas simuladas cuando la API falla
                setMetrics(generateMockMetrics());
                setIsOnline(false);
            }
        };

        // Fetch inicial
        fetchMetrics();

        // Actualizar cada 5 segundos
        const interval = setInterval(fetchMetrics, 5000);

        return () => clearInterval(interval);
    }, []);

    // Solo mostrar en desarrollo o cuando se presiona Ctrl+Shift+M
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                setIsVisible(!isVisible);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isVisible]);

    // No mostrar en producción a menos que se active manualmente
    if (!isVisible && process.env.NODE_ENV === 'production') {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            minWidth: '250px',
            maxWidth: '350px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: `2px solid ${isOnline ? '#10b981' : '#ef4444'}`
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                paddingBottom: '4px'
            }}>
                <span style={{ fontWeight: 'bold' }}>
                    {isOnline ? '🟢' : '🔴'} Load Balancer
                </span>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Requests:</span>
                    <span style={{ color: '#fbbf24' }}>{metrics.totalRequests}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Avg Response:</span>
                    <span style={{ color: '#3b82f6' }}>{metrics.avgResponseTime}ms</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Error Rate:</span>
                    <span style={{ color: metrics.errorRate > 1 ? '#ef4444' : '#10b981' }}>
                        {metrics.errorRate.toFixed(2)}%
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Active Connections:</span>
                    <span style={{ color: '#8b5cf6' }}>{metrics.activeConnections}</span>
                </div>
            </div>

            {/* Instances */}
            {metrics.instances.length > 0 && (
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Instances:</div>
                    {metrics.instances.map((instance) => (
                        <div
                            key={instance.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '11px',
                                opacity: 0.8
                            }}
                        >
                            <span>
                                {instance.status === 'healthy' ? '🟢' : '🔴'} {instance.id}
                            </span>
                            <span>{instance.requests} req/min</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Status indicator */}
            <div style={{
                marginTop: '8px',
                paddingTop: '4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '10px',
                opacity: 0.7,
                textAlign: 'center'
            }}>
                {isOnline ? 'Live Data' : 'Mock Data'} • Press Ctrl+Shift+M to toggle
            </div>
        </div>
    );
}
