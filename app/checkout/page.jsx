"use client";
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCardForm from '../../components/StripeCardForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    useEffect(() => {
        if (cartItems.length === 0 && !orderComplete) {
            router.push('/cart');
        }
    }, [cartItems, router, orderComplete]);

    const generateOrderNumber = () => {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `LS-${timestamp.slice(-6)}-${random}`;
    };

    const handlePaymentSuccess = (paymentIntent) => {
        const orderNum = generateOrderNumber();
        setOrderNumber(orderNum);
        setOrderComplete(true);
        clearCart();
        console.log('Payment successful:', paymentIntent);
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
        alert('Error en el pago: ' + error);
    };

    if (orderComplete) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f0f9ff'
            }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxWidth: '500px'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
                    <h1 style={{ color: '#16a34a', marginBottom: '10px' }}>¡Pago Exitoso!</h1>
                    <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                        Orden #{orderNumber}
                    </p>
                    <p style={{ color: '#666', marginBottom: '30px' }}>
                        Gracias por tu compra. Recibirás un email de confirmación pronto.
                    </p>
                    <button
                        onClick={() => router.push('/tienda')}
                        style={{
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Continuar Comprando
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Ir al Inicio
                    </button>
                </div>
            </div>
        );
    }

    const total = getCartTotal();

    return (
        <div style={{ minHeight: '100vh', padding: '20px', background: '#f9fafb' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Checkout</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    {/* Resumen del pedido */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h2>Resumen del Pedido</h2>
                        {cartItems.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: '1px solid #f3f4f6'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{item.nombre}</h4>
                                    <p style={{ margin: 0, color: '#666' }}>Cantidad: {item.quantity}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                                        ${(item.precio * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div style={{
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: '2px solid #e5e7eb'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '20px',
                                fontWeight: 'bold'
                            }}>
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de pago */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h2>Información de Pago</h2>
                        <Elements stripe={stripePromise}>
                            <StripeCardForm
                                amount={total}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                            />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
}
