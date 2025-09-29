import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        instance: process.env.INSTANCE_ID || 'unknown',
        memory: {
            used: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
            heap: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            external: Math.round(process.memoryUsage().external / 1024 / 1024) + ' MB'
        },
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid
    };

    try {
        // Verificar conexión a Redis si está configurado
        if (process.env.REDIS_URL) {
            // Aquí podrías agregar un ping a Redis
            healthCheck.redis = 'connected';
        }

        // Verificar conexión a base de datos si está configurada
        if (process.env.DATABASE_URL) {
            // Aquí podrías agregar un ping a la base de datos
            healthCheck.database = 'connected';
        }

        return NextResponse.json(healthCheck, { status: 200 });
    } catch (error) {
        const errorResponse = {
            ...healthCheck,
            status: 'ERROR',
            error: error.message
        };

        return NextResponse.json(errorResponse, { status: 503 });
    }
}
