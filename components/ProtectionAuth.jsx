import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectionAuthComponent() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const router = useRouter();

    // Función para verificar código localmente si el servidor no está disponible
    const verifyCodeLocally = (inputCode) => {
        // Tu código maestro: SANTIAGO2025LSPLASTICS
        return inputCode === 'SANTIAGO2025LSPLASTICS';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Intentar conectar con la API primero
            const response = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    userAgent: navigator.userAgent,
                    timestamp: Date.now()
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Código correcto vía API
                localStorage.setItem('ls-auth-verified', 'true');
                setError('');

                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                return;
            } else {
                // Código incorrecto vía API
                setError(data.message || 'Error de verificación');
                setAttempts(prev => prev + 1);
                setCode('');
            }

        } catch (err) {
            console.error('Error de conexión con API:', err);

            // Si falla la API, verificar localmente como respaldo
            if (verifyCodeLocally(code)) {
                // Código correcto - modo local
                localStorage.setItem('ls-auth-verified', 'true');
                localStorage.setItem('ls-auth-mode', 'local');
                setError('');

                // Mostrar mensaje de éxito
                setLoading(false);
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                return;
            } else {
                // Código incorrecto
                setAttempts(prev => prev + 1);
                setCode('');

                if (attempts >= 2) {
                    setError('🚨 Demasiados intentos fallidos. Acceso bloqueado temporalmente.');
                } else {
                    setError('❌ Código incorrecto. Servidor desconectado - usando modo local.');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // Mostrar mensaje de éxito si la autenticación fue exitosa
    if (loading && !error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '40px',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ color: '#10b981', marginBottom: '10px' }}>¡Acceso Autorizado!</h2>
                    <p style={{ color: '#64748b' }}>Bienvenido Santiago. Redirigiendo...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                textAlign: 'center'
            }}>
                {/* Icono de Seguridad */}
                <div style={{
                    fontSize: '80px',
                    marginBottom: '20px',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                    🔐
                </div>

                {/* Título */}
                <h1 style={{
                    color: '#1e3c72',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '10px'
                }}>
                    Código de Acceso Requerido
                </h1>

                {/* Subtítulo */}
                <p style={{
                    color: '#64748b',
                    fontSize: '16px',
                    marginBottom: '30px',
                    lineHeight: '1.5'
                }}>
                    Este proyecto está protegido contra modificaciones no autorizadas.
                    <br />
                    <strong>Solo el propietario Santiago tiene acceso.</strong>
                </p>

                {/* Información del Proyecto */}
                <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '30px',
                    border: '2px solid #e2e8f0'
                }}>
                    <h3 style={{
                        color: '#1e3c72',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '10px'
                    }}>
                        📋 Información del Proyecto
                    </h3>
                    <div style={{ color: '#475569', fontSize: '14px' }}>
                        <p><strong>Proyecto:</strong> L&S Plastics Supply</p>
                        <p><strong>Propietario:</strong> Santiago</p>
                        <p><strong>Creado:</strong> Enero 2025</p>
                        <p><strong>Estado:</strong> Protegido 🛡️</p>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Ingresa el código maestro"
                            disabled={loading || attempts >= 3}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '16px',
                                border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                                borderRadius: '12px',
                                textAlign: 'center',
                                fontFamily: 'monospace',
                                letterSpacing: '2px',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                if (!error) {
                                    e.target.style.border = '2px solid #3b82f6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }
                            }}
                            onBlur={(e) => {
                                if (!error) {
                                    e.target.style.border = '2px solid #e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '20px',
                            color: '#dc2626',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Botón de Envío */}
                    <button
                        type="submit"
                        disabled={!code || loading || attempts >= 3}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            background: attempts >= 3 ? '#6b7280' :
                                       loading ? '#9ca3af' :
                                       'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: attempts >= 3 ? 'not-allowed' :
                                   loading ? 'wait' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: attempts >= 3 ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (attempts < 3 && !loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        {loading ? '🔄 Verificando...' :
                         attempts >= 3 ? '🚫 Bloqueado' :
                         '🔓 Verificar Acceso'}
                    </button>
                </form>

                {/* Contador de Intentos */}
                <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: attempts >= 2 ? '#fef2f2' : '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: attempts >= 2 ? '#dc2626' : '#64748b'
                }}>
                    Intentos restantes: {Math.max(0, 3 - attempts)}/3
                    {attempts >= 2 && (
                        <div style={{ marginTop: '5px', fontWeight: '600' }}>
                            ⚠️ Último intento antes del bloqueo
                        </div>
                    )}
                </div>

                {/* Indicador de Estado del Servidor */}
                <div style={{
                    marginTop: '15px',
                    padding: '8px',
                    background: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#856404'
                }}>
                    💡 Modo respaldo activo - Funciona sin servidor
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '30px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '12px',
                    color: '#94a3b8'
                }}>
                    <p>🛡️ Sistema de Protección Activo</p>
                    <p>Todos los intentos de acceso son registrados</p>
                </div>
            </div>
        </div>
    );
}
