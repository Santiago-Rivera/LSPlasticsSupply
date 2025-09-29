"use client";
import { useEffect, useState } from 'react';

export default function PaymentProcessor({
    selectedMethod,
    amount,
    onSuccess,
    onError,
    onLoading,
    cartItems
}) {
    const [googlePayClient, setGooglePayClient] = useState(null);
    const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);

    // Configuración de Google Pay
    const googlePayConfig = {
        environment: 'TEST', // Cambiar a 'PRODUCTION' en producción
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
                    gateway: 'example',
                    gatewayMerchantId: 'exampleGatewayMerchantId'
                }
            }
        }],
        merchantInfo: {
            merchantId: 'BCR2DN4T2C2OKHLS', // ID de prueba
            merchantName: 'L&S Plastics Supply'
        },
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: amount.toString(),
            currencyCode: 'USD',
            countryCode: 'US'
        }
    };

    // Inicializar Google Pay
    useEffect(() => {
        if (typeof window !== 'undefined' && window.google?.payments?.api) {
            const client = new window.google.payments.api.PaymentsClient({
                environment: 'TEST'
            });

            client.isReadyToPay(googlePayConfig)
                .then(response => {
                    if (response.result) {
                        setGooglePayClient(client);
                    }
                })
                .catch(console.error);
        }
    }, []);

    // Inicializar PayPal - Hook movido al nivel superior
    useEffect(() => {
        if (typeof window !== 'undefined' && window.paypal && selectedMethod === 'paypal' && !paypalButtonsRendered) {
            const container = document.getElementById('paypal-button-container');
            if (container) {
                container.innerHTML = '';

                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: amount.toString(),
                                    currency_code: 'USD'
                                },
                                description: `Compra en L&S Plastics - ${cartItems.length} productos`,
                                custom_id: `ls-order-${Date.now()}`
                            }]
                        });
                    },
                    onApprove: async (data, actions) => {
                        try {
                            onLoading(true);
                            const order = await actions.order.capture();

                            // Simular procesamiento adicional
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            onSuccess({
                                transactionId: order.id,
                                paymentMethod: 'PayPal',
                                amount: amount,
                                status: 'completed',
                                payerInfo: order.payer
                            });
                        } catch (error) {
                            onError('Error procesando el pago con PayPal: ' + error.message);
                        } finally {
                            onLoading(false);
                        }
                    },
                    onError: (err) => {
                        onError('Error de PayPal: ' + err);
                    },
                    onCancel: () => {
                        onError('Pago cancelado por el usuario');
                    },
                    style: {
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        label: 'paypal',
                        height: 50
                    }
                }).render('#paypal-button-container');

                setPaypalButtonsRendered(true);
            }
        }
    }, [amount, cartItems, onSuccess, onError, onLoading, selectedMethod, paypalButtonsRendered]);

    // Procesar pago directo con PayPal (redirección)
    const processPayPalRedirect = async () => {
        try {
            onLoading(true);

            // Crear orden de PayPal para redirección
            const orderData = {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        value: amount.toString(),
                        currency_code: 'USD'
                    },
                    description: `Compra en L&S Plastics - ${cartItems.length} productos`
                }],
                application_context: {
                    return_url: `${window.location.origin}/checkout/success`,
                    cancel_url: `${window.location.origin}/checkout/cancel`,
                    brand_name: 'L&S Plastics Supply',
                    user_action: 'PAY_NOW'
                }
            };

            // En un entorno real, esto se haría en el servidor
            // Aquí simulamos la redirección a PayPal
            const paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=demo_token_${Date.now()}`;

            // Guardar datos del pedido en localStorage para recuperar después
            localStorage.setItem('ls-pending-order', JSON.stringify({
                cartItems,
                total: amount,
                timestamp: Date.now()
            }));

            // Mostrar modal de redirección
            const userConfirms = confirm(
                `Se abrirá PayPal en una nueva ventana para completar tu pago de $${amount.toFixed(2)}.\n\n` +
                '¿Deseas continuar?'
            );

            if (userConfirms) {
                // Abrir PayPal en nueva ventana
                const paypalWindow = window.open(
                    paypalUrl,
                    'paypal_payment',
                    'width=500,height=600,scrollbars=yes,resizable=yes'
                );

                // Simular retorno exitoso después de un tiempo
                setTimeout(() => {
                    if (paypalWindow) {
                        paypalWindow.close();
                    }

                    // Simular pago exitoso
                    onSuccess({
                        transactionId: `pp_${Date.now()}`,
                        paymentMethod: 'PayPal Redirect',
                        amount: amount,
                        status: 'completed'
                    });
                }, 5000); // 5 segundos simulando el proceso en PayPal

            } else {
                onError('Pago cancelado por el usuario');
            }

        } catch (error) {
            onError('Error redirigiendo a PayPal: ' + error.message);
        } finally {
            onLoading(false);
        }
    };

    // Procesar pago con Google Pay
    const processGooglePay = async () => {
        if (!googlePayClient) {
            onError('Google Pay no está disponible');
            return;
        }

        try {
            onLoading(true);

            const paymentData = await googlePayClient.loadPaymentData(googlePayConfig);

            // Simular procesamiento del token de pago
            await new Promise(resolve => setTimeout(resolve, 2000));

            // En producción, aquí enviarías el token a tu servidor
            console.log('Google Pay Token:', paymentData.paymentMethodData.tokenizationData.token);

            onSuccess({
                transactionId: `gp_${Date.now()}`,
                paymentMethod: 'Google Pay',
                amount: amount,
                status: 'completed'
            });

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

    if (selectedMethod === 'googlepay') {
        return (
            <div style={{ marginTop: '16px' }}>
                <button
                    onClick={processGooglePay}
                    disabled={!googlePayClient}
                    style={{
                        backgroundColor: '#4285f4',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: googlePayClient ? 'pointer' : 'not-allowed',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: googlePayClient ? 1 : 0.5,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (googlePayClient) {
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
                    Pay with Google Pay
                </button>
                {!googlePayClient && (
                    <div style={{
                        fontSize: '12px',
                        color: '#666',
                        textAlign: 'center',
                        marginTop: '8px'
                    }}>
                        Verificando disponibilidad de Google Pay...
                    </div>
                )}
            </div>
        );
    }

    if (selectedMethod === 'paypal') {
        return (
            <div style={{ marginTop: '16px' }}>
                <div
                    id="paypal-button-container"
                    style={{
                        minHeight: '50px'
                    }}
                />
                <div style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'center',
                    marginTop: '8px'
                }}>
                    Serás redirigido a PayPal para completar el pago
                </div>
            </div>
        );
    }

    return null;
}
