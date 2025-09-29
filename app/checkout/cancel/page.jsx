"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PayPalCancelPage() {
    const router = useRouter();
    const [pendingOrder, setPendingOrder] = useState(null);

    useEffect(() => {
        // Recuperar datos del pedido pendiente
        const savedOrder = localStorage.getItem('ls-pending-order');
        if (savedOrder) {
            setPendingOrder(JSON.parse(savedOrder));
        }
    }, []);

    const handleRetryPayment = () => {
        // Volver al checkout manteniendo los productos en el carrito
        router.push('/checkout');
    };

    const handleClearAndReturn = () => {
        // Limpiar pedido pendiente y volver al carrito
        localStorage.removeItem('ls-pending-order');
        router.push('/cart');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '60px 40px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #ffc107'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '24px' }}>⚠️</div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '600',
                        color: '#ffc107',
                        marginBottom: '16px',
                        letterSpacing: '-0.01em'
                    }}>
                        Pago Cancelado
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: '#666',
                        marginBottom: '24px'
                    }}>
                        Has cancelado el pago en PayPal. No se ha realizado ningún cargo.
                    </p>
                    
                    {pendingOrder && (
                        <div style={{
                            backgroundColor: '#fff8dc',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '32px',
                            border: '1px solid #ffc107'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#b8860b',
                                marginBottom: '12px',
                                fontWeight: '600'
                            }}>
                                🛒 Tu pedido sigue disponible
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#666',
                                lineHeight: '1.5'
                            }}>
                                • {pendingOrder.cartItems?.length || 0} productos en el carrito<br/>
                                • Total: ${pendingOrder.total?.toFixed(2) || '0.00'}<br/>
                                • Los productos se mantienen guardados
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={handleRetryPayment}
                            style={{
                                backgroundColor: '#0070ba',
                                color: 'white',
                                padding: '16px 32px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#005ea6'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#0070ba'}>
                            🔄 Intentar Pago Nuevamente
                        </button>
                        
                        <button
                            onClick={handleClearAndReturn}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#4a5568',
                                padding: '16px 32px',
                                border: '2px solid #4a5568',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#4a5568';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#4a5568';
                            }}>
                            ← Volver al Carrito
                        </button>
                    </div>

                    <div style={{
                        marginTop: '24px',
                        fontSize: '12px',
                        color: '#999'
                    }}>
                        Si tienes problemas con PayPal, puedes intentar con otro método de pago
                    </div>
                </div>
            </div>
        </div>
    );
}
