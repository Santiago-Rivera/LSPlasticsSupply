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
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                zIndex: 1000,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
            onClick={() => setIsVisible(true)}
            title="Ctrl+Shift+M para alternar monitor"
            >
                📊 Monitor
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            padding: '20px',
            width: '320px',
            zIndex: 1000,
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                paddingBottom: '10px'
            }}>
                <h3 style={{
                    margin: 0,
                    color: '#1e3c72',
                    fontSize: '16px',
                    fontWeight: '600'
                }}>
                    📊 Load Balancer Monitor
                </h3>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    ×
                </button>
            </div>

            {/* Status Indicator */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '8px',
                background: isOnline ? '#d4edda' : '#fff3cd',
                border: `1px solid ${isOnline ? '#c3e6cb' : '#ffeaa7'}`,
                borderRadius: '6px',
                fontSize: '12px'
            }}>
                <span style={{ marginRight: '8px' }}>
                    {isOnline ? '🟢' : '🟡'}
                </span>
                {isOnline ? 'API Conectada' : 'Modo Simulación'}
            </div>

            {/* Metrics */}
            <div style={{ marginBottom: '15px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        background: '#f8f9fa',
                        padding: '8px',
                        borderRadius: '6px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3c72' }}>
                            {metrics.totalRequests}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Total Requests</div>
                    </div>
                    <div style={{
                        background: '#f8f9fa',
                        padding: '8px',
                        borderRadius: '6px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3c72' }}>
                            {metrics.avgResponseTime}ms
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Avg Response</div>
                    </div>
                    <div style={{
                        background: '#f8f9fa',
                        padding: '8px',
                        borderRadius: '6px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: metrics.errorRate < 1 ? '#28a745' : '#dc3545' }}>
                            {metrics.errorRate.toFixed(2)}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Error Rate</div>
                    </div>
                    <div style={{
                        background: '#f8f9fa',
                        padding: '8px',
                        borderRadius: '6px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3c72' }}>
                            {metrics.activeConnections}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Active Conn</div>
                    </div>
                </div>
            </div>

            {/* Instances */}
            <div>
                <h4 style={{
                    margin: '0 0 10px 0',
                    fontSize: '14px',
                    color: '#1e3c72'
                }}>
                    Instances Status
                </h4>
                {metrics.instances.map((instance, index) => (
                    <div
                        key={instance.id || index}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 8px',
                            background: '#f8f9fa',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            fontSize: '12px'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: instance.status === 'healthy' ? '#28a745' : '#dc3545',
                                marginRight: '8px'
                            }}></span>
                            {instance.id || `Instance ${index + 1}`}
                        </span>
                        <span style={{ color: '#666' }}>
                            {instance.requests || 0} req/s
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '15px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(0,0,0,0.1)',
                fontSize: '11px',
                color: '#666',
                textAlign: 'center'
            }}>
                Press Ctrl+Shift+M to toggle • L&S Plastics Supply
            </div>
        </div>
    );
}
