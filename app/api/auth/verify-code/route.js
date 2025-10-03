import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Sistema de protección simplificado para la API
class CodeProtectionAPI {
    constructor() {
        // Hash del código maestro: SANTIAGO2025LSPLASTICS
        this.masterCodeHash = this.generateHash('SANTIAGO2025LSPLASTICS');
        this.maxAttempts = 3;
        this.lockoutDuration = 24 * 60 * 60 * 1000; // 24 horas
        this.attempts = new Map();
    }

    generateHash(code) {
        return crypto.createHash('sha256').update(code + 'SANTIAGO_LS_PLASTICS_2025_PROTECTION').digest('hex');
    }

    isUserBlocked(identifier) {
        const attemptData = this.attempts.get(identifier);
        if (!attemptData) return false;

        if (attemptData.count >= this.maxAttempts) {
            const timePassed = Date.now() - attemptData.lastAttempt;
            return timePassed < this.lockoutDuration;
        }
        return false;
    }

    recordFailedAttempt(identifier) {
        const now = Date.now();
        const attemptData = this.attempts.get(identifier) || { count: 0, lastAttempt: now };

        attemptData.count++;
        attemptData.lastAttempt = now;
        this.attempts.set(identifier, attemptData);

        console.warn(`🚨 INTENTO NO AUTORIZADO - IP: ${identifier} - Intentos: ${attemptData.count}`);
    }

    verifyMasterCode(inputCode, userIdentifier = 'unknown') {
        if (this.isUserBlocked(userIdentifier)) {
            const attemptData = this.attempts.get(userIdentifier);
            const timeLeft = this.lockoutDuration - (Date.now() - attemptData.lastAttempt);
            const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));

            throw new Error(`🔒 ACCESO BLOQUEADO. Demasiados intentos fallidos. Intenta de nuevo en ${hoursLeft} horas.`);
        }

        const inputHash = this.generateHash(inputCode);

        if (inputHash === this.masterCodeHash) {
            this.attempts.delete(userIdentifier);
            console.log(`✅ ACCESO AUTORIZADO - Santiago autenticado correctamente`);
            return true;
        } else {
            this.recordFailedAttempt(userIdentifier);
            const attemptData = this.attempts.get(userIdentifier);
            const attemptsLeft = this.maxAttempts - attemptData.count;

            if (attemptsLeft > 0) {
                throw new Error(`❌ Código incorrecto. Te quedan ${attemptsLeft} intentos antes del bloqueo.`);
            } else {
                throw new Error(`🚨 ACCESO BLOQUEADO por 24 horas debido a múltiples intentos fallidos.`);
            }
        }
    }
}

// Instancia del sistema de protección
const protection = new CodeProtectionAPI();

export async function POST(request) {
    try {
        const { code, userAgent, timestamp } = await request.json();

        if (!code) {
            return NextResponse.json(
                { message: 'Código requerido' },
                { status: 400 }
            );
        }

        // Obtener identificador único del usuario
        const userIdentifier = request.headers.get('x-forwarded-for') ||
                              request.headers.get('x-real-ip') ||
                              'unknown';

        // Log adicional para debugging
        console.log('🔍 Intento de verificación:', {
            userAgent: userAgent || 'No disponible',
            timestamp: timestamp || Date.now(),
            ip: userIdentifier
        });

        // Verificar el código maestro
        const isValid = protection.verifyMasterCode(code, userIdentifier);

        if (isValid) {
            // Crear token de sesión
            const sessionToken = `ls_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const response = NextResponse.json({
                success: true,
                message: '✅ Acceso autorizado - Bienvenido Santiago',
                owner: true,
                timestamp: new Date().toISOString()
            });

            // Establecer cookie de sesión
            response.cookies.set('ls-auth-session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 2 * 60 * 60 // 2 horas
            });

            return response;
        }

    } catch (error) {
        // Log de intento no autorizado
        console.error('🚨 INTENTO DE ACCESO NO AUTORIZADO:', {
            timestamp: new Date().toISOString(),
            ip: request.headers.get('x-forwarded-for'),
            userAgent: request.headers.get('user-agent'),
            error: error.message
        });

        return NextResponse.json(
            {
                message: error.message,
                blocked: error.message.includes('BLOQUEADO')
            },
            { status: 403 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Sistema de Protección L&S Plastics Supply',
        owner: 'Santiago',
        status: 'Activo 🛡️',
        created: '2025-01-03'
    });
}
