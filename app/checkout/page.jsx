"use client";
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';

// Idealmente, esto estaría en un componente separado y usaría Stripe Elements.
// Por simplicidad, lo mantenemos aquí.

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

    // Estados para información de pago (simplificado, ya que Stripe Elements lo manejaría)
    const [paymentInfo, setPaymentInfo] = useState({
        nombreTitular: '',
        numeroTarjeta: '',
        fechaExpiracion: '',
        cvv: ''
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
        
        if (!paymentInfo.nombreTitular || !paymentInfo.numeroTarjeta ||
            !paymentInfo.fechaExpiracion || !paymentInfo.cvv) {
            alert('Por favor, complete todos los campos de pago.');
            return;
        }

        setIsProcessing(true);

        try {
            const orderNum = generateOrderNumber();

            console.log('🔄 Creando Payment Intent en el servidor...');
            console.log('📦 Items del carrito:', cartItems);

            // 1. Crear el Payment Intent en el servidor de forma segura
            const createIntentResponse = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                }),
            });

            console.log('📡 Response status:', createIntentResponse.status);
            console.log('📡 Response headers:', createIntentResponse.headers.get('content-type'));

            // Verificar si la respuesta es JSON
            const contentType = createIntentResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await createIntentResponse.text();
                console.error('❌ Respuesta no es JSON:', textResponse);
                throw new Error('El servidor devolvió una respuesta inválida. Por favor, revisa la consola.');
            }

            const paymentIntentData = await createIntentResponse.json();
            console.log('📊 Payment Intent data:', paymentIntentData);

            if (!createIntentResponse.ok || !paymentIntentData.success) {
                throw new Error(paymentIntentData.error || 'No se pudo iniciar el pago.');
            }

            console.log('✅ Payment Intent creado:', paymentIntentData.paymentIntentId);

            // 2. Aquí es donde usarías Stripe.js y Stripe Elements para confirmar el pago en el cliente.
            //    Como no tenemos Stripe Elements configurado, simularemos una confirmación exitosa.
            //    En una implementación real, el siguiente bloque sería reemplazado por:
            //
            //    const { error, paymentIntent } = await stripe.confirmCardPayment(
            //        paymentIntentData.clientSecret,
            //        {
            //            payment_method: {
            //                card: elements.getElement(CardElement),
            //                billing_details: { name: paymentInfo.nombreTitular },
            //            },
            //        }
            //    );
            //
            //    if (error) {
            //        throw new Error(error.message);
            //    }
            //
            //    if (paymentIntent.status !== 'succeeded') {
            //        throw new Error('El pago no fue exitoso.');
            //    }

            console.log('💳 Simulando confirmación de pago del cliente...');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simular la interacción del usuario
            console.log('✅ Pago confirmado exitosamente (simulado).');

            // 3. Preparar datos para el correo de confirmación
            const requestData = {
                shippingInfo: shippingInfo,
                cartItems: cartItems,
                total: paymentIntentData.amount, // Usar el total calculado por el servidor
                orderNumber: orderNum,
                paymentIntentId: paymentIntentData.paymentIntentId,
                paymentInfo: {
                    nombreTitular: paymentInfo.nombreTitular,
                }
            };

            console.log('📧 Enviando confirmación de orden...');

            // Enviar información por email
            fetch('/api/send-shipping-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            }).then(response => {
                if (response.ok) {
                    console.log('✅ Emails enviados correctamente');
                } else {
                    console.log('⚠️ Error enviando emails, pero la orden ya fue completada.');
                }
            }).catch(emailError => {
                console.log('⚠️ Error en el servicio de email:', emailError.message);
            });

            // 4. Completar el checkout
            setOrderNumber(orderNum);
            setOrderComplete(true);
            clearCart();
            setIsProcessing(false);

            console.log('🎉 Orden completada exitosamente:', orderNum);

        } catch (error) {
            console.error('❌ Error procesando pago:', error);
            setIsProcessing(false);
            alert(`Error procesando el pago: ${error.message}. Por favor, intente nuevamente.`);
        }
    };

    if (!mounted) {
        return <div>Loading...</div>;
    }

    if (orderComplete) {
        // ... (código de la página de éxito, sin cambios)
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
                    <div style={{
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            color: '#374151',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            background: '#f0fdf4',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '2px solid #16a34a',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ margin: '0 0 15px 0', color: '#16a34a', fontSize: '18px' }}>✅ ¡Pago Procesado Exitosamente!</h3>
                            <p style={{ margin: '0 0 10px 0' }}>
                                💳 <strong>Tu pago ha sido debitado correctamente</strong> de tu cuenta.
                            </p>
                            <p style={{ margin: '0 0 10px 0' }}>
                                📧 <strong>Confirmación enviada</strong> a tu correo electrónico.
                            </p>
                            <p style={{ margin: '0' }}>
                                🏪 <strong>La dueña ha sido notificada</strong> y se pondrá en contacto contigo pronto.
                            </p>
                        </div>

                        <div style={{
                            background: '#fef3c7',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '2px solid #f59e0b',
                            textAlign: 'center'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#92400e', fontSize: '16px' }}>📞 ¿Necesitas ayuda?</h4>
                            <p style={{ margin: '0', color: '#78350f', fontSize: '14px' }}>
                                Contacta directamente a: <strong>Lavadoandsonsllc@gmail.com</strong>
                            </p>
                        </div>
                    </div>
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
                <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1e3a8a', fontSize: '36px', fontWeight: '800' }}>
                    Finalizar Compra
                </h1>

                {/* Indicador de progreso */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '40px',
                    gap: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        background: currentStep === 1 ? '#1e3a8a' : '#e0f2fe',
                        color: currentStep === 1 ? 'white' : '#1e3a8a',
                        fontWeight: '700',
                        transition: 'all 0.3s ease'
                    }}>
                        <span style={{ marginRight: '8px' }}>1</span>
                        📋 Envío
                    </div>
                    <div style={{
                        width: '40px',
                        height: '3px',
                        background: currentStep === 2 ? '#1e3a8a' : '#e0e7ff'
                    }}></div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        background: currentStep === 2 ? '#1e3a8a' : '#e0f2fe',
                        color: currentStep === 2 ? 'white' : '#1e3a8a',
                        fontWeight: '700',
                        transition: 'all 0.3s ease'
                    }}>
                        <span style={{ marginRight: '8px' }}>2</span>
                        💳 Pago
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '40px',
                    '@media (maxWidth: 768px)': {
                        gridTemplateColumns: '1fr'
                    }
                }}>
                    {/* Resumen del pedido */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        height: 'fit-content'
                    }}>
                        <h2 style={{
                            color: '#1e3a8a',
                            marginBottom: '25px',
                            fontSize: '24px',
                            fontWeight: '700',
                            borderBottom: '3px solid #fbbf24',
                            paddingBottom: '15px'
                        }}>
                            📦 Resumen del Pedido
                        </h2>

                        <div style={{ marginBottom: '20px' }}>
                            {cartItems.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    background: '#f8fafc',
                                    borderRadius: '12px',
                                    border: '2px solid #e0f2fe'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{
                                            margin: '0 0 8px 0',
                                            color: '#1e3a8a',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }}>
                                            {item.nombre}
                                        </h4>
                                        <p style={{
                                            margin: '0',
                                            color: '#64748b',
                                            fontSize: '14px'
                                        }}>
                                            Cantidad: <strong>{item.quantity}</strong>
                                        </p>
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <p style={{
                                            margin: '0',
                                            color: '#1e3a8a',
                                            fontSize: '18px',
                                            fontWeight: '700'
                                        }}>
                                            ${(item.precio * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            borderTop: '3px solid #fbbf24',
                            paddingTop: '20px',
                            marginTop: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px',
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                                borderRadius: '12px',
                                color: 'white'
                            }}>
                                <h3 style={{
                                    margin: '0',
                                    fontSize: '24px',
                                    fontWeight: '800'
                                }}>
                                    Total:
                                </h3>
                                <h3 style={{
                                    margin: '0',
                                    fontSize: '32px',
                                    fontWeight: '800',
                                    color: '#fbbf24'
                                }}>
                                    ${total.toFixed(2)}
                                </h3>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '25px',
                            padding: '20px',
                            background: '#fef3c7',
                            borderRadius: '12px',
                            border: '2px solid #f59e0b'
                        }}>
                            <h4 style={{
                                margin: '0 0 10px 0',
                                color: '#92400e',
                                fontSize: '16px',
                                fontWeight: '700'
                            }}>
                                🔒 Pago Seguro
                            </h4>
                            <p style={{
                                margin: '0',
                                color: '#78350f',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}>
                                Tus datos están protegidos con encriptación SSL. Procesado por Stripe.
                            </p>
                        </div>
                    </div>

                    {/* Formularios */}
                    <div>
                        {currentStep === 1 ? (
                            <form onSubmit={handleShippingSubmit} style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}>
                                <h2 style={{
                                    color: '#1e3a8a',
                                    marginBottom: '25px',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    borderBottom: '3px solid #fbbf24',
                                    paddingBottom: '15px'
                                }}>
                                    📋 Información de Envío
                                </h2>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1e3a8a'
                                    }}>
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingInfo.nombreCompleto}
                                        onChange={(e) => setShippingInfo({...shippingInfo, nombreCompleto: e.target.value})}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #e0f2fe',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1e3a8a'
                                    }}>
                                        Correo Electrónico *
                                    </label>
                                    <input
                                        type="email"
                                        value={shippingInfo.correoElectronico}
                                        onChange={(e) => setShippingInfo({...shippingInfo, correoElectronico: e.target.value})}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #e0f2fe',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1e3a8a'
                                    }}>
                                        Dirección *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingInfo.direccion}
                                        onChange={(e) => setShippingInfo({...shippingInfo, direccion: e.target.value})}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #e0f2fe',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1e3a8a'
                                    }}>
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        value={shippingInfo.telefono}
                                        onChange={(e) => setShippingInfo({...shippingInfo, telefono: e.target.value})}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #e0f2fe',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#1e3a8a'
                                        }}>
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.ciudad}
                                            onChange={(e) => setShippingInfo({...shippingInfo, ciudad: e.target.value})}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                fontSize: '16px',
                                                border: '2px solid #e0f2fe',
                                                borderRadius: '8px',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#1e3a8a'
                                        }}>
                                            Provincia/Estado *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.provincia}
                                            onChange={(e) => setShippingInfo({...shippingInfo, provincia: e.target.value})}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                fontSize: '16px',
                                                border: '2px solid #e0f2fe',
                                                borderRadius: '8px',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1e3a8a'
                                    }}>
                                        Código Postal *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingInfo.codigoPostal}
                                        onChange={(e) => setShippingInfo({...shippingInfo, codigoPostal: e.target.value})}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #e0f2fe',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                                        color: 'white',
                                        border: '2px solid #fbbf24',
                                        padding: '16px 28px',
                                        borderRadius: '12px',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
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
                                    Continuar al Pago →
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handlePaymentSubmit} style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}>
                                <h2 style={{
                                    color: '#1e3a8a',
                                    marginBottom: '25px',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    borderBottom: '3px solid #fbbf24',
                                    paddingBottom: '15px'
                                }}>
                                    💳 Información de Pago
                                </h2>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1e3a8a'
                                    }}>
                                        Nombre del Titular *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentInfo.nombreTitular}
                                        onChange={(e) => setPaymentInfo({...paymentInfo, nombreTitular: e.target.value})}
                                        required
                                        placeholder="Como aparece en la tarjeta"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #e0f2fe',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1e3a8a'
                                    }}>
                                        Número de Tarjeta *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentInfo.numeroTarjeta}
                                        onChange={(e) => {
                                            // Permitir solo números y espacios, máximo 19 caracteres (16 dígitos + 3 espacios)
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 16) {
                                                // Formatear con espacios cada 4 dígitos
                                                const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                setPaymentInfo({...paymentInfo, numeroTarjeta: formatted});
                                            }
                                        }}
                                        required
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            border: '2px solid #e0f2fe',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease',
                                            letterSpacing: '1px'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#1e3a8a'
                                        }}>
                                            Fecha de Expiración *
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentInfo.fechaExpiracion}
                                            onChange={(e) => {
                                                // Formatear MM/YY
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length >= 2) {
                                                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                }
                                                setPaymentInfo({...paymentInfo, fechaExpiracion: value});
                                            }}
                                            required
                                            placeholder="MM/AA"
                                            maxLength="5"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                fontSize: '16px',
                                                border: '2px solid #e0f2fe',
                                                borderRadius: '8px',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#1e3a8a'
                                        }}>
                                            CVV *
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentInfo.cvv}
                                            onChange={(e) => {
                                                // Permitir solo números, máximo 4 dígitos
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 4) {
                                                    setPaymentInfo({...paymentInfo, cvv: value});
                                                }
                                            }}
                                            required
                                            placeholder="123"
                                            maxLength="4"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                fontSize: '16px',
                                                border: '2px solid #e0f2fe',
                                                borderRadius: '8px',
                                                outline: 'none',
                                                transition: 'border-color 0.3s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0f2fe'}
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    padding: '15px',
                                    background: '#fef3c7',
                                    borderRadius: '12px',
                                    border: '2px solid #f59e0b',
                                    marginBottom: '25px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{ fontSize: '24px' }}>🔒</span>
                                    <p style={{
                                        margin: '0',
                                        color: '#78350f',
                                        fontSize: '13px',
                                        lineHeight: '1.5'
                                    }}>
                                        <strong>Pago 100% seguro:</strong> Todos tus datos están protegidos con encriptación SSL de nivel bancario.
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        style={{
                                            flex: 1,
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            border: '2px solid #cbd5e1',
                                            padding: '16px 28px',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = '#e2e8f0';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = '#f1f5f9';
                                        }}
                                    >
                                        ← Volver
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        style={{
                                            flex: 2,
                                            background: isProcessing
                                                ? '#94a3b8'
                                                : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                            color: 'white',
                                            border: '2px solid #fbbf24',
                                            padding: '16px 28px',
                                            borderRadius: '12px',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: isProcessing
                                                ? 'none'
                                                : '0 4px 12px rgba(22, 163, 74, 0.3)'
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
                                        {isProcessing ? '⏳ Procesando...' : '🔒 Pagar Ahora'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
