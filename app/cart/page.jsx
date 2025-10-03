"use client";
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import Image from 'next/image';

export default function CartPage() {
    const router = useRouter();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                padding: '40px 20px'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <div style={{
                        background: 'var(--pure-white)',
                        padding: '80px 40px',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)',
                        border: '3px solid var(--accent-yellow)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Top accent line */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)'
                        }}></div>

                        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🛒</div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            color: 'var(--dark-black)',
                            marginBottom: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Your cart is empty
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            color: 'var(--light-black)',
                            marginBottom: '40px',
                            fontWeight: '500'
                        }}>
                            Add products from our categories to start your purchase
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => router.push('/tienda/categorias')}
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                                    color: 'var(--pure-white)',
                                    padding: '16px 32px',
                                    border: '3px solid var(--accent-yellow)',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 15px 30px rgba(30, 58, 138, 0.4)';
                                    e.target.style.borderColor = 'var(--bright-yellow)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.borderColor = 'var(--accent-yellow)';
                                }}
                            >
                                🛍️ View Categories
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)',
                                    color: 'var(--dark-black)',
                                    padding: '16px 32px',
                                    border: '3px solid var(--bright-yellow)',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'linear-gradient(135deg, var(--bright-yellow) 0%, var(--accent-yellow) 100%)';
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 15px 30px rgba(251, 191, 36, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                🏠 Back to Home
                            </button>
                        </div>
                    </div>
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
                        🛒 Your Shopping Cart
                    </h1>
                    <p style={{
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        color: 'var(--accent-yellow)',
                        margin: 0,
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}>
                        📦 {cartItems.length} products | 💰 Total: ${total.toFixed(2)}
                    </p>
                </div>

                {/* Cart Items - Responsive */}
                <div style={{
                    background: 'var(--pure-white)',
                    borderRadius: 'clamp(12px, 2vw, 16px)',
                    padding: 'clamp(16px, 4vw, 30px)',
                    marginBottom: 'clamp(20px, 4vw, 30px)',
                    border: '2px solid var(--border-gray)',
                    boxShadow: '0 10px 25px rgba(30, 58, 138, 0.1)'
                }}>
                    {cartItems.map((item, index) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'clamp(12px, 3vw, 20px)',
                            background: index % 2 === 0 ? 'var(--off-white)' : 'var(--pure-white)',
                            borderRadius: 'clamp(8px, 1.5vw, 12px)',
                            marginBottom: 'clamp(8px, 2vw, 16px)',
                            border: '2px solid var(--border-gray)',
                            transition: 'all 0.3s ease',
                            borderLeft: '6px solid var(--accent-yellow)',
                            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                            gap: window.innerWidth < 768 ? '12px' : '16px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(8px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 58, 138, 0.2)';
                            e.currentTarget.style.borderColor = 'var(--primary-blue)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--border-gray)';
                        }}>

                            {/* Product Image */}
                            <div style={{
                                width: 'clamp(60px, 15vw, 80px)',
                                height: 'clamp(60px, 15vw, 80px)',
                                borderRadius: '8px',
                                border: '2px solid var(--accent-yellow)',
                                overflow: 'hidden',
                                background: 'var(--off-white)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {item.imagen_url ? (
                                    <Image
                                        src={`/${item.imagen_url}`}
                                        alt={item.nombre}
                                        width={80}
                                        height={80}
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
                                    fontSize: 'clamp(24px, 6vw, 32px)',
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

                            <div style={{
                                flex: 1,
                                textAlign: window.innerWidth < 768 ? 'center' : 'left'
                            }}>
                                <h3 style={{
                                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                                    fontWeight: '700',
                                    color: 'var(--dark-black)',
                                    margin: '0 0 8px 0'
                                }}>
                                    {item.nombre}
                                </h3>
                                <p style={{
                                    fontSize: 'clamp(12px, 3vw, 16px)',
                                    color: 'var(--primary-blue)',
                                    margin: 0,
                                    fontWeight: '600'
                                }}>
                                    ${item.precio} x {item.quantity} = ${(item.precio * item.quantity).toFixed(2)}
                                </p>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(8px, 2vw, 16px)',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                {/* Quantity controls - Responsive */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'clamp(6px, 1.5vw, 8px)',
                                    background: 'var(--accent-yellow)',
                                    padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                                    borderRadius: 'clamp(6px, 1.5vw, 10px)',
                                    border: '2px solid var(--bright-yellow)'
                                }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={{
                                            background: 'var(--primary-blue)',
                                            color: 'var(--pure-white)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            width: 'clamp(24px, 6vw, 28px)',
                                            height: 'clamp(24px, 6vw, 28px)',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            fontSize: 'clamp(12px, 3vw, 16px)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'var(--primary-dark-blue)';
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'var(--primary-blue)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        -
                                    </button>
                                    <span style={{
                                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                                        fontWeight: '700',
                                        color: 'var(--dark-black)',
                                        minWidth: 'clamp(20px, 5vw, 24px)',
                                        textAlign: 'center'
                                    }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{
                                            background: 'var(--primary-blue)',
                                            color: 'var(--pure-white)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            width: 'clamp(24px, 6vw, 28px)',
                                            height: 'clamp(24px, 6vw, 28px)',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            fontSize: 'clamp(12px, 3vw, 16px)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'var(--primary-dark-blue)';
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'var(--primary-blue)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove button - Responsive */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{
                                        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                        color: 'var(--pure-white)',
                                        border: '2px solid var(--accent-yellow)',
                                        borderRadius: '8px',
                                        padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                                        cursor: 'pointer',
                                        fontSize: 'clamp(12px, 3vw, 14px)',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.boxShadow = '0 6px 15px rgba(220, 38, 38, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary - Responsive */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    borderRadius: 'clamp(12px, 2vw, 16px)',
                    padding: 'clamp(20px, 4vw, 30px)',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 15px 35px rgba(30, 58, 138, 0.2)',
                    marginBottom: 'clamp(20px, 4vw, 30px)'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(18px, 4.5vw, 24px)',
                        fontWeight: '800',
                        color: 'var(--pure-white)',
                        margin: '0 0 20px 0',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: 'clamp(0.5px, 0.2vw, 1px)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}>
                        💰 Purchase Summary
                    </h2>

                    <div style={{
                        background: 'var(--accent-yellow)',
                        padding: 'clamp(16px, 4vw, 20px)',
                        borderRadius: 'clamp(8px, 1.5vw, 12px)',
                        border: '2px solid var(--bright-yellow)',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: 'clamp(20px, 5vw, 28px)',
                            fontWeight: '800',
                            color: 'var(--dark-black)',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: 'clamp(0.5px, 0.2vw, 1px)'
                        }}>
                            Total: ${total.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Action Buttons - Responsive */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 'clamp(16px, 3vw, 20px)'
                }}>
                    <button
                        onClick={() => router.push('/checkout')}
                        style={{
                            background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)',
                            color: 'var(--dark-black)',
                            padding: 'clamp(16px, 4vw, 20px) clamp(24px, 6vw, 40px)',
                            border: '3px solid var(--bright-yellow)',
                            borderRadius: 'clamp(8px, 1.5vw, 12px)',
                            fontSize: 'clamp(16px, 4vw, 20px)',
                            fontWeight: '800',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: 'clamp(0.5px, 0.2vw, 1px)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, var(--bright-yellow) 0%, var(--accent-yellow) 100%)';
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 15px 30px rgba(251, 191, 36, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        🚀 Proceed to Payment
                    </button>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
                        gap: 'clamp(12px, 2.5vw, 16px)'
                    }}>
                        <button
                            onClick={() => router.push('/tienda/categorias')}
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                                color: 'var(--pure-white)',
                                padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
                                border: '2px solid var(--accent-yellow)',
                                borderRadius: 'clamp(6px, 1.5vw, 10px)',
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(30, 58, 138, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            🛍️ Continue Shopping
                        </button>

                        <button
                            onClick={clearCart}
                            style={{
                                background: 'linear-gradient(135deg, var(--light-black) 0%, var(--dark-black) 100%)',
                                color: 'var(--pure-white)',
                                padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
                                border: '2px solid var(--accent-yellow)',
                                borderRadius: 'clamp(6px, 1.5vw, 10px)',
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(17, 24, 39, 0.4)';
                                e.target.style.borderColor = 'var(--bright-yellow)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                                e.target.style.borderColor = 'var(--accent-yellow)';
                            }}
                        >
                            🗑️ Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
