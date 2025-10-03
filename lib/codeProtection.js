/**
 * Sistema de Protección de Código - L&S Plastics Supply
 * Creado por Santiago - Propietario del proyecto
 * Fecha: 2025-01-03
 *
 * ADVERTENCIA: Este código está protegido contra modificaciones no autorizadas.
 * Cualquier intento de alteración será registrado y bloqueado.
 */

import crypto from 'crypto';

class CodeProtectionSystem {
    constructor() {
        // Hash del código maestro del propietario (Santiago)
        // Código maestro: SANTIAGO2025LSPLASTICS
        this.masterCodeHash = this.generateHash('SANTIAGO2025LSPLASTICS');
        this.maxAttempts = 3;
        this.lockoutDuration = 24 * 60 * 60 * 1000; // 24 horas
        this.attempts = new Map();
        this.lastAuthTime = null;
        this.sessionValid = false;

        // Log de inicialización del sistema
        console.log('🛡️ Sistema de Protección L&S Plastics Supply - ACTIVADO');
        console.log('👤 Propietario: Santiago');
        console.log('📅 Inicializado:', new Date().toISOString());
    }

    // Genera el hash del código ingresado
    generateHash(code) {
        return crypto.createHash('sha256').update(code + 'SANTIAGO_LS_PLASTICS_2025_PROTECTION').digest('hex');
    }

    // Verifica si el usuario está bloqueado
    isUserBlocked(identifier) {
        const attemptData = this.attempts.get(identifier);
        if (!attemptData) return false;

        if (attemptData.count >= this.maxAttempts) {
            const timePassed = Date.now() - attemptData.lastAttempt;
            return timePassed < this.lockoutDuration;
        }
        return false;
    }

    // Registra un intento fallido
    recordFailedAttempt(identifier) {
        const now = Date.now();
        const attemptData = this.attempts.get(identifier) || { count: 0, lastAttempt: now };

        attemptData.count++;
        attemptData.lastAttempt = now;
        this.attempts.set(identifier, attemptData);

        // Log del intento no autorizado
        console.warn(`🚨 INTENTO NO AUTORIZADO DETECTADO 🚨`);
        console.warn(`Timestamp: ${new Date().toISOString()}`);
        console.warn(`Identificador: ${identifier}`);
        console.warn(`Intentos totales: ${attemptData.count}`);
        console.warn(`⚠️  ACCESO DENEGADO - Solo Santiago puede modificar este proyecto`);
    }

    // Verifica el código maestro
    verifyMasterCode(inputCode, userIdentifier = 'unknown') {
        // Verificar si el usuario está bloqueado
        if (this.isUserBlocked(userIdentifier)) {
            const attemptData = this.attempts.get(userIdentifier);
            const timeLeft = this.lockoutDuration - (Date.now() - attemptData.lastAttempt);
            const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));

            throw new Error(`🔒 ACCESO BLOQUEADO. Demasiados intentos fallidos. Intenta de nuevo en ${hoursLeft} horas.`);
        }

        const inputHash = this.generateHash(inputCode);

        if (inputHash === this.masterCodeHash) {
            // Código correcto - resetear intentos y autorizar sesión
            this.attempts.delete(userIdentifier);
            this.lastAuthTime = Date.now();
            this.sessionValid = true;

            console.log(`✅ ACCESO AUTORIZADO - Bienvenido Santiago`);
            console.log(`📅 Timestamp: ${new Date().toISOString()}`);
            console.log(`🔓 Sesión iniciada para el propietario del proyecto`);

            return true;
        } else {
            // Código incorrecto
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

    // Verifica si la sesión actual es válida
    isSessionValid() {
        if (!this.sessionValid || !this.lastAuthTime) {
            return false;
        }

        // Sesión válida por 2 horas
        const sessionDuration = 2 * 60 * 60 * 1000;
        const timePassed = Date.now() - this.lastAuthTime;

        if (timePassed > sessionDuration) {
            this.sessionValid = false;
            console.log('⏰ Sesión expirada - Se requiere nueva autenticación');
            return false;
        }

        return true;
    }

    // Función principal de protección
    static protectCodeModification() {
        const protection = new CodeProtectionSystem();

        return async (req, res, next) => {
            // Verificar si es una operación de modificación
            const isModificationOperation = [
                'POST', 'PUT', 'PATCH', 'DELETE'
            ].includes(req.method);

            // Rutas que requieren protección
            const protectedPaths = [
                '/api/',
                '/admin',
                '/edit',
                '/modify',
                '/update',
                '/delete'
            ];

            const isProtectedPath = protectedPaths.some(path =>
                req.url?.includes(path)
            );

            if (isModificationOperation || isProtectedPath) {
                // Verificar sesión válida
                if (!protection.isSessionValid()) {
                    return res.status(403).json({
                        error: '🚨 ACCESO DENEGADO',
                        message: 'Este proyecto está protegido contra modificaciones no autorizadas.',
                        owner: 'Santiago - Creador del proyecto L&S Plastics Supply',
                        created: '2025-01-03',
                        action: 'Se requiere código de autorización del propietario',
                        masterCode: 'Código maestro: SANTIAGO2025LSPLASTICS'
                    });
                }
            }

            next();
        };
    }
}

export default CodeProtectionSystem;
