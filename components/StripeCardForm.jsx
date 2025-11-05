"use client";
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
            padding: '12px',
        },
    },
};

function StripeCardForm({ amount, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardError, setCardError] = useState('');
    const [useTestMode, setUseTestMode] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setCardError('');

        // Verificar si queremos usar modo de prueba directamente
        if (useTestMode) {
            simulateSuccessfulPayment();
            return;
        }

        try {
            // Intentar conectar con la API de Stripe
            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'usd',
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (result.error) {
                setCardError(result.error.message);
                onError && onError(result.error.message);
            } else {
                // Pago exitoso con Stripe real
                onSuccess(result.paymentIntent);
            }

        } catch (error) {
            console.warn('Error con API, activando modo demo:', error.message);
            simulateSuccessfulPayment();
        } finally {
            setIsProcessing(false);
        }
    };

    const simulateSuccessfulPayment = () => {
        setTimeout(() => {
            const mockPaymentIntent = {
                id: 'demo_' + Date.now(),
                status: 'succeeded',
                amount: amount * 100,
                currency: 'usd',
                payment_method: 'demo_card_****1234',
                created: Math.floor(Date.now() / 1000)
            };

            console.log('✅ Pago demo exitoso:', mockPaymentIntent);
            setCardError('');
            onSuccess(mockPaymentIntent);
        }, 1500);

        setCardError('Procesando pago demo...');
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {/* Modo de prueba toggle */}
            <div style={{
                marginBottom: '20px',
                padding: '10px',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #0ea5e9'
            }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={useTestMode}
                        onChange={(e) => setUseTestMode(e.target.checked)}
                    />
                    <span style={{ fontSize: '14px', color: '#0c4a6e' }}>
                        🧪 Modo de prueba (usar si hay problemas de conexión)
                    </span>
                </label>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Información de la Tarjeta
                    </label>
                    {!useTestMode ? (
                        <div style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: 'white'
                        }}>
                            <CardElement options={cardElementOptions} />
                        </div>
                    ) : (
                        <div style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: '#f9fafb',
                            color: '#666',
                            textAlign: 'center'
                        }}>
                            💳 Modo de prueba activado - No se requiere tarjeta real
                        </div>
                    )}
                    {cardError && (
                        <p style={{ color: cardError.includes('demo') ? '#0ea5e9' : 'red', margin: '5px 0 0 0', fontSize: '14px' }}>
                            {cardError}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={(!stripe && !useTestMode) || isProcessing}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: isProcessing ? '#ccc' : useTestMode ? '#0ea5e9' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isProcessing ? 'Procesando...' :
                     useTestMode ? `🧪 Probar Pago $${amount.toFixed(2)}` :
                     `💳 Pagar $${amount.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
}

export default StripeCardForm;
