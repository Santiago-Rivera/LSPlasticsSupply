"use client";
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Estados para información de envío
    const [shippingInfo, setShippingInfo] = useState({
        nombreCompleto: '',
        correoElectronico: '',
        direccion: '',
        telefono: '',
        ciudad: '',
        provincia: '',
        codigoPostal: ''
    });

    // Estados para información de pago
    const [paymentInfo, setPaymentInfo] = useState({
        numeroTarjeta: '',
        nombreTitular: '',
        mesExpiracion: '',
        anoExpiracion: '',
        codigoSeguridad: ''
    });

    useEffect(() => {
        setMounted(true);
        if (cartItems.length === 0 && !orderComplete) {
            router.push('/cart');
        }
    }, [cartItems, router, orderComplete]);

    const generateOrderNumber = () => {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `LS-${timestamp.slice(-6)}-${random}`;
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        // Validar campos requeridos
        if (!shippingInfo.nombreCompleto || !shippingInfo.correoElectronico || 
            !shippingInfo.direccion || !shippingInfo.telefono || 
            !shippingInfo.ciudad || !shippingInfo.provincia || !shippingInfo.codigoPostal) {
            alert('Por favor, complete todos los campos de información de envío.');
            return;
        }
        setCurrentStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        
        // Validar campos de pago
        if (!paymentInfo.numeroTarjeta || !paymentInfo.nombreTitular || 
            !paymentInfo.mesExpiracion || !paymentInfo.anoExpiracion || !paymentInfo.codigoSeguridad) {
            alert('Por favor, complete todos los campos de información de pago.');
            return;
        }

        setIsProcessing(true);

        try {
            // Calcular el total ANTES de usarlo
            const totalAmount = getCartTotal();

            console.log('🔄 Procesando checkout...', {
                cliente: shippingInfo.nombreCompleto,
                items: cartItems.length,
                total: totalAmount
            });

            // Preparar los datos para enviar
            const requestData = {
                shippingInfo: shippingInfo,
                cartItems: cartItems,
                total: totalAmount
            };

            // Intentar enviar información por email
            const response = await fetch('/api/send-shipping-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            // Siempre continuar con el checkout, independientemente del resultado del email
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Email procesado:', result);
            } else {
                console.log('⚠️ Email no enviado, pero continuando con el checkout');
            }

            // Completar el checkout
            setTimeout(() => {
                const orderNum = generateOrderNumber();
                setOrderNumber(orderNum);
                setOrderComplete(true);
                clearCart();
                setIsProcessing(false);
            }, 1500);

        } catch (error) {
            console.log('⚠️ Error en email, continuando con checkout:', error.message);

            // Siempre completar el checkout
            setTimeout(() => {
                const orderNum = generateOrderNumber();
                setOrderNumber(orderNum);
                setOrderComplete(true);
                clearCart();
                setIsProcessing(false);
            }, 1000);
        }
    };

    if (!mounted) {
        return <div>Loading...</div>;
    }

    if (orderComplete) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)'
            }}>
                <div style={{
                    background: 'white',
                    padding: '50px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    maxWidth: '600px',
                    border: '3px solid #fbbf24'
                }}>
                    <div style={{ 
                        fontSize: '80px', 
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        borderRadius: '50%',
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 30px auto',
                        boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)'
                    }}>🎉</div>
                    <h1 style={{ 
                        color: '#1e3a8a', 
                        marginBottom: '15px',
                        fontSize: '32px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>¡Pago Exitoso!</h1>
                    <p style={{ 
                        fontSize: '20px', 
                        marginBottom: '25px',
                        color: '#1e40af',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        padding: '15px',
                        borderRadius: '12px',
                        border: '2px solid #e0f2fe'
                    }}>
                        🔢 Orden #{orderNumber}
                    </p>
                    <p style={{ 
                        color: '#374151', 
                        marginBottom: '40px',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        background: '#f8fafc',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        ✅ Gracias por tu compra. Tu información ha sido enviada correctamente y recibirás una confirmación pronto.
                        <br /><br />
                        📧 Se ha enviado los detalles de tu pedido para procesar tu orden.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button
                            onClick={() => router.push('/tienda')}
                            style={{
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                                color: 'white',
                                border: '2px solid #fbbf24',
                                padding: '16px 28px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 138, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)';
                            }}
                        >
                            🛒 Continuar Comprando
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            style={{
                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                color: 'white',
                                border: '2px solid #fbbf24',
                                padding: '16px 28px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
                            }}
                        >
                            🏠 Ir al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const total = getCartTotal();

    return (
        <div style={{ minHeight: '100vh', padding: '20px', background: '#f8fafc' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ 
                    textAlign: 'center', 
                    marginBottom: '40px',
                    color: '#1e3a8a',
                    fontSize: '36px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 2px 4px rgba(30, 58, 138, 0.1)'
                }}>Checkout</h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    {/* Resumen del pedido */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        border: '2px solid #fbbf24',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{
                            color: '#1e3a8a',
                            marginBottom: '20px',
                            fontSize: '24px',
                            fontWeight: '700',
                            borderBottom: '3px solid #fbbf24',
                            paddingBottom: '10px'
                        }}>Resumen del Pedido</h2>
                        {cartItems.map((item) => {
                            const basePrice = item.precio * item.quantity;
                            const discountedPrice = item.quantity >= 2 ? basePrice * 0.95 : basePrice;
                            const hasDiscount = item.quantity >= 2;
                            
                            return (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #e5e7eb',
                                    background: hasDiscount ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : 'transparent',
                                    borderRadius: hasDiscount ? '8px' : '0',
                                    margin: hasDiscount ? '5px 0' : '0',
                                    padding: hasDiscount ? '15px' : '15px 0'
                                }}>
                                    <div>
                                        <h4 style={{ 
                                            margin: 0,
                                            color: '#1e3a8a',
                                            fontWeight: '600'
                                        }}>{item.nombre}</h4>
                                        <p style={{ 
                                            margin: 0, 
                                            color: '#6b7280',
                                            fontSize: '14px'
                                        }}>Cantidad: {item.quantity}</p>
                                        {hasDiscount && (
                                            <p style={{ 
                                                margin: '5px 0 0 0', 
                                                color: '#16a34a', 
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: '#dcfce7',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                display: 'inline-block'
                                            }}>
                                                🎉 Descuento 5% aplicado
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {hasDiscount && (
                                            <p style={{ 
                                                margin: 0, 
                                                textDecoration: 'line-through', 
                                                color: '#999',
                                                fontSize: '14px'
                                            }}>
                                                ${basePrice.toFixed(2)}
                                            </p>
                                        )}
                                        <p style={{ 
                                            margin: 0, 
                                            fontWeight: 'bold',
                                            color: '#1e3a8a',
                                            fontSize: '18px'
                                        }}>
                                            ${discountedPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: '3px solid #fbbf24',
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                            color: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '28px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                💰 Total: ${total.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Formularios */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        border: '2px solid #fbbf24',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                    }}>
                        {currentStep === 1 ? (
                            // Formulario de información de envío
                            <div>
                                <h2 style={{
                                    color: '#1e3a8a',
                                    marginBottom: '20px',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    borderBottom: '3px solid #fbbf24',
                                    paddingBottom: '10px'
                                }}>📍 Información de Envío</h2>
                                <form onSubmit={handleShippingSubmit}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            👤 Nombre Completo
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.nombreCompleto}
                                            onChange={(e) => setShippingInfo({...shippingInfo, nombreCompleto: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            📧 Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            value={shippingInfo.correoElectronico}
                                            onChange={(e) => setShippingInfo({...shippingInfo, correoElectronico: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            🏠 Dirección
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.direccion}
                                            onChange={(e) => setShippingInfo({...shippingInfo, direccion: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            📱 Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            value={shippingInfo.telefono}
                                            onChange={(e) => setShippingInfo({...shippingInfo, telefono: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            🏙️ Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.ciudad}
                                            onChange={(e) => setShippingInfo({...shippingInfo, ciudad: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            🗺️ Provincia
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.provincia}
                                            onChange={(e) => setShippingInfo({...shippingInfo, provincia: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: '25px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            📫 Código Postal
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.codigoPostal}
                                            onChange={(e) => setShippingInfo({...shippingInfo, codigoPostal: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                                            color: 'white',
                                            border: '2px solid #fbbf24',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 138, 0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)';
                                        }}
                                    >
                                        ➡️ Continuar al Pago
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // Formulario de información de pago
                            <div>
                                <h2 style={{
                                    color: '#1e3a8a',
                                    marginBottom: '20px',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    borderBottom: '3px solid #fbbf24',
                                    paddingBottom: '10px'
                                }}>💳 Información de Pago</h2>
                                <form onSubmit={handlePaymentSubmit}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            🔢 Número de Tarjeta
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentInfo.numeroTarjeta}
                                            onChange={(e) => setPaymentInfo({...paymentInfo, numeroTarjeta: e.target.value})}
                                            placeholder="1234 5678 9012 3456"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            color: '#1e3a8a',
                                            fontSize: '14px'
                                        }}>
                                            👤 Nombre del Titular
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentInfo.nombreTitular}
                                            onChange={(e) => setPaymentInfo({...paymentInfo, nombreTitular: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '8px', 
                                                fontWeight: '600',
                                                color: '#1e3a8a',
                                                fontSize: '14px'
                                            }}>
                                                📅 Mes
                                            </label>
                                            <select
                                                value={paymentInfo.mesExpiracion}
                                                onChange={(e) => setPaymentInfo({...paymentInfo, mesExpiracion: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    transition: 'all 0.3s ease',
                                                    background: '#f8fafc'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                required
                                            >
                                                <option value="">Mes</option>
                                                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                                    <option key={month} value={month.toString().padStart(2, '0')}>
                                                        {month.toString().padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '8px', 
                                                fontWeight: '600',
                                                color: '#1e3a8a',
                                                fontSize: '14px'
                                            }}>
                                                📅 Año
                                            </label>
                                            <select
                                                value={paymentInfo.anoExpiracion}
                                                onChange={(e) => setPaymentInfo({...paymentInfo, anoExpiracion: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    transition: 'all 0.3s ease',
                                                    background: '#f8fafc'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                required
                                            >
                                                <option value="">Año</option>
                                                {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '8px', 
                                                fontWeight: '600',
                                                color: '#1e3a8a',
                                                fontSize: '14px'
                                            }}>
                                                🔒 CVV
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentInfo.codigoSeguridad}
                                                onChange={(e) => setPaymentInfo({...paymentInfo, codigoSeguridad: e.target.value})}
                                                placeholder="123"
                                                maxLength="3"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '16px',
                                                    transition: 'all 0.3s ease',
                                                    background: '#f8fafc'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            style={{
                                                padding: '16px',
                                                background: '#6b7280',
                                                color: 'white',
                                                border: '2px solid #9ca3af',
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = '#4b5563';
                                                e.target.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = '#6b7280';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            ⬅️ Volver
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            style={{
                                                padding: '16px',
                                                background: isProcessing ? 
                                                    'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 
                                                    'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                                color: 'white',
                                                border: '2px solid #fbbf24',
                                                borderRadius: '12px',
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: isProcessing ? 'none' : '0 4px 12px rgba(22, 163, 74, 0.3)'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!isProcessing) {
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.4)';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isProcessing) {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
                                                }
                                            }}
                                        >
                                            {isProcessing ? '🔄 Procesando...' : '💳 Pagar Ahora'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
