"use client";
import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Configurar Stripe con clave de prueba (cambiar por tu clave real)
const stripePromise = loadStripe('pk_test_51HvjDiLr2z8xKlYGAOkRMeQkqJJ9qzQdR6tLqGJYQaLqGJKQwRtQsQwRtQs');

// Componente del formulario de tarjeta real
function CardPaymentForm({ amount, cartItems, onSuccess, onError, onLoading }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zipCode: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            onError('Stripe no está listo');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            onError('Elemento de tarjeta no encontrado');
            return;
        }

        // Validar campos requeridos
        if (!customerInfo.name || !customerInfo.email) {
            onError('Por favor completa nombre y email');
            return;
        }

        setIsProcessing(true);
        if (onLoading) {
            onLoading(true);
        }

        try {
            // Crear Payment Intent real
            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'usd',
                    items: cartItems,
                    customerInfo: customerInfo
                }),
            });

            const { clientSecret, error: apiError } = await response.json();

            if (apiError) {
                throw new Error(apiError);
            }

            // Confirmar pago con Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: customerInfo.name,
                        email: customerInfo.email,
                        address: {
                            line1: customerInfo.address,
                            city: customerInfo.city,
                            postal_code: customerInfo.zipCode
                        }
                    }
                }
            });

            if (error) {
                onError(`Error en el pago: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess({
                    transactionId: paymentIntent.id,
                    paymentMethod: 'Stripe - Tarjeta Real',
                    amount: amount,
                    status: 'completed',
                    receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
                });
            }
        } catch (error) {
            onError(`Error procesando el pago: ${error.message}`);
        } finally {
            setIsProcessing(false);
            if (onLoading) {
                onLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'var(--pure-white)',
            padding: '30px',
            borderRadius: '16px',
            border: '2px solid var(--primary-blue)',
            boxShadow: '0 10px 25px rgba(30, 58, 138, 0.1)'
        }}>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--dark-black)',
                margin: '0 0 24px 0',
                textAlign: 'center',
                textTransform: 'uppercase',
                borderBottom: '3px solid var(--accent-yellow)',
                paddingBottom: '12px'
            }}>
                💳 Información de Pago
            </h3>

            {/* Información del cliente */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div className="form-group">
                    <label className="form-label" style={{
                        color: 'var(--dark-black)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        className="form-input"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                        required
                        style={{
                            border: '2px solid var(--border-gray)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--dark-black)',
                            background: 'var(--off-white)',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-blue)';
                            e.target.style.backgroundColor = 'var(--pure-white)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border-gray)';
                            e.target.style.backgroundColor = 'var(--off-white)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{
                        color: 'var(--dark-black)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        Email *
                    </label>
                    <input
                        type="email"
                        className="form-input"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
                        required
                        style={{
                            border: '2px solid var(--border-gray)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--dark-black)',
                            background: 'var(--off-white)',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-blue)';
                            e.target.style.backgroundColor = 'var(--pure-white)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border-gray)';
                            e.target.style.backgroundColor = 'var(--off-white)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Elemento de tarjeta de Stripe */}
            <div className="form-group">
                <label className="form-label" style={{
                    color: 'var(--dark-black)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px'
                }}>
                    Información de Tarjeta *
                </label>
                <div style={{
                    border: '2px solid var(--border-gray)',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: 'var(--off-white)',
                    transition: 'all 0.3s ease'
                }}>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#111827',
                                    fontWeight: '500',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    '::placeholder': {
                                        color: '#6b7280'
                                    }
                                },
                                invalid: {
                                    color: '#dc2626'
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Resumen del pago */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                padding: '20px',
                borderRadius: '12px',
                margin: '24px 0',
                border: '2px solid var(--accent-yellow)'
            }}>
                <h4 style={{
                    color: 'var(--pure-white)',
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                }}>
                    💰 Total a Pagar
                </h4>
                <p style={{
                    color: 'var(--accent-yellow)',
                    fontSize: '24px',
                    fontWeight: '800',
                    margin: 0,
                    textAlign: 'center',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                }}>
                    ${(amount || 0).toFixed(2)}
                </p>
            </div>

            {/* Botón de pago */}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                style={{
                    width: '100%',
                    background: isProcessing
                        ? 'var(--border-gray)'
                        : 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)',
                    color: isProcessing ? 'var(--gray-text)' : 'var(--dark-black)',
                    border: '3px solid var(--bright-yellow)',
                    padding: '18px 32px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    opacity: isProcessing ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                    if (!isProcessing) {
                        e.target.style.background = 'linear-gradient(135deg, var(--bright-yellow) 0%, var(--accent-yellow) 100%)';
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 15px 30px rgba(251, 191, 36, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isProcessing) {
                        e.target.style.background = 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }
                }}
            >
                {isProcessing ? '⏳ Procesando Pago...' : '🚀 Pagar Ahora'}
            </button>

            {/* Información de seguridad */}
            <div style={{
                background: 'var(--off-white)',
                border: '2px solid var(--border-gray)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '20px',
                textAlign: 'center'
            }}>
                <p style={{
                    fontSize: '12px',
                    color: 'var(--light-black)',
                    margin: 0,
                    fontWeight: '500'
                }}>
                    🔒 Tu información está protegida con encriptación SSL de 256 bits
                </p>
            </div>
        </form>
    );
}

// Componente wrapper con Elements provider
export default function StripeCardForm({ amount, cartItems, onSuccess, onError, onLoading }) {
    return (
        <Elements stripe={stripePromise}>
            <CardPaymentForm 
                amount={amount}
                cartItems={cartItems}
                onSuccess={onSuccess}
                onError={onError}
                onLoading={onLoading}
            />
        </Elements>
    );
}
