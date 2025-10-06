"use client";
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';
import StripeCardForm from '../../components/StripeCardForm';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [windowWidth, setWindowWidth] = useState(1024);
    const [paymentMessage] = useState(''); // Removed unused setter

    // Estados para información de envío
    const [currentStep, setCurrentStep] = useState(1); // 1: Shipping Info, 2: Payment
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        mainStreet: '',
        secondaryStreet: '',
        city: '',
        province: '',
        country: '',
        postalCode: ''
    });
    const [shippingErrors, setShippingErrors] = useState({});

    useEffect(() => {
        // If there are no items in the cart, redirect
        if (cartItems.length === 0 && !orderComplete) {
            router.push('/cart');
        }
    }, [cartItems, router, orderComplete]);

    // Handle window resize safely
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Set initial width
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    // Function to generate order number
    const generateOrderNumber = () => {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `LS-${timestamp.slice(-6)}-${random}`;
    };

    // Validar información de envío
    const validateShippingInfo = () => {
        const errors = {};
        
        if (!shippingInfo.fullName.trim()) {
            errors.fullName = 'El nombre completo es requerido';
        }
        
        if (!shippingInfo.email.trim()) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
            errors.email = 'El correo electrónico no es válido';
        }

        if (!shippingInfo.phone.trim()) {
            errors.phone = 'El teléfono es requerido';
        } else if (!/^\d{10,15}$/.test(shippingInfo.phone.replace(/[\s-()]/g, ''))) {
            errors.phone = 'El teléfono debe tener entre 10 y 15 dígitos';
        }
        
        if (!shippingInfo.mainStreet.trim()) {
            errors.mainStreet = 'La calle principal es requerida';
        }
        
        if (!shippingInfo.city.trim()) {
            errors.city = 'La ciudad es requerida';
        }
        
        if (!shippingInfo.province.trim()) {
            errors.province = 'La provincia es requerida';
        }
        
        if (!shippingInfo.country.trim()) {
            errors.country = 'El país es requerido';
        }
        
        if (!shippingInfo.postalCode.trim()) {
            errors.postalCode = 'El código postal es requerido';
        }
        
        setShippingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Manejar cambios en los campos de envío
    const handleShippingChange = (field, value) => {
        setShippingInfo(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (shippingErrors[field]) {
            setShippingErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Continuar al paso de pago
    const proceedToPayment = () => {
        if (validateShippingInfo()) {
            setCurrentStep(2);
        }
    };

    // Enviar información de la orden a la dueña (simulado)
    const sendOrderToOwner = async (orderData) => {
        // Aquí podrías implementar el envío real de email o webhook
        console.log('Enviando información de la orden a la dueña:', orderData);
        
        // Simulación de envío exitoso
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    };

    // Handle successful payment
    const handlePaymentSuccess = async (paymentData) => {
        const orderNum = generateOrderNumber();
        
        // Preparar datos completos de la orden
        const completeOrderData = {
            orderNumber: orderNum,
            shippingInfo,
            cartItems,
            total: getCartTotal(),
            paymentInfo: paymentData,
            timestamp: new Date().toISOString()
        };
        
        // Enviar información a la dueña
        try {
            await sendOrderToOwner(completeOrderData);
            setOrderNumber(orderNum);
            setOrderComplete(true);
            clearCart();
            console.log('Orden completada exitosamente:', completeOrderData);
        } catch (error) {
            console.error('Error enviando orden:', error);
            handlePaymentError('Error procesando la orden. Por favor contacte soporte.');
        }
    };

    // Handle payment errors
    const handlePaymentError = (errorMessage) => {
        alert(errorMessage);
        setPaymentProcessing(false);
    };

    // Order complete screen
    if (orderComplete) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'var(--pure-white)',
                    padding: '60px 40px',
                    borderRadius: '24px',
                    border: '4px solid var(--accent-yellow)',
                    boxShadow: '0 25px 50px rgba(34, 197, 94, 0.3)',
                    textAlign: 'center',
                    maxWidth: '600px'
                }}>
                    <div style={{
                        fontSize: '80px',
                        marginBottom: '24px'
                    }}>🎉</div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>Successful Order!</h1>
                    <p style={{
                        fontSize: '20px',
                        margin: '0 0 24px 0',
                        fontWeight: '600'
                    }}>
                        Order #{orderNumber}
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: 'var(--accent-yellow)',
                            color: 'var(--dark-black)',
                            border: '3px solid var(--bright-yellow)',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 20px rgba(251, 191, 36, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        🏠 Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const total = getCartTotal();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
            padding: 'clamp(12px, 3vw, 20px)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 clamp(12px, 2vw, 20px)'
            }}>
                {/* Header - Responsive */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: 'clamp(24px, 5vw, 40px)',
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    padding: 'clamp(20px, 5vw, 40px)',
                    borderRadius: 'clamp(12px, 2vw, 20px)',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(20px, 5vw, 36px)',
                        fontWeight: '800',
                        color: 'var(--pure-white)',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        lineHeight: 1.2
                    }}>
                        🛒 Secure Payment
                    </h1>
                    <p style={{
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        color: 'var(--accent-yellow)',
                        margin: 0,
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}>
                        💰 Total: ${total.toFixed(2)}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: windowWidth < 1024 ? '1fr' : '1fr 1fr',
                    gap: 'clamp(20px, 4vw, 30px)'
                }}>
                    {/* Order Summary - Responsive */}
                    <div style={{
                        background: 'var(--pure-white)',
                        borderRadius: 'clamp(12px, 2vw, 16px)',
                        padding: 'clamp(20px, 4vw, 30px)',
                        border: '2px solid var(--border-gray)',
                        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.1)',
                        order: windowWidth < 1024 ? 2 : 1
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(18px, 4vw, 24px)',
                            fontWeight: '700',
                            color: 'var(--dark-black)',
                            margin: '0 0 20px 0',
                            textTransform: 'uppercase',
                            borderBottom: '3px solid var(--accent-yellow)',
                            paddingBottom: '12px'
                        }}>
                            📋 Order Summary
                        </h2>

                        {cartItems.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: windowWidth < 768 ? 'flex-start' : 'center',
                                padding: 'clamp(12px, 3vw, 16px)',
                                background: 'var(--off-white)',
                                borderRadius: 'clamp(8px, 1.5vw, 12px)',
                                marginBottom: 'clamp(8px, 2vw, 12px)',
                                border: '2px solid var(--border-gray)',
                                flexDirection: windowWidth < 768 ? 'column' : 'row',
                                gap: windowWidth < 768 ? '8px' : '16px'
                            }}>
                                <div style={{
                                    textAlign: windowWidth < 768 ? 'center' : 'left'
                                }}>
                                    <h4 style={{
                                        margin: '0 0 4px 0',
                                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                                        fontWeight: '600',
                                        color: 'var(--dark-black)'
                                    }}>
                                        {item.nombre}
                                    </h4>
                                    <p style={{
                                        margin: 0,
                                        fontSize: 'clamp(12px, 3vw, 14px)',
                                        color: 'var(--primary-blue)',
                                        fontWeight: '600'
                                    }}>
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                                <span style={{
                                    fontSize: 'clamp(16px, 4vw, 18px)',
                                    fontWeight: '700',
                                    color: 'var(--primary-dark-blue)',
                                    background: 'var(--accent-yellow)',
                                    padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                                    borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                    border: '2px solid var(--bright-yellow)',
                                    textAlign: 'center'
                                }}>
                                    ${(item.precio * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}

                        <div style={{
                            borderTop: '3px solid var(--accent-yellow)',
                            paddingTop: 'clamp(16px, 4vw, 20px)',
                            marginTop: 'clamp(16px, 4vw, 20px)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{
                                fontSize: 'clamp(20px, 5vw, 24px)',
                                fontWeight: '800',
                                color: 'var(--dark-black)',
                                margin: 0,
                                textTransform: 'uppercase'
                            }}>
                                Total: ${total.toFixed(2)}
                            </h3>
                        </div>
                    </div>

                    {/* Formulario de Información de Envío o Pago */}
                    <div style={{
                        background: 'var(--pure-white)',
                        borderRadius: 'clamp(12px, 2vw, 16px)',
                        padding: 'clamp(20px, 4vw, 30px)',
                        border: '2px solid var(--border-gray)',
                        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.1)',
                        order: windowWidth < 1024 ? 1 : 2
                    }}>
                        {/* Indicador de pasos */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: 'clamp(20px, 4vw, 30px)',
                            gap: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                fontWeight: '600',
                                color: currentStep === 1 ? 'var(--primary-blue)' : 'var(--border-gray)'
                            }}>
                                <span style={{
                                    background: currentStep === 1 ? 'var(--primary-blue)' : 'var(--border-gray)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '8px',
                                    fontSize: '14px'
                                }}>
                                    1
                                </span>
                                📍 Información de Envío
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                fontWeight: '600',
                                color: currentStep === 2 ? 'var(--primary-blue)' : 'var(--border-gray)'
                            }}>
                                <span style={{
                                    background: currentStep === 2 ? 'var(--primary-blue)' : 'var(--border-gray)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '8px',
                                    fontSize: '14px'
                                }}>
                                    2
                                </span>
                                💳 Pago
                            </div>
                        </div>

                        {/* Paso 1: Información de Envío */}
                        {currentStep === 1 && (
                            <>
                                <h2 style={{
                                    fontSize: 'clamp(18px, 4vw, 24px)',
                                    fontWeight: '700',
                                    color: 'var(--dark-black)',
                                    margin: '0 0 clamp(20px, 4vw, 30px) 0',
                                    textTransform: 'uppercase',
                                    borderBottom: '3px solid var(--accent-yellow)',
                                    paddingBottom: '12px'
                                }}>
                                    📍 Información de Envío
                                </h2>

                                <div style={{
                                    display: 'grid',
                                    gap: 'clamp(16px, 3vw, 20px)'
                                }}>
                                    {/* Nombre Completo */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(14px, 3vw, 16px)',
                                            fontWeight: '600',
                                            color: 'var(--dark-black)',
                                            marginBottom: '8px'
                                        }}>
                                            👤 Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.fullName}
                                            onChange={(e) => handleShippingChange('fullName', e.target.value)}
                                            placeholder="Ingrese su nombre completo"
                                            style={{
                                                width: '100%',
                                                padding: 'clamp(12px, 3vw, 16px)',
                                                border: `2px solid ${shippingErrors.fullName ? '#dc2626' : 'var(--border-gray)'}`,
                                                borderRadius: 'clamp(8px, 2vw, 12px)',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {shippingErrors.fullName && (
                                            <span style={{
                                                color: '#dc2626',
                                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                marginTop: '4px',
                                                display: 'block'
                                            }}>
                                                {shippingErrors.fullName}
                                            </span>
                                        )}
                                    </div>

                                    {/* Correo Electrónico */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(14px, 3vw, 16px)',
                                            fontWeight: '600',
                                            color: 'var(--dark-black)',
                                            marginBottom: '8px'
                                        }}>
                                            📧 Correo Electrónico *
                                        </label>
                                        <input
                                            type="email"
                                            value={shippingInfo.email}
                                            onChange={(e) => handleShippingChange('email', e.target.value)}
                                            placeholder="Ingrese su correo electrónico"
                                            style={{
                                                width: '100%',
                                                padding: 'clamp(12px, 3vw, 16px)',
                                                border: `2px solid ${shippingErrors.email ? '#dc2626' : 'var(--border-gray)'}`,
                                                borderRadius: 'clamp(8px, 2vw, 12px)',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {shippingErrors.email && (
                                            <span style={{
                                                color: '#dc2626',
                                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                marginTop: '4px',
                                                display: 'block'
                                            }}>
                                                {shippingErrors.email}
                                            </span>
                                        )}
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(14px, 3vw, 16px)',
                                            fontWeight: '600',
                                            color: 'var(--dark-black)',
                                            marginBottom: '8px'
                                        }}>
                                            📱 Teléfono Celular *
                                        </label>
                                        <input
                                            type="tel"
                                            value={shippingInfo.phone}
                                            onChange={(e) => handleShippingChange('phone', e.target.value)}
                                            placeholder="Ej: +1234567890"
                                            style={{
                                                width: '100%',
                                                padding: 'clamp(12px, 3vw, 16px)',
                                                border: `2px solid ${shippingErrors.phone ? '#dc2626' : 'var(--border-gray)'}`,
                                                borderRadius: 'clamp(8px, 2vw, 12px)',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {shippingErrors.phone && (
                                            <span style={{
                                                color: '#dc2626',
                                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                marginTop: '4px',
                                                display: 'block'
                                            }}>
                                                {shippingErrors.phone}
                                            </span>
                                        )}
                                    </div>

                                    {/* Calle Principal */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(14px, 3vw, 16px)',
                                            fontWeight: '600',
                                            color: 'var(--dark-black)',
                                            marginBottom: '8px'
                                        }}>
                                            🏠 Calle Principal *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.mainStreet}
                                            onChange={(e) => handleShippingChange('mainStreet', e.target.value)}
                                            placeholder="Ej: Calle 123 #45-67"
                                            style={{
                                                width: '100%',
                                                padding: 'clamp(12px, 3vw, 16px)',
                                                border: `2px solid ${shippingErrors.mainStreet ? '#dc2626' : 'var(--border-gray)'}`,
                                                borderRadius: 'clamp(8px, 2vw, 12px)',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {shippingErrors.mainStreet && (
                                            <span style={{
                                                color: '#dc2626',
                                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                marginTop: '4px',
                                                display: 'block'
                                            }}>
                                                {shippingErrors.mainStreet}
                                            </span>
                                        )}
                                    </div>

                                    {/* Calle Secundaria */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'clamp(14px, 3vw, 16px)',
                                            fontWeight: '600',
                                            color: 'var(--dark-black)',
                                            marginBottom: '8px'
                                        }}>
                                            🏢 Calle Secundaria / Apartamento (Opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.secondaryStreet}
                                            onChange={(e) => handleShippingChange('secondaryStreet', e.target.value)}
                                            placeholder="Ej: Apt 101, Piso 2"
                                            style={{
                                                width: '100%',
                                                padding: 'clamp(12px, 3vw, 16px)',
                                                border: '2px solid var(--border-gray)',
                                                borderRadius: 'clamp(8px, 2vw, 12px)',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    {/* Grid para Ciudad y Provincia */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: windowWidth < 768 ? '1fr' : '1fr 1fr',
                                        gap: 'clamp(12px, 3vw, 16px)'
                                    }}>
                                        {/* Ciudad */}
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                fontWeight: '600',
                                                color: 'var(--dark-black)',
                                                marginBottom: '8px'
                                            }}>
                                                🏙️ Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingInfo.city}
                                                onChange={(e) => handleShippingChange('city', e.target.value)}
                                                placeholder="Ej: Bogotá"
                                                style={{
                                                    width: '100%',
                                                    padding: 'clamp(12px, 3vw, 16px)',
                                                    border: `2px solid ${shippingErrors.city ? '#dc2626' : 'var(--border-gray)'}`,
                                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                                    fontSize: 'clamp(14px, 3vw, 16px)',
                                                    outline: 'none',
                                                    transition: 'border-color 0.3s ease',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {shippingErrors.city && (
                                                <span style={{
                                                    color: '#dc2626',
                                                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                    marginTop: '4px',
                                                    display: 'block'
                                                }}>
                                                    {shippingErrors.city}
                                                </span>
                                            )}
                                        </div>

                                        {/* Provincia */}
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                fontWeight: '600',
                                                color: 'var(--dark-black)',
                                                marginBottom: '8px'
                                            }}>
                                                🗺️ Provincia/Estado *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingInfo.province}
                                                onChange={(e) => handleShippingChange('province', e.target.value)}
                                                placeholder="Ej: Cundinamarca"
                                                style={{
                                                    width: '100%',
                                                    padding: 'clamp(12px, 3vw, 16px)',
                                                    border: `2px solid ${shippingErrors.province ? '#dc2626' : 'var(--border-gray)'}`,
                                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                                    fontSize: 'clamp(14px, 3vw, 16px)',
                                                    outline: 'none',
                                                    transition: 'border-color 0.3s ease',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {shippingErrors.province && (
                                                <span style={{
                                                    color: '#dc2626',
                                                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                    marginTop: '4px',
                                                    display: 'block'
                                                }}>
                                                    {shippingErrors.province}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Grid para País y Código Postal */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: windowWidth < 768 ? '1fr' : '1fr 1fr',
                                        gap: 'clamp(12px, 3vw, 16px)'
                                    }}>
                                        {/* País */}
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                fontWeight: '600',
                                                color: 'var(--dark-black)',
                                                marginBottom: '8px'
                                            }}>
                                                🌎 País *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingInfo.country}
                                                onChange={(e) => handleShippingChange('country', e.target.value)}
                                                placeholder="Ej: Colombia"
                                                style={{
                                                    width: '100%',
                                                    padding: 'clamp(12px, 3vw, 16px)',
                                                    border: `2px solid ${shippingErrors.country ? '#dc2626' : 'var(--border-gray)'}`,
                                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                                    fontSize: 'clamp(14px, 3vw, 16px)',
                                                    outline: 'none',
                                                    transition: 'border-color 0.3s ease',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {shippingErrors.country && (
                                                <span style={{
                                                    color: '#dc2626',
                                                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                    marginTop: '4px',
                                                    display: 'block'
                                                }}>
                                                    {shippingErrors.country}
                                                </span>
                                            )}
                                        </div>

                                        {/* Código Postal */}
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: 'clamp(14px, 3vw, 16px)',
                                                fontWeight: '600',
                                                color: 'var(--dark-black)',
                                                marginBottom: '8px'
                                            }}>
                                                📫 Código Postal *
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingInfo.postalCode}
                                                onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                                                placeholder="Ej: 110111"
                                                style={{
                                                    width: '100%',
                                                    padding: 'clamp(12px, 3vw, 16px)',
                                                    border: `2px solid ${shippingErrors.postalCode ? '#dc2626' : 'var(--border-gray)'}`,
                                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                                    fontSize: 'clamp(14px, 3vw, 16px)',
                                                    outline: 'none',
                                                    transition: 'border-color 0.3s ease',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            {shippingErrors.postalCode && (
                                                <span style={{
                                                    color: '#dc2626',
                                                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                    marginTop: '4px',
                                                    display: 'block'
                                                }}>
                                                    {shippingErrors.postalCode}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón Continuar */}
                                    <button
                                        onClick={proceedToPayment}
                                        style={{
                                            background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark-blue) 100%)',
                                            color: 'white',
                                            border: '3px solid var(--accent-yellow)',
                                            padding: 'clamp(16px, 4vw, 20px)',
                                            borderRadius: 'clamp(8px, 2vw, 12px)',
                                            fontSize: 'clamp(16px, 4vw, 18px)',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginTop: 'clamp(16px, 4vw, 20px)',
                                            width: '100%'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        ➡️ Continuar al Pago
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Paso 2: Pago */}
                        {currentStep === 2 && (
                            <>
                                {/* Botón Volver */}
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--primary-blue)',
                                        border: '2px solid var(--primary-blue)',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    ⬅️ Volver a Información de Envío
                                </button>

                                <h2 style={{
                                    fontSize: 'clamp(18px, 4vw, 24px)',
                                    fontWeight: '700',
                                    color: 'var(--dark-black)',
                                    margin: '0 0 clamp(20px, 4vw, 30px) 0',
                                    textTransform: 'uppercase',
                                    borderBottom: '3px solid var(--accent-yellow)',
                                    paddingBottom: '12px'
                                }}>
                                    💳 Pago Seguro con Tarjeta
                                </h2>

                                {/* Resumen de información de envío */}
                                <div style={{
                                    background: 'var(--off-white)',
                                    padding: 'clamp(16px, 4vw, 20px)',
                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                    marginBottom: 'clamp(20px, 4vw, 24px)',
                                    border: '2px solid var(--border-gray)'
                                }}>
                                    <h3 style={{
                                        fontSize: 'clamp(16px, 3.5vw, 18px)',
                                        fontWeight: '700',
                                        color: 'var(--dark-black)',
                                        margin: '0 0 12px 0'
                                    }}>
                                        📍 Enviar a:
                                    </h3>
                                    <p style={{
                                        margin: '0',
                                        fontSize: 'clamp(14px, 3vw, 16px)',
                                        color: 'var(--primary-dark-blue)',
                                        lineHeight: 1.5
                                    }}>
                                        <strong>{shippingInfo.fullName}</strong><br/>
                                        📧 {shippingInfo.email}<br/>
                                        📱 {shippingInfo.phone}<br/>
                                        🏠 {shippingInfo.mainStreet}
                                        {shippingInfo.secondaryStreet && <><br/>🏢 {shippingInfo.secondaryStreet}</>}<br/>
                                        🏙️ {shippingInfo.city}, {shippingInfo.province}<br/>
                                        🌎 {shippingInfo.country} - 📫 {shippingInfo.postalCode}
                                    </p>
                                </div>

                                {/* Payment Processing Messages */}
                                {paymentMessage && (
                                    <div style={{
                                        background: paymentMessage.includes('✅')
                                            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                                            : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                        color: 'white',
                                        padding: 'clamp(16px, 4vw, 20px)',
                                        borderRadius: 'clamp(8px, 2vw, 12px)',
                                        marginBottom: 'clamp(16px, 4vw, 20px)',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        border: '3px solid var(--accent-yellow)',
                                        fontSize: 'clamp(14px, 3.5vw, 16px)'
                                    }}>
                                        {paymentMessage}
                                    </div>
                                )}

                                {/* Processing Indicator */}
                                {paymentProcessing && (
                                    <div style={{
                                        background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                                        color: 'white',
                                        padding: 'clamp(20px, 4vw, 24px)',
                                        borderRadius: 'clamp(8px, 2vw, 12px)',
                                        textAlign: 'center',
                                        marginBottom: 'clamp(20px, 4vw, 24px)',
                                        border: '3px solid var(--accent-yellow)',
                                        fontSize: 'clamp(16px, 4vw, 18px)',
                                        fontWeight: '700'
                                    }}>
                                        <div style={{
                                            fontSize: 'clamp(24px, 6vw, 32px)',
                                            marginBottom: '12px'
                                        }}>⏳</div>
                                        Procesando tu pago...
                                    </div>
                                )}

                                {/* Credit Card Form */}
                                {!paymentProcessing && (
                                    <StripeCardForm
                                        amount={total}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        onLoading={setPaymentProcessing}
                                        shippingInfo={shippingInfo}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
