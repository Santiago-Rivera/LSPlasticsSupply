"use client";
import { useState } from 'react';

// Componente de formulario de pago simplificado sin APIs externas
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
        
        if (!cardInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
            newErrors.cardNumber = 'Número de tarjeta inválido (16 dígitos)';
        }
        
        if (!cardInfo.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            newErrors.expiry = 'Fecha inválida (MM/YY)';
        }
        
        if (!cardInfo.cvc.match(/^\d{3,4}$/)) {
            newErrors.cvc = 'CVC inválido (3-4 dígitos)';
        }
        
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
            // Simular procesamiento de pago (sin APIs externas)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simular pago exitoso
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

            // Guardar información completa del pedido en localStorage
            const orderData = {
                payment: paymentResult,
                shipping: shippingInfo,
                amount: amount,
                timestamp: new Date().toISOString(),
                appliedCoupon: appliedCoupon
            };
            
            try {
                localStorage.setItem('lastOrder', JSON.stringify(orderData));
                console.log('✅ Pedido guardado localmente:', orderData);
            } catch (e) {
                console.warn('No se pudo guardar en localStorage:', e);
            }

            onSuccess(paymentResult);
        } catch (error) {
            console.error('Error en pago simulado:', error);
            onError('Error procesando el pago. Por favor intenta de nuevo.');
        } finally {
            setIsProcessing(false);
            if (onLoading) {
                onLoading(false);
            }
        }
    };

    // Formatear número de tarjeta
    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ').substr(0, 19) : cleaned;
    };

    // Formatear fecha de expiración
    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    return (
        <div>
            {/* Sección de cupones */}
            <div style={{
                background: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '2px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 16px 0'
                }}>
                    🎟️ Código de Cupón (Opcional)
                </h3>
                
                {!appliedCoupon ? (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="INGRESA TU CÓDIGO DE CUPÓN"
                                disabled={couponLoading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: `2px solid ${couponError ? '#dc2626' : '#d1d5db'}`,
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {couponError && (
                                <span style={{
                                    color: '#dc2626',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                    display: 'block'
                                }}>
                                    {couponError}
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onApplyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            style={{
                                background: couponLoading ? '#9ca3af' : '#f59e0b',
                                color: 'white',
                                border: 'none',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: couponLoading || !couponCode.trim() ? 'not-allowed' : 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {couponLoading ? 'Validando...' : 'Aplicar'}
                        </button>
                    </div>
                ) : (
                    <div style={{
                        background: '#dcfce7',
                        border: '2px solid #22c55e',
                        padding: '16px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', color: '#15803d', fontSize: '16px' }}>
                                ✅ Cupón Aplicado: {appliedCoupon.code}
                            </h4>
                            <p style={{ margin: 0, color: '#166534', fontSize: '14px' }}>
                                {appliedCoupon.description}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onRemoveCoupon}
                            style={{
                                background: 'transparent',
                                color: '#dc2626',
                                border: '1px solid #dc2626',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            Remover
                        </button>
                    </div>
                )}
            </div>

            {/* Formulario de pago */}
            <form onSubmit={handleSubmit}>
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 20px 0',
                    borderBottom: '3px solid #fbbf24',
                    paddingBottom: '8px'
                }}>
                    💳 INFORMACIÓN DE PAGO
                </h2>

                <div style={{ display: 'grid', gap: '16px' }}>
                    {/* Nombre del titular */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            NOMBRE COMPLETO *
                        </label>
                        <input
                            type="text"
                            value={cardInfo.name}
                            onChange={(e) => setCardInfo(prev => ({...prev, name: e.target.value}))}
                            placeholder=""
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: `2px solid ${errors.name ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        {errors.name && (
                            <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                {errors.name}
                            </span>
                        )}
                    </div>

                    {/* Información de tarjeta */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            INFORMACIÓN DE TARJETA *
                        </label>
                        <input
                            type="text"
                            value={cardInfo.cardNumber}
                            onChange={(e) => setCardInfo(prev => ({
                                ...prev, 
                                cardNumber: formatCardNumber(e.target.value)
                            }))}
                            placeholder=""
                            maxLength="19"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: `2px solid ${errors.cardNumber ? '#dc2626' : '#d1d5db'}`,
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                marginBottom: '8px',
                                boxSizing: 'border-box'
                            }}
                        />
                        {errors.cardNumber && (
                            <span style={{ color: '#dc2626', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                                {errors.cardNumber}
                            </span>
                        )}
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input
                                type="text"
                                value={cardInfo.expiry}
                                onChange={(e) => setCardInfo(prev => ({
                                    ...prev, 
                                    expiry: formatExpiry(e.target.value)
                                }))}
                                placeholder="MM / AA"
                                maxLength="5"
                                style={{
                                    padding: '12px',
                                    border: `2px solid ${errors.expiry ? '#dc2626' : '#d1d5db'}`,
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <input
                                type="text"
                                value={cardInfo.cvc}
                                onChange={(e) => setCardInfo(prev => ({
                                    ...prev, 
                                    cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                                }))}
                                placeholder="CVC"
                                maxLength="4"
                                style={{
                                    padding: '12px',
                                    border: `2px solid ${errors.cvc ? '#dc2626' : '#d1d5db'}`,
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        {(errors.expiry || errors.cvc) && (
                            <div style={{ marginTop: '4px' }}>
                                {errors.expiry && (
                                    <span style={{ color: '#dc2626', fontSize: '12px', display: 'block' }}>
                                        {errors.expiry}
                                    </span>
                                )}
                                {errors.cvc && (
                                    <span style={{ color: '#dc2626', fontSize: '12px', display: 'block' }}>
                                        {errors.cvc}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CÓDIGO DE CUPÓN (OPCIONAL) */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '3px solid #fbbf24'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
                        <h3 style={{ 
                            margin: '0 0 8px 0', 
                            fontSize: '24px', 
                            fontWeight: '800',
                            textTransform: 'uppercase'
                        }}>
                            TOTAL A PAGAR
                        </h3>
                        <p style={{ 
                            margin: '0', 
                            fontSize: '32px', 
                            fontWeight: '800',
                            color: '#fbbf24'
                        }}>
                            ${amount.toFixed(2)}
                        </p>
                    </div>

                    {/* Botón de pago */}
                    <button
                        type="submit"
                        disabled={isProcessing}
                        style={{
                            background: isProcessing 
                                ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
                                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            border: '3px solid #fbbf24',
                            padding: '20px',
                            borderRadius: '12px',
                            fontSize: '18px',
                            fontWeight: '700',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {isProcessing ? '⏳ Procesando pago...' : `🔒 PAGAR AHORA $${amount.toFixed(2)}`}
                    </button>
                </div>

                {/* Información de seguridad */}
                <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #22c55e',
                    padding: '12px',
                    borderRadius: '8px',
                    marginTop: '16px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#15803d',
                        fontWeight: '500'
                    }}>
                        🔒 Tu información está protegida con encriptación SSL de 256 bits
                    </p>
                </div>
            </form>
        </div>
    );
}

// Componente principal exportado
export default function StripeCardForm(props) {
    return <SimplePaymentForm {...props} />;
}
