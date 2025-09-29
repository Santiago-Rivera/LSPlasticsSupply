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
                backgroundColor: '#f8f9fa',
                padding: '40px 20px'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '80px 40px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: '80px', marginBottom: '24px', opacity: 0.5 }}>🛒</div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            marginBottom: '16px'
                        }}>
                            Tu carrito está vacío
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#666',
                            marginBottom: '40px'
                        }}>
                            Agrega productos desde nuestras categorías para comenzar tu compra
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => router.push('/tienda/categorias')}
                                style={{
                                    backgroundColor: '#4a5568',
                                    color: 'white',
                                    padding: '16px 32px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4a5568'}>
                                🛒 Ver Categorías
                            </button>
                            <button
                                onClick={() => router.push('/productos')}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#4a5568',
                                    padding: '16px 32px',
                                    border: '2px solid #4a5568',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#4a5568';
                                    e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#4a5568';
                                }}>
                                📦 Ver Todos los Productos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        marginBottom: '16px'
                    }}>
                        🛒 Tu Carrito de Compras
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#666'
                    }}>
                        {cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en tu carrito
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '40px',
                    alignItems: 'start'
                }}>
                    {/* Cart Items */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            marginBottom: '24px'
                        }}>
                            Productos en tu carrito
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {cartItems.map((item) => (
                                <div key={item.id || item.codigo_producto} style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '16px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '12px',
                                    border: '1px solid #e9ecef',
                                    alignItems: 'center'
                                }}>
                                    {/* Product Image */}
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #e9ecef',
                                        fontSize: '24px',
                                        color: '#999'
                                    }}>
                                        📦
                                    </div>

                                    {/* Product Info */}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#2c3e50',
                                            marginBottom: '4px'
                                        }}>
                                            {item.nombre}
                                        </h3>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '8px'
                                        }}>
                                            {item.categoria}
                                        </p>
                                        <p style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#28a745'
                                        }}>
                                            ${parseFloat(item.precio).toFixed(2)} c/u
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                            -
                                        </button>

                                        <span style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#2c3e50',
                                            minWidth: '30px',
                                            textAlign: 'center'
                                        }}>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={{
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                            +
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div style={{
                                        textAlign: 'right',
                                        minWidth: '100px'
                                    }}>
                                        <p style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#2c3e50',
                                            marginBottom: '4px'
                                        }}>
                                            ${(parseFloat(item.precio) * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#dc3545',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                textDecoration: 'underline'
                                            }}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            marginBottom: '24px'
                        }}>
                            Resumen del Pedido
                        </h2>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            {cartItems.map((item) => (
                                <div key={item.id || item.codigo_producto} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                    color: '#666'
                                }}>
                                    <span>{item.nombre} x{item.quantity}</span>
                                    <span>${(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <hr style={{
                            border: 'none',
                            borderTop: '2px solid #e9ecef',
                            margin: '24px 0'
                        }} />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '32px'
                        }}>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#2c3e50'
                            }}>
                                Total:
                            </span>
                            <span style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#28a745'
                            }}>
                                ${getCartTotal().toFixed(2)}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <button
                                onClick={() => router.push('/checkout')}
                                style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                padding: '16px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}>
                                💳 Proceder al Pago
                            </button>

                            <button
                                onClick={clearCart}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#dc3545',
                                    padding: '12px',
                                    border: '2px solid #dc3545',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#dc3545';
                                    e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#dc3545';
                                }}>
                                🗑️ Vaciar Carrito
                            </button>
                        </div>

                        {/* Cart Statistics */}
                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            <div style={{ marginBottom: '4px' }}>
                                📊 <strong>Estadísticas:</strong>
                            </div>
                            <div>• Productos únicos: {cartItems.length}</div>
                            <div>• Cantidad total: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
                            <div>• Precio promedio: ${cartItems.length > 0 ? (getCartTotal() / cartItems.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2) : '0.00'}</div>
                        </div>
                    </div>
                </div>

                {/* Continue Shopping */}
                <div style={{
                    marginTop: '40px',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={() => router.push('/tienda/categorias')}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#4a5568',
                            padding: '16px 32px',
                            border: '2px solid #4a5568',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#4a5568';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#4a5568';
                        }}>
                        ← Continuar Comprando
                    </button>
                </div>
            </div>
        </div>
    );
}
