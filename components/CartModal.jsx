"use client";
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function CartModal() {
    const router = useRouter();
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState('');
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartItemCount,
        isOpen,
        setIsOpen,
        clearCart
    } = useCart();

    if (!isOpen) return null;

    const total = getCartTotal();
    const itemCount = getCartItemCount();

    return (
        <div className="cart-modal-overlay" onClick={() => setIsOpen(false)}>

            {/* Cart Modal Panel */}
            <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="cart-modal-header">
                    <h2 className="cart-modal-title">
                        🛒 Shopping Cart ({itemCount})
                    </h2>
                    <button
                        className="cart-modal-close"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Cart Items */}
                <div className="cart-modal-body">
                    {/* Payment Processing Message */}
                    {paymentMessage && (
                        <div style={{
                            background: paymentMessage.includes('✅')
                                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                                : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                            color: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            textAlign: 'center',
                            fontWeight: '600',
                            border: '2px solid var(--accent-yellow)'
                        }}>
                            {paymentMessage}
                        </div>
                    )}

                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <p className="cart-empty-text">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    {/* Product Image with real images */}
                                    <div className="cart-item-image" style={{
                                        width: 'clamp(50px, 12vw, 70px)',
                                        height: 'clamp(50px, 12vw, 70px)',
                                        borderRadius: '8px',
                                        border: '2px solid var(--accent-yellow)',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        background: 'var(--off-white)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {item.imagen_url ? (
                                            <Image
                                                src={`/${item.imagen_url}`}
                                                alt={item.nombre}
                                                width={70}
                                                height={70}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    background: 'var(--pure-white)',
                                                    padding: '4px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div style={{
                                            fontSize: 'clamp(20px, 5vw, 28px)',
                                            color: 'var(--primary-blue)',
                                            display: item.imagen_url ? 'none' : 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            height: '100%'
                                        }}>
                                            📦
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="cart-item-details">
                                        <h4 className="cart-item-name">{item.nombre}</h4>
                                        <p className="cart-item-price">${item.precio}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="cart-item-quantity">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            +
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                            color: 'var(--pure-white)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.05)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}

                            {/* Cart Total & Payment Options */}
                            <div className="cart-total">
                                <p className="cart-total-text">
                                    Total: ${total.toFixed(2)}
                                </p>

                                {/* Processing Indicator */}
                                {paymentProcessing && (
                                    <div style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        marginBottom: '12px',
                                        border: '2px solid var(--accent-yellow)'
                                    }}>
                                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>⏳</div>
                                        Processing your payment...
                                    </div>
                                )}

                                {/* Traditional Checkout Button */}
                                <button
                                    className="cart-checkout-button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/checkout');
                                    }}
                                    disabled={paymentProcessing}
                                    style={{
                                        opacity: paymentProcessing ? 0.6 : 1,
                                        cursor: paymentProcessing ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    💳 Proceed to Secure Payment
                                </button>
                                
                                <button
                                    onClick={clearCart}
                                    disabled={paymentProcessing}
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, var(--light-black) 0%, var(--dark-black) 100%)',
                                        color: 'var(--pure-white)',
                                        border: '2px solid var(--accent-yellow)',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: paymentProcessing ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        marginTop: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        opacity: paymentProcessing ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!paymentProcessing) {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 8px 20px rgba(17, 24, 39, 0.4)';
                                            e.target.style.borderColor = 'var(--bright-yellow)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!paymentProcessing) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                            e.target.style.borderColor = 'var(--accent-yellow)';
                                        }
                                    }}
                                >
                                    🗑️ Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
