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
        <div className="cart-modal-overlay" onClick={() => setIsOpen(false)}>
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
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                            <h3>Your cart is empty</h3>
                            <p>Add some products to get started!</p>
                            <button
                                onClick={handleContinueShopping}
                                className="continue-shopping-btn"
                            >
                                🛍️ Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        <Image
                                            src={item.imagen_url}
                                            alt={item.nombre}
                                            fill
                                            style={{
                                                objectFit: 'contain',
                                                padding: '4px'
                                            }}
                                        />
                                    </div>

                                    <div className="cart-item-info">
                                        <h4 className="cart-item-name">{item.nombre}</h4>
                                        <p className="cart-item-desc">
                                            {item.descripcion?.substring(0, 50)}...
                                        </p>
                                        <div className="cart-item-price">${item.precio}</div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="cart-item-remove"
                                    >
                                        ✕
                                    </button>

                                    <div className="cart-item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="quantity-btn"
                                        >
                                            -
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="quantity-btn"
                                        >
                                            +
                                        </button>
                                        <div className="item-total">
                                            ${(item.precio * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="cart-modal-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <div className="cart-actions">
                            <button
                                onClick={handleCheckout}
                                className="checkout-btn"
                            >
                                💳 Checkout
                            </button>

                            <div className="cart-secondary-actions">
                                <button
                                    onClick={handleContinueShopping}
                                    className="continue-btn"
                                >
                                    🛍️ Continue Shopping
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="clear-btn"
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
