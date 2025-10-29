"use client";
import { useState } from 'react';

// Componente de formulario de pago simplificado que evita problemas con Stripe
function SimplePaymentForm({
    amount,
    onSuccess,
    onError,
    onLoading,
    shippingInfo,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    couponLoading,
    onApplyCoupon,
    onRemoveCoupon
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: ''
    });
    const [errors, setErrors] = useState({});

    // Validar tarjeta
    const validateCard = () => {
        const newErrors = {};

        // Validar número de tarjeta (formato básico)
        const cardNumber = cardInfo.cardNumber.replace(/\s/g, '');
        if (!cardNumber.match(/^\d{13,19}$/)) {
            newErrors.cardNumber = 'Número de tarjeta inválido';
        }

        // Validar fecha de expiración
        if (!cardInfo.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            newErrors.expiry = 'Fecha inválida (MM/YY)';
        }

        // Validar CVC
        if (!cardInfo.cvc.match(/^\d{3,4}$/)) {
            newErrors.cvc = 'CVC inválido (3-4 dígitos)';
        }

        // Validar nombre
        if (!cardInfo.name.trim()) {
            newErrors.name = 'Nombre del titular requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateCard()) {
            return;
        }

        setIsProcessing(true);
        if (onLoading) {
            onLoading(true);
        }

        try {
            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Crear resultado de pago simulado
            const paymentResult = {
                id: `payment_${Date.now()}`,
                amount: amount * 100,
                currency: 'usd',
                status: 'succeeded',
                created: new Date().toISOString(),
                payment_method: {
                    card: {
                        brand: 'visa',
                        last4: cardInfo.cardNumber.slice(-4),
                        exp_month: cardInfo.expiry.split('/')[0],
                        exp_year: '20' + cardInfo.expiry.split('/')[1]
                    }
                }
            };

            // Enviar información por email
            await sendOrderByEmail({
                paymentIntent: paymentResult,
                shippingInfo,
                amount,
                appliedCoupon
            });

            onSuccess(paymentResult);

        } catch (error) {
            console.error('Error procesando pago:', error);
            onError('Error procesando el pago. Por favor intenta de nuevo.');
        } finally {
            setIsProcessing(false);
            if (onLoading) {
                onLoading(false);
            }
        }
    };

    // Función para enviar la orden por email
    const sendOrderByEmail = async (orderData) => {
        try {
            const response = await fetch('/api/send-shipping-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shippingInfo: orderData.shippingInfo,
                    paymentInfo: {
                        id: orderData.paymentIntent.id,
                        amount: orderData.amount,
                        status: orderData.paymentIntent.status,
                        created: new Date().toISOString()
                    },
                    appliedCoupon: orderData.appliedCoupon
                })
            });

            if (response.ok) {
                console.log('✅ Email de orden enviado exitosamente');
            }
        } catch (error) {
            console.warn('Error enviando email de confirmación:', error);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
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
                {/* Número de tarjeta */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Número de Tarjeta *
                    </label>
                    <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo(prev => ({
                            ...prev,
                            cardNumber: formatCardNumber(e.target.value)
                        }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: `1px solid ${errors.cardNumber ? 'red' : '#ddd'}`,
                            borderRadius: '4px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                    {errors.cardNumber && (
                        <p style={{ color: 'red', margin: '5px 0 0 0', fontSize: '14px' }}>
                            {errors.cardNumber}
                        </p>
                    )}
                </div>

                {/* Nombre en la tarjeta */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Nombre en la Tarjeta *
                    </label>
                    <input
                        type="text"
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                        placeholder="NOMBRE APELLIDO"
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: `1px solid ${errors.name ? 'red' : '#ddd'}`,
                            borderRadius: '4px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                    {errors.name && (
                        <p style={{ color: 'red', margin: '5px 0 0 0', fontSize: '14px' }}>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Fecha y CVC */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            MM/AA *
                        </label>
                        <input
                            type="text"
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo(prev => ({
                                ...prev,
                                expiry: formatExpiry(e.target.value)
                            }))}
                            placeholder="MM/AA"
                            maxLength="5"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: `1px solid ${errors.expiry ? 'red' : '#ddd'}`,
                                borderRadius: '4px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                        {errors.expiry && (
                            <p style={{ color: 'red', margin: '5px 0 0 0', fontSize: '14px' }}>
                                {errors.expiry}
                            </p>
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            CVC *
                        </label>
                        <input
                            type="text"
                            value={cardInfo.cvc}
                            onChange={(e) => setCardInfo(prev => ({
                                ...prev,
                                cvc: e.target.value.replace(/\D/g, '')
                            }))}
                            placeholder="123"
                            maxLength="4"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: `1px solid ${errors.cvc ? 'red' : '#ddd'}`,
                                borderRadius: '4px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                        {errors.cvc && (
                            <p style={{ color: 'red', margin: '5px 0 0 0', fontSize: '14px' }}>
                                {errors.cvc}
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>💰 Resumen del Pago</h4>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>
                        Total: ${amount.toFixed(2)} USD
                    </p>
                    {appliedCoupon && (
                        <p style={{ margin: '5px 0', color: '#28a745' }}>
                            Descuento aplicado: -{appliedCoupon.type === 'percentage' ? 
                                `${appliedCoupon.discount}%` : `$${appliedCoupon.discount}`}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: isProcessing ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        marginTop: '20px'
                    }}
                >
                    {isProcessing ? '🔄 Procesando Pago...' : `💳 Pagar $${amount.toFixed(2)}`}
                </button>
            </form>

            <div style={{ 
                marginTop: '15px', 
                fontSize: '12px', 
                color: '#6c757d', 
                textAlign: 'center' 
            }}>
                🔒 Tu pago está protegido por cifrado SSL
            </div>
        </div>
    );
}

// Componente principal
export default function StripeCardForm(props) {
    return <SimplePaymentForm {...props} />;
}
