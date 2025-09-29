import { NextRequest, NextResponse } from 'next/server';

// Sistema de métricas en memoria (en producción usar Redis)
let metrics = {
    requests: 0,
    errors: 0,
    responseTime: [],
    activeConnections: 0,
    cacheHits: 0,
    cacheMisses: 0,
    instanceLoad: {},
    startTime: Date.now()
};

export async function POST(request) {
    try {
        const data = await request.json();

        // Registrar métricas del cliente
        metrics.requests++;
        metrics.responseTime.push(data.loadTime);

        // Mantener solo las últimas 100 métricas para evitar memoria excesiva
        if (metrics.responseTime.length > 100) {
            metrics.responseTime = metrics.responseTime.slice(-100);
        }

        // Actualizar métricas por instancia
        const instance = process.env.INSTANCE_ID || 'default';
        if (!metrics.instanceLoad[instance]) {
            metrics.instanceLoad[instance] = {
                requests: 0,
                avgResponseTime: 0,
                memoryUsage: 0
            };
        }

        metrics.instanceLoad[instance].requests++;
        metrics.instanceLoad[instance].avgResponseTime =
            metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length;
        metrics.instanceLoad[instance].memoryUsage = process.memoryUsage().rss / 1024 / 1024;

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        metrics.errors++;
        return NextResponse.json({ error: 'Error registrando métricas' }, { status: 500 });
    }
}

export async function GET(request) {
    const uptime = Date.now() - metrics.startTime;
    const avgResponseTime = metrics.responseTime.length > 0
        ? metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length
        : 0;

    const currentMetrics = {
        ...metrics,
        uptime: uptime,
        avgResponseTime: Math.round(avgResponseTime),
        requestsPerSecond: Math.round(metrics.requests / (uptime / 1000)),
        errorRate: metrics.requests > 0 ? (metrics.errors / metrics.requests * 100).toFixed(2) : 0,
        instance: process.env.INSTANCE_ID || 'default',
        timestamp: new Date().toISOString()
    };

    return NextResponse.json(currentMetrics);
}
