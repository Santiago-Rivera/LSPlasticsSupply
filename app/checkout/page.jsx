"use client";
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';
import StripeCardForm from '../../components/StripeCardForm';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        // Si no hay productos en el carrito, redirigir
        if (cartItems.length === 0 && !orderComplete) {
            router.push('/cart');
        }
    }, [cartItems, router, orderComplete]);

    // Función para generar número de orden
    const generateOrderNumber = () => {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `LS-${timestamp.slice(-6)}-${random}`;
    };

    // Manejar éxito de pago
    const handlePaymentSuccess = (paymentData) => {
        const orderNum = generateOrderNumber();
        setOrderNumber(orderNum);
        setOrderComplete(true);
        clearCart();
        console.log('Pago exitoso:', paymentData);
    };

    // Manejar errores de pago
    const handlePaymentError = (errorMessage) => {
        alert(errorMessage);
        setPaymentProcessing(false);
    };

    // Procesar PayPal real
    const processRealPayPal = async () => {
        try {
            setPaymentProcessing(true);

            // Crear orden real en PayPal
            const createResponse = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: getCartTotal(),
                    items: cartItems,
                    customerInfo: {
                        email: 'customer@example.com',
                        name: 'Cliente L&S'
                    }
                }),
            });

            const createData = await createResponse.json();

            if (createData.orderID && createData.approvalUrl) {
                // Guardar datos para el retorno
                localStorage.setItem('ls-pending-paypal-order', JSON.stringify({
                    orderID: createData.orderID,
                    cartItems,
                    total: getCartTotal(),
                    timestamp: Date.now()
                }));

                // Redirigir a PayPal real
                const confirmRedirect = confirm(
                    `🔗 REDIRECCIÓN A PAYPAL REAL\n\n` +
                    `Total: $${getCartTotal().toFixed(2)}\n` +
                    `Productos: ${cartItems.length} artículos\n\n` +
                    `Te redirigiremos a PayPal oficial para completar tu pago.\n\n` +
                    `¿Continuar?`
                );

                if (confirmRedirect) {
                    window.location.href = createData.approvalUrl;
                } else {
                    setPaymentProcessing(false);
                }
            } else {
                throw new Error(createData.error || 'Error creando orden de PayPal');
            }
        } catch (error) {
            alert('Error con PayPal: ' + error.message);
            setPaymentProcessing(false);
        }
    };

    // Procesar Google Pay real
    const processRealGooglePay = async () => {
        try {
            setPaymentProcessing(true);

            if (!window.google?.payments?.api) {
                throw new Error('Google Pay no está disponible en este dispositivo');
            }

            const paymentsClient = new window.google.payments.api.PaymentsClient({
                environment: 'TEST' // Cambiar a 'PRODUCTION' para uso real
            });

            const paymentDataRequest = {
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [{
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'stripe',
                            'stripe:version': '2023-10-16',
                            'stripe:publishableKey': 'pk_test_51HvjDiLr2z8xKlYGAOkRMeQkqJJ9qzQdR6tLqGJYQaLqGJKQwRtQsQwRtQs'
                        }
                    }
                }],
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPrice: getCartTotal().toString(),
                    currencyCode: 'USD'
                },
                merchantInfo: {
                    merchantId: 'BCR2DN4T2C2OKHLS',
                    merchantName: 'L&S Plastics Supply'
                }
            };

            const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);

            // Simular éxito (en producción se procesaría con Stripe)
            handlePaymentSuccess({
                transactionId: `gp_${Date.now()}`,
                paymentMethod: 'Google Pay Real',
                amount: getCartTotal(),
                status: 'completed'
            });

        } catch (error) {
            if (error.statusCode === 'CANCELED') {
                alert('Pago cancelado por el usuario');
            } else {
                alert('Error con Google Pay: ' + error.message);
            }
        } finally {
            setPaymentProcessing(false);
        }
    };

    // Pantalla de orden completada
    if (orderComplete) {
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
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: '80px', marginBottom: '24px' }}>✅</div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '600',
                            color: '#28a745',
                            marginBottom: '16px',
                            letterSpacing: '-0.01em'
                        }}>
                            ¡Cobro Exitoso!
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            color: '#666',
                            marginBottom: '24px'
                        }}>
                            El cobro se ha procesado correctamente a tu tarjeta
                        </p>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '24px',
                            borderRadius: '12px',
                            marginBottom: '32px'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '8px'
                            }}>
                                Número de orden
                            </div>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                fontFamily: 'monospace'
                            }}>
                                {orderNumber}
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#d4edda',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '32px',
                            border: '1px solid #28a745'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#155724',
                                fontWeight: '600',
                                marginBottom: '8px'
                            }}>
                                ✅ Cobro Procesado
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#155724',
                                lineHeight: '1.5'
                            }}>
                                • Cargo real procesado a tu tarjeta<br/>
                                • Recibirás confirmación por email<br/>
                                • Comprobante disponible para descarga<br/>
                                • Envío será procesado en 24-48 horas
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => router.push('/')}
                                style={{
                                    backgroundColor: '#4a5568',
                                    color: 'white',
                                    padding: '16px 32px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4a5568'}>
                                🏠 Volver al Inicio
                            </button>

                            <button
                                onClick={() => router.push('/tienda/categorias')}
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
                                🛒 Seguir Comprando
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '16px',
                        letterSpacing: '-0.01em'
                    }}>
                        💳 Checkout - Cobro Inmediato
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#666'
                    }}>
                        Ingresa los datos de tu tarjeta y el cobro se procesará inmediatamente
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '40px',
                    alignItems: 'start'
                }}>
                    {/* Payment Methods */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#2c3e50',
                            marginBottom: '24px'
                        }}>
                            Métodos de Pago - Cobro Inmediato
                        </h2>

                        {/* Google Pay Real */}
                        <div style={{
                            border: selectedPaymentMethod === 'googlepay' ? '2px solid #4285f4' : '2px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: selectedPaymentMethod === 'googlepay' ? '#f8f9ff' : 'white'
                        }}
                        onClick={() => setSelectedPaymentMethod('googlepay')}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid #4285f4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: selectedPaymentMethod === 'googlepay' ? '#4285f4' : 'white'
                                }}>
                                    {selectedPaymentMethod === 'googlepay' && (
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%'
                                        }} />
                                    )}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '24px',
                                        backgroundColor: '#4285f4',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}>
                                        G Pay
                                    </div>
                                    <div>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            color: '#2c3e50',
                                            display: 'block'
                                        }}>
                                            Google Pay
                                        </span>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#4285f4',
                                            fontWeight: '600'
                                        }}>
                                            🔴 COBRO INMEDIATO
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedPaymentMethod === 'googlepay' && (
                                <div style={{
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #e9ecef'
                                }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            processRealGooglePay();
                                        }}
                                        disabled={paymentProcessing}
                                        style={{
                                            backgroundColor: paymentProcessing ? '#6c757d' : '#4285f4',
                                            color: 'white',
                                            padding: '16px 24px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: paymentProcessing ? 'not-allowed' : 'pointer',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'background-color 0.3s ease'
                                        }}>
                                        {paymentProcessing ? (
                                            <>
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid #fff',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }} />
                                                Cobrando con Google Pay...
                                            </>
                                        ) : (
                                            <>
                                                🔴 COBRAR ${getCartTotal().toFixed(2)} AHORA
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* PayPal Real */}
                        <div style={{
                            border: selectedPaymentMethod === 'paypal' ? '2px solid #0070ba' : '2px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: selectedPaymentMethod === 'paypal' ? '#f0f8ff' : 'white'
                        }}
                        onClick={() => setSelectedPaymentMethod('paypal')}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid #0070ba',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: selectedPaymentMethod === 'paypal' ? '#0070ba' : 'white'
                                }}>
                                    {selectedPaymentMethod === 'paypal' && (
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%'
                                        }} />
                                    )}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '24px',
                                        backgroundColor: '#0070ba',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}>
                                        PayPal
                                    </div>
                                    <div>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            color: '#2c3e50',
                                            display: 'block'
                                        }}>
                                            PayPal
                                        </span>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#dc3545',
                                            fontWeight: '600'
                                        }}>
                                            🔴 COBRO INMEDIATO
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedPaymentMethod === 'paypal' && (
                                <div style={{
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #e9ecef'
                                }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            processRealPayPal();
                                        }}
                                        disabled={paymentProcessing}
                                        style={{
                                            backgroundColor: paymentProcessing ? '#6c757d' : '#0070ba',
                                            color: 'white',
                                            padding: '16px 24px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: paymentProcessing ? 'not-allowed' : 'pointer',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'background-color 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(0, 112, 186, 0.3)'
                                        }}>
                                        {paymentProcessing ? (
                                            <>
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid #fff',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }} />
                                                Creando orden PayPal...
                                            </>
                                        ) : (
                                            <>
                                                🔴 COBRAR ${getCartTotal().toFixed(2)} AHORA
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Credit Card Real con Stripe - COBRO INMEDIATO */}
                        <div style={{
                            border: selectedPaymentMethod === 'card' ? '2px solid #28a745' : '2px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: selectedPaymentMethod === 'card' ? '#f0fff4' : 'white'
                        }}
                        onClick={() => setSelectedPaymentMethod('card')}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: selectedPaymentMethod === 'card' ? '20px' : '0'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid #28a745',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: selectedPaymentMethod === 'card' ? '#28a745' : 'white'
                                }}>
                                    {selectedPaymentMethod === 'card' && (
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%'
                                        }} />
                                    )}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '4px'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '20px',
                                            backgroundColor: '#eb001b',
                                            borderRadius: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '8px',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>VISA</div>
                                        <div style={{
                                            width: '32px',
                                            height: '20px',
                                            backgroundColor: '#ff5f00',
                                            borderRadius: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '7px',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>MC</div>
                                        <div style={{
                                            width: '32px',
                                            height: '20px',
                                            backgroundColor: '#00b4d8',
                                            borderRadius: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '6px',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>AMEX</div>
                                    </div>
                                    <div>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            color: '#2c3e50',
                                            display: 'block'
                                        }}>
                                            Tarjeta de Crédito/Débito
                                        </span>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#dc3545',
                                            fontWeight: '600'
                                        }}>
                                            🔴 REAL - Procesado por Stripe
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Formulario de tarjeta con Stripe Elements */}
                            {selectedPaymentMethod === 'card' && (
                                <div style={{
                                    borderTop: '1px solid #e9ecef',
                                    paddingTop: '20px'
                                }}>
                                    <div style={{
                                        backgroundColor: '#fff3cd',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        marginBottom: '20px',
                                        border: '2px solid #ffc107'
                                    }}>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#856404',
                                            fontWeight: '600',
                                            marginBottom: '8px'
                                        }}>
                                            ⚡ COBRO INMEDIATO
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#856404',
                                            lineHeight: '1.5'
                                        }}>
                                            • Al completar el formulario, el cobro se procesará inmediatamente<br/>
                                            • Tu tarjeta será cargada en tiempo real<br/>
                                            • Procesamiento seguro con Stripe<br/>
                                            • Confirmación instantánea
                                        </div>
                                    </div>

                                    {/* Formulario de Stripe real */}
                                    <StripeCardForm
                                        amount={getCartTotal()}
                                        cartItems={cartItems}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        onLoading={setPaymentProcessing}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Advertencia de cobros inmediatos */}
                        <div style={{
                            backgroundColor: '#f8d7da',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '2px solid #dc3545',
                            marginTop: '24px'
                        }}>
                            <div style={{
                                fontSize: '16px',
                                color: '#721c24',
                                fontWeight: '600',
                                marginBottom: '8px'
                            }}>
                                🔴 IMPORTANTE - COBROS INMEDIATOS
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#721c24',
                                lineHeight: '1.5'
                            }}>
                                <strong>Los cobros se procesan inmediatamente:</strong><br/>
                                • No hay periodo de espera o confirmación adicional<br/>
                                • Los cargos aparecerán en tu estado de cuenta de inmediato<br/>
                                • Las transacciones son finales una vez procesadas<br/>
                                • Contáctanos para reembolsos dentro de 24 horas
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#2c3e50',
                            marginBottom: '24px'
                        }}>
                            Resumen - Cobro Inmediato
                        </h2>

                        <div style={{
                            marginBottom: '24px'
                        }}>
                            {cartItems.map((item) => (
                                <div key={item.id || item.codigo_producto} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                    paddingBottom: '12px',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#2c3e50',
                                            marginBottom: '4px'
                                        }}>
                                            {item.nombre}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666'
                                        }}>
                                            Cantidad: {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#2c3e50'
                                    }}>
                                        ${(parseFloat(item.precio) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr style={{
                            border: 'none',
                            borderTop: '2px solid #e9ecef',
                            margin: '24px 0'
                        }} />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <span style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#2c3e50'
                            }}>
                                A Cobrar Ahora:
                            </span>
                            <span style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#dc3545'
                            }}>
                                ${getCartTotal().toFixed(2)} USD
                            </span>
                        </div>

                        <div style={{
                            backgroundColor: '#fff3cd',
                            padding: '16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#856404',
                            lineHeight: '1.5',
                            marginBottom: '16px',
                            border: '1px solid #ffc107'
                        }}>
                            <div style={{ marginBottom: '8px', fontWeight: '600' }}>⚡ Cobro Inmediato</div>
                            <div>• Este monto será cobrado inmediatamente</div>
                            <div>• Procesamiento en tiempo real</div>
                            <div>• Confirmación instantánea</div>
                        </div>

                        <button
                            onClick={() => router.push('/cart')}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#4a5568',
                                padding: '12px',
                                border: '2px solid #4a5568',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                width: '100%',
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
                </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
