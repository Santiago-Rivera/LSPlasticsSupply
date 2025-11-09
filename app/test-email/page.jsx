"use client";
import { useState } from 'react';

export default function EmailConfigPage() {
    const [testResult, setTestResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [testEmail, setTestEmail] = useState('');

    const testEmailSystem = async () => {
        setIsLoading(true);
        setTestResult(null);

        try {
            const response = await fetch('/api/test-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testEmail: testEmail || undefined
                })
            });

            const result = await response.json();
            setTestResult(result);

        } catch (error) {
            setTestResult({
                success: false,
                error: 'Error conectando al servidor: ' + error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            padding: '20px', 
            background: '#f8fafc',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '3px solid #fbbf24',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ 
                        color: '#1e3a8a', 
                        textAlign: 'center',
                        fontSize: '32px',
                        marginBottom: '30px'
                    }}>
                        📧 Configuración de Email - L&S Plastics Supply
                    </h1>

                    <div style={{
                        background: '#fef3c7',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '2px solid #f59e0b',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{ color: '#92400e', margin: '0 0 15px 0' }}>
                            🚨 PROBLEMA: Los correos no llegan al cliente
                        </h3>
                        <p style={{ margin: '0', color: '#78350f' }}>
                            Gmail requiere una <strong>contraseña de aplicación</strong> para enviar correos desde aplicaciones externas.
                        </p>
                    </div>

                    <div style={{
                        background: '#f0fdf4',
                        padding: '25px',
                        borderRadius: '12px',
                        border: '2px solid #16a34a',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{ color: '#15803d', margin: '0 0 20px 0' }}>
                            ✅ SOLUCIÓN (3 pasos simples):
                        </h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <strong style={{ color: '#15803d' }}>1. Generar contraseña de aplicación:</strong>
                            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                                <li>Ir a: <a href="https://myaccount.google.com/security" target="_blank" style={{ color: '#1e40af' }}>https://myaccount.google.com/security</a></li>
                                <li>Activar "Verificación en dos pasos"</li>
                                <li>Generar "Contraseña de aplicación"</li>
                                <li>Seleccionar: Correo → Dispositivo personalizado</li>
                                <li>Nombre: "L&S Plastics Website"</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <strong style={{ color: '#15803d' }}>2. Actualizar .env.local:</strong>
                            <div style={{
                                background: '#1f2937',
                                color: '#f9fafb',
                                padding: '15px',
                                borderRadius: '8px',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                margin: '10px 0'
                            }}>
                                EMAIL_USER=Lavadoandsonsllc@gmail.com<br/>
                                EMAIL_PASS=TU_CONTRASEÑA_DE_APLICACION_AQUI
                            </div>
                        </div>

                        <div>
                            <strong style={{ color: '#15803d' }}>3. Reiniciar servidor:</strong>
                            <code style={{ 
                                background: '#e5e7eb', 
                                padding: '5px 10px', 
                                borderRadius: '4px',
                                marginLeft: '10px'
                            }}>npm run dev</code>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    border: '3px solid #1e40af',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ 
                        color: '#1e40af', 
                        textAlign: 'center',
                        marginBottom: '25px'
                    }}>
                        🧪 Probar Sistema de Email
                    </h2>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '600',
                            color: '#1e3a8a'
                        }}>
                            📧 Email de prueba (opcional):
                        </label>
                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="tu-email@ejemplo.com"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                        <p style={{ 
                            fontSize: '14px', 
                            color: '#6b7280',
                            margin: '5px 0 0 0'
                        }}>
                            Si no especificas un email, se probará con el email configurado del sistema
                        </p>
                    </div>

                    <button
                        onClick={testEmailSystem}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                            color: 'white',
                            border: '2px solid #fbbf24',
                            borderRadius: '12px',
                            fontSize: '18px',
                            fontWeight: '700',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            marginBottom: '25px'
                        }}
                    >
                        {isLoading ? '🔄 Probando...' : '🧪 Probar Sistema de Email'}
                    </button>

                    {testResult && (
                        <div style={{
                            background: testResult.success ? '#f0fdf4' : '#fef2f2',
                            border: testResult.success ? '2px solid #16a34a' : '2px solid #dc2626',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <h3 style={{ 
                                color: testResult.success ? '#15803d' : '#dc2626',
                                margin: '0 0 15px 0'
                            }}>
                                {testResult.success ? '✅ Resultado Exitoso' : '❌ Error Detectado'}
                            </h3>
                            
                            <div style={{ 
                                fontSize: '14px',
                                color: testResult.success ? '#166534' : '#991b1b'
                            }}>
                                <p><strong>Mensaje:</strong> {testResult.message || testResult.error}</p>
                                
                                {testResult.details && (
                                    <div>
                                        <p><strong>Detalles:</strong></p>
                                        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                            {Object.entries(testResult.details).map(([key, value]) => (
                                                <li key={key}><strong>{key}:</strong> {value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {testResult.suggestions && (
                                    <div>
                                        <p><strong>Sugerencias:</strong></p>
                                        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                            {testResult.suggestions.map((suggestion, index) => (
                                                <li key={index}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div style={{
                        background: '#f1f5f9',
                        padding: '20px',
                        borderRadius: '8px',
                        marginTop: '25px'
                    }}>
                        <h4 style={{ color: '#475569', margin: '0 0 10px 0' }}>
                            💡 Notas importantes:
                        </h4>
                        <ul style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            <li>El sistema tiene múltiples respaldos (Gmail + SendGrid + Simulación)</li>
                            <li>Aunque falle Gmail, el checkout seguirá funcionando</li>
                            <li>Los emails se registran en los logs del servidor para debugging</li>
                            <li>En producción, considera usar SendGrid para mayor confiabilidad</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
