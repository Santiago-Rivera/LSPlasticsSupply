"use client";
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useState, useEffect } from 'react';
import StripeCardForm from '../../components/StripeCardForm';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card'); // Auto-select card
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [windowWidth, setWindowWidth] = useState(1024);
    const [paymentMessage, setPaymentMessage] = useState('');

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

    // Handle successful payment
    const handlePaymentSuccess = (paymentData) => {
        const orderNum = generateOrderNumber();
        setOrderNumber(orderNum);
        setOrderComplete(true);
        clearCart();
        console.log('Successful payment:', paymentData);
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

                    {/* Payment Methods - Only Credit Card */}
                    <div style={{
                        background: 'var(--pure-white)',
                        borderRadius: 'clamp(12px, 2vw, 16px)',
                        padding: 'clamp(20px, 4vw, 30px)',
                        border: '2px solid var(--border-gray)',
                        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.1)',
                        order: windowWidth < 1024 ? 1 : 2
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(18px, 4vw, 24px)',
                            fontWeight: '700',
                            color: 'var(--dark-black)',
                            margin: '0 0 clamp(20px, 4vw, 30px) 0',
                            textTransform: 'uppercase',
                            borderBottom: '3px solid var(--accent-yellow)',
                            paddingBottom: '12px'
                        }}>
                            💳 Secure Credit Card Payment
                        </h2>

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
                                Processing your payment...
                            </div>
                        )}

                        {/* Credit Card Form */}
                        {!paymentProcessing && (
                            <StripeCardForm
                                amount={total}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                                onLoading={setPaymentProcessing}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
