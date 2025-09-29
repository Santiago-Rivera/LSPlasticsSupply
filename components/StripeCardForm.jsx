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
        onLoading(true);

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
            onLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#2c3e50',
                '::placeholder': {
                    color: '#aab7c4',
                },
                iconColor: '#666',
            },
            invalid: {
                color: '#dc3545',
                iconColor: '#dc3545',
            },
        },
        hidePostalCode: false,
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Información del cliente */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px'
            }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#2c3e50',
                        marginBottom: '8px'
                    }}>
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Juan Pérez"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            outline: 'none',
                            fontFamily: 'Inter, system-ui, sans-serif'
                        }}
                    />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#2c3e50',
                        marginBottom: '8px'
                    }}>
                        Email *
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="juan@ejemplo.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            outline: 'none',
                            fontFamily: 'Inter, system-ui, sans-serif'
                        }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#2c3e50',
                        marginBottom: '8px'
                    }}>
                        Dirección
                    </label>
                    <input
                        type="text"
                        placeholder="Calle 123 #45-67"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            outline: 'none',
                            fontFamily: 'Inter, system-ui, sans-serif'
                        }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#2c3e50',
                        marginBottom: '8px'
                    }}>
                        Ciudad
                    </label>
                    <input
                        type="text"
                        placeholder="Ciudad"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '16px',
                            outline: 'none',
                            fontFamily: 'Inter, system-ui, sans-serif'
                        }}
                    />
                </div>
            </div>

            {/* Elemento de tarjeta de Stripe */}
            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2c3e50',
                    marginBottom: '12px'
                }}>
                    💳 Información de la Tarjeta (Stripe Real)
                </label>
                <div style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef'
                }}>
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            {/* Botón de pago */}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                style={{
                    backgroundColor: isProcessing ? '#6c757d' : '#28a745',
                    color: 'white',
                    padding: '16px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    width: '100%',
                    transition: 'background-color 0.3s ease',
                    opacity: !stripe ? 0.5 : 1
                }}>
                {isProcessing ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid #fff',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        Procesando Cobro Real...
                    </div>
                ) : (
                    `🔴 COBRAR ${amount.toFixed(2)} USD AHORA`
                )}
            </button>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
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
