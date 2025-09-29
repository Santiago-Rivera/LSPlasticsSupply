"use client";
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe con tu clave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51xxx...');

export default function RealPaymentProcessor({
    selectedMethod,
    amount,
    cartItems,
    customerInfo,
    onSuccess,
    onError,
    onLoading
}) {
    const [stripe, setStripe] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [googlePayClient, setGooglePayClient] = useState(null);

    // Inicializar Stripe
    useEffect(() => {
        const initializeStripe = async () => {
            const stripeInstance = await stripePromise;
            setStripe(stripeInstance);
        };
        initializeStripe();
    }, []);

    // Crear Payment Intent cuando se selecciona tarjeta
    useEffect(() => {
        if (selectedMethod === 'card' && amount > 0) {
            createPaymentIntent();
        }
    }, [selectedMethod, amount]);

    // Inicializar Google Pay real
    useEffect(() => {
        if (typeof window !== 'undefined' && window.google?.payments?.api) {
            const paymentsClient = new window.google.payments.api.PaymentsClient({
                environment: process.env.NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT || 'TEST'
            });

            const baseRequest = {
                apiVersion: 2,
                apiVersionMinor: 0
            };

            const allowedCardNetworks = ['MASTERCARD', 'VISA', 'AMEX'];
            const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

            const tokenizationSpecification = {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    gateway: 'stripe',
                    'stripe:version': '2023-10-16',
                    'stripe:publishableKey': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                }
            };

            const baseCardPaymentMethod = {
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: allowedCardAuthMethods,
                    allowedCardNetworks: allowedCardNetworks
                }
            };

            const cardPaymentMethod = Object.assign(
                {},
                baseCardPaymentMethod,
                {
                    tokenizationSpecification: tokenizationSpecification
                }
            );

            const paymentDataRequest = Object.assign({}, baseRequest);
            paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
            paymentDataRequest.transactionInfo = {
                totalPriceStatus: 'FINAL',
                totalPrice: amount.toString(),
                currencyCode: 'USD'
            };
            paymentDataRequest.merchantInfo = {
                merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
                merchantName: 'L&S Plastics Supply'
            };

            paymentsClient.isReadyToPay(paymentDataRequest)
                .then(response => {
                    if (response.result) {
                        setGooglePayClient(paymentsClient);
                    }
                })
                .catch(console.error);
        }
    }, [amount]);

    // Crear Payment Intent real con Stripe
    const createPaymentIntent = async () => {
        try {
            onLoading(true);

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

            const data = await response.json();

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                throw new Error(data.error || 'Error creando Payment Intent');
            }
        } catch (error) {
            onError('Error preparando el pago: ' + error.message);
        } finally {
            onLoading(false);
        }
    };

    // Procesar pago real con Stripe
    const processStripePayment = async (paymentMethod) => {
        if (!stripe || !clientSecret) {
            onError('Stripe no está listo. Intenta nuevamente.');
            return;
        }

        try {
            onLoading(true);

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod
            });

            if (error) {
                onError(`Error en el pago: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                // Confirmar el pago en el servidor
                const confirmResponse = await fetch('/api/stripe/confirm-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id
                    }),
                });

                const confirmData = await confirmResponse.json();

                if (confirmData.success) {
                    onSuccess({
                        transactionId: paymentIntent.id,
                        paymentMethod: 'Stripe - Tarjeta Real',
                        amount: amount,
                        status: 'completed',
                        receiptUrl: confirmData.paymentIntent.receipt_url
                    });
                } else {
                    onError('Error confirmando el pago');
                }
            }
        } catch (error) {
            onError('Error procesando el pago: ' + error.message);
        } finally {
            onLoading(false);
        }
    };

    // Procesar pago real con Google Pay
    const processRealGooglePay = async () => {
        if (!googlePayClient) {
            onError('Google Pay no está disponible');
            return;
        }

        try {
            onLoading(true);

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
                            'stripe:publishableKey': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                        }
                    }
                }],
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPrice: amount.toString(),
                    currencyCode: 'USD'
                },
                merchantInfo: {
                    merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
                    merchantName: 'L&S Plastics Supply'
                }
            };

            const paymentData = await googlePayClient.loadPaymentData(paymentDataRequest);

            // Procesar con Stripe usando el token de Google Pay
            if (stripe && paymentData.paymentMethodData.tokenizationData.token) {
                const token = JSON.parse(paymentData.paymentMethodData.tokenizationData.token);

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: {
                            token: token.id
                        }
                    }
                });

                if (error) {
                    onError(`Error con Google Pay: ${error.message}`);
                } else if (paymentIntent.status === 'succeeded') {
                    onSuccess({
                        transactionId: paymentIntent.id,
                        paymentMethod: 'Google Pay Real',
                        amount: amount,
                        status: 'completed'
                    });
                }
            }
        } catch (error) {
            if (error.statusCode === 'CANCELED') {
                onError('Pago cancelado por el usuario');
            } else {
                onError('Error procesando Google Pay: ' + error.message);
            }
        } finally {
            onLoading(false);
        }
    };

    // Procesar pago real con PayPal
    const processRealPayPal = async () => {
        try {
            onLoading(true);

            // Crear orden en PayPal
            const createResponse = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    items: cartItems,
                    customerInfo: customerInfo
                }),
            });

            const createData = await createResponse.json();

            if (createData.orderID && createData.approvalUrl) {
                // Redirigir a PayPal real
                window.location.href = createData.approvalUrl;
            } else {
                throw new Error(createData.error || 'Error creando orden de PayPal');
            }
        } catch (error) {
            onError('Error con PayPal: ' + error.message);
            onLoading(false);
        }
    };

    // Renderizar según el método seleccionado
    if (selectedMethod === 'googlepay') {
        return (
            <div style={{ marginTop: '16px' }}>
                <button
                    onClick={processRealGooglePay}
                    disabled={!googlePayClient || !stripe}
                    style={{
                        backgroundColor: '#4285f4',
                        color: 'white',
                        padding: '16px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (googlePayClient && stripe) ? 'pointer' : 'not-allowed',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: (googlePayClient && stripe) ? 1 : 0.5,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (googlePayClient && stripe) {
                            e.target.style.backgroundColor = '#3367d6';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#4285f4';
                    }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#4285f4',
                        fontWeight: 'bold'
                    }}>
                        G
                    </div>
                    Pagar ${amount.toFixed(2)} con Google Pay
                </button>
                <div style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'center',
                    marginTop: '8px'
                }}>
                    {(googlePayClient && stripe) ?
                        '✅ Google Pay listo para pago real' :
                        '⏳ Cargando Google Pay...'}
                </div>
            </div>
        );
    }

    if (selectedMethod === 'paypal') {
        return (
            <div style={{ marginTop: '16px' }}>
                <div style={{
                    backgroundColor: '#f0f8ff',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid #0070ba'
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#0070ba',
                        fontWeight: '600',
                        marginBottom: '8px'
                    }}>
                        💡 Pago Real con PayPal
                    </div>
                    <div style={{
                        fontSize: '12px',
                        color: '#666',
                        lineHeight: '1.5'
                    }}>
                        • Serás redirigido a PayPal oficial<br/>
                        • Proceso de pago 100% seguro<br/>
                        • Puedes pagar con cuenta PayPal o tarjeta<br/>
                        • Protección total del comprador
                    </div>
                </div>

                <button
                    onClick={processRealPayPal}
                    style={{
                        backgroundColor: '#0070ba',
                        color: 'white',
                        padding: '16px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0, 112, 186, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#005ea6';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(0, 112, 186, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#0070ba';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 112, 186, 0.3)';
                    }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#0070ba',
                        fontWeight: 'bold'
                    }}>
                        PP
                    </div>
                    🔗 Pagar ${amount.toFixed(2)} con PayPal Real
                </button>
                <div style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'center',
                    marginTop: '8px'
                }}>
                    Serás redirigido a PayPal oficial para completar el pago
                </div>
            </div>
        );
    }

    if (selectedMethod === 'card' && stripe && clientSecret) {
        return (
            <div style={{ marginTop: '16px' }}>
                <div style={{
                    backgroundColor: '#f0fff4',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid #28a745'
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#28a745',
                        fontWeight: '600',
                        marginBottom: '8px'
                    }}>
                        🔒 Pago Real con Tarjeta
                    </div>
                    <div style={{
                        fontSize: '12px',
                        color: '#666',
                        lineHeight: '1.5'
                    }}>
                        • Procesamiento real con Stripe<br/>
                        • Encriptación de nivel bancario<br/>
                        • Cumplimiento PCI DSS<br/>
                        • Cargo real a tu tarjeta
                    </div>
                </div>

                <div id="stripe-card-element" style={{
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    marginBottom: '16px'
                }}>
                    {/* Aquí se renderizará el elemento de tarjeta de Stripe */}
                </div>
            </div>
        );
    }

    return null;
}
