"use client";
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Estilos para el CardElement de Stripe
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
        invalid: {
            color: '#9e2146',
        },
    },
};

function StripeCardForm({
    amount,
    onSuccess,
    onError,
    onLoading,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    couponLoading,
    onApplyCoupon,
    onRemoveCoupon
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardError, setCardError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setCardError('Card element not found');
            return;
        }

        setIsProcessing(true);
        setCardError('');
        if (onLoading) {
            onLoading(true);
        }

        try {
            // Crear payment intent en el servidor
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

            const { clientSecret, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            // Confirmar el pago con Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                }
            });

            if (stripeError) {
                setCardError(stripeError.message);
                if (onError) {
                    onError(stripeError.message);
                }
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }

        } catch (error) {
            console.error('Error procesando pago:', error);
            setCardError(error.message || 'Error procesando el pago');
            if (onError) {
                onError(error.message || 'Error procesando el pago');
            }
        } finally {
            setIsProcessing(false);
            if (onLoading) {
                onLoading(false);
            }
        }
    };

    return (
        <div className="payment-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3>💳 Información de Pago</h3>

            {/* Cupones */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>🎟️ Código de Cupón (Opcional)</h4>
                {!appliedCoupon ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Ingresa tu código de cupón"
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                        <button
                            type="button"
                            onClick={onApplyCoupon}
                            disabled={couponLoading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {couponLoading ? 'Validando...' : 'Aplicar'}
                        </button>
                    </div>
                ) : (
                    <div style={{ backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px' }}>
                        <p style={{ margin: 0, color: '#155724' }}>
                            ✅ Cupón "{appliedCoupon.code}" aplicado - {appliedCoupon.description}
                        </p>
                        <button
                            type="button"
                            onClick={onRemoveCoupon}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#721c24',
                                border: 'none',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Remover cupón
                        </button>
                    </div>
                )}

                {couponError && (
                    <p style={{ color: 'red', margin: '5px 0 0 0' }}>{couponError}</p>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Información de la tarjeta con Stripe Elements */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Información de la Tarjeta *
                    </label>
                    <div style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white'
                    }}>
                        <CardElement options={cardElementOptions} />
                    </div>
                    {cardError && (
                        <p style={{ color: 'red', margin: '5px 0 0 0', fontSize: '14px' }}>
                            {cardError}
                        </p>
                    )}
                </div>

                {/* Botón de pago */}
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: isProcessing ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        marginTop: '10px'
                    }}
                >
                    {isProcessing ? '⏳ Procesando Pago...' : `💳 Pagar $${amount.toFixed(2)}`}
                </button>
            </form>

            {/* Información de seguridad */}
            <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#6c757d'
            }}>
                <p style={{ margin: 0, textAlign: 'center' }}>
                    🔒 Tu información está protegida con encriptación SSL
                </p>
            </div>
        </div>
    );
}

export default StripeCardForm;
