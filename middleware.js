import { NextRequest, NextResponse } from 'next/server';

// Sistema de rate limiting en memoria por IP
const rateLimitMap = new Map();

export function middleware(request) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60000; // 1 minuto
    
    // Rate limiting por ruta
    const limits = {
        '/api/stripe/': { requests: 10, window: windowMs },
        '/api/paypal/': { requests: 10, window: windowMs },
        '/checkout': { requests: 30, window: windowMs },
        '/api/': { requests: 100, window: windowMs },
        default: { requests: 200, window: windowMs }
    };

    // Determinar límite según la ruta
    let limit = limits.default;
    for (const [path, pathLimit] of Object.entries(limits)) {
        if (request.nextUrl.pathname.startsWith(path)) {
            limit = pathLimit;
            break;
        }
    }

    // Obtener o crear ventana de rate limiting para esta IP
    const key = `${ip}_${request.nextUrl.pathname}`;
    let windowData = rateLimitMap.get(key);
    
    if (!windowData || now > windowData.resetTime) {
        windowData = {
            count: 0,
            resetTime: now + limit.window
        };
    }

    windowData.count++;
    rateLimitMap.set(key, windowData);

    // Verificar si excede el límite
    if (windowData.count > limit.requests) {
        return new NextResponse('Too Many Requests - Rate Limit Exceeded', {
            status: 429,
            headers: {
                'Retry-After': Math.ceil((windowData.resetTime - now) / 1000).toString(),
                'X-RateLimit-Limit': limit.requests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': windowData.resetTime.toString(),
            },
        });
    }

    // Agregar headers de rate limiting
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.requests.toString());
    response.headers.set('X-RateLimit-Remaining', (limit.requests - windowData.count).toString());
    response.headers.set('X-RateLimit-Reset', windowData.resetTime.toString());
    response.headers.set('X-Instance-ID', process.env.INSTANCE_ID || 'default');

    // Limpiar entradas antiguas del mapa cada cierto tiempo
    if (Math.random() < 0.01) { // 1% de probabilidad
        for (const [mapKey, data] of rateLimitMap.entries()) {
            if (now > data.resetTime) {
                rateLimitMap.delete(mapKey);
            }
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/api/:path*',
        '/checkout/:path*',
        '/cart/:path*',
        '/productos/:path*'
    ],
};
