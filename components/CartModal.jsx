"use client";
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartModal() {
    const router = useRouter();
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

    const handleCheckout = () => {
        setIsOpen(false);
        router.push('/checkout');
    };

    const handleContinueShopping = () => {
        setIsOpen(false);
        router.push('/tienda/categorias');
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'stretch'
            }}
            onClick={() => setIsOpen(false)}
        >
            {/* Cart Modal Panel */}
            <div
                style={{
                    background: '#ffffff',
                    width: 'clamp(320px, 40vw, 500px)',
                    height: '100vh',
                    overflowY: 'auto',
                    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '3px solid #fbbf24'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: 'clamp(18px, 4vw, 22px)',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        🛒 Cart ({itemCount})
                    </h2>
                    <button
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '5px',
                            borderRadius: '50%',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => setIsOpen(false)}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Cart Items */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    {cartItems.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#6b7280'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                margin: '0 0 8px 0',
                                color: '#374151'
                            }}>
                                Your cart is empty
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                margin: '0 0 20px 0'
                            }}>
                                Add some products to get started!
                            </p>
                            <button
                                onClick={handleContinueShopping}
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                🛍️ Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        background: '#f8fafc',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Product Image and Info */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            position: 'relative',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            background: '#ffffff',
                                            flexShrink: 0
                                        }}>
                                            <Image
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                fill
                                                style={{
                                                    objectFit: 'contain',
                                                    padding: '4px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1e3a8a',
                                                margin: '0 0 4px 0',
                                                lineHeight: 1.3,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {item.nombre}
                                            </h4>
                                            <p style={{
                                                fontSize: '12px',
                                                color: '#6b7280',
                                                margin: '0 0 8px 0',
                                                lineHeight: 1.3
                                            }}>
                                                {item.descripcion?.substring(0, 50)}...
                                            </p>
                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                color: '#1e3a8a'
                                            }}>
                                                ${item.precio}
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                background: '#ef4444',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#dc2626';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = '#ef4444';
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{
                                                    background: '#6b7280',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    width: '28px',
                                                    height: '28px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                -
                                            </button>

                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                minWidth: '20px',
                                                textAlign: 'center'
                                            }}>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{
                                                    background: '#3b82f6',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    width: '28px',
                                                    height: '28px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            color: '#1e3a8a'
                                        }}>
                                            ${(item.precio * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Total and Actions */}
                {cartItems.length > 0 && (
                    <div style={{
                        borderTop: '2px solid #e5e7eb',
                        padding: '20px',
                        background: '#f8fafc'
                    }}>
                        {/* Total */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            padding: '16px',
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '2px solid #fbbf24'
                        }}>
                            <span style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1e3a8a',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Total:
                            </span>
                            <span style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                color: '#1e3a8a'
                            }}>
                                ${total.toFixed(2)}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <button
                                onClick={handleCheckout}
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                💳 Checkout
                            </button>

                            <div style={{
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <button
                                    onClick={handleContinueShopping}
                                    style={{
                                        flex: 1,
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    🛍️ Continue Shopping
                                </button>

                                <button
                                    onClick={clearCart}
                                    style={{
                                        flex: 1,
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    🗑️ Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
