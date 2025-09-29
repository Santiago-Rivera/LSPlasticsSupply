"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    // Generar ID de sesión único para el balanceador de carga
    useEffect(() => {
        let sid = localStorage.getItem('ls-session-id');
        if (!sid) {
            sid = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('ls-session-id', sid);
        }
        setSessionId(sid);
    }, []);

    // Cargar carrito desde localStorage al inicio (optimizado para alta concurrencia)
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('ls-plastics-cart');
            const cartTimestamp = localStorage.getItem('ls-plastics-cart-timestamp');

            if (savedCart && cartTimestamp) {
                // Verificar que el cache no sea muy antiguo (24 horas)
                const age = Date.now() - parseInt(cartTimestamp);
                if (age < 86400000) { // 24 horas
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(parsedCart);
                    console.log('🛒 Carrito cargado desde cache:', parsedCart.length, 'items');
                } else {
                    // Cache expirado, limpiar
                    localStorage.removeItem('ls-plastics-cart');
                    localStorage.removeItem('ls-plastics-cart-timestamp');
                }
            }
        } catch (error) {
            console.error('Error cargando carrito desde cache:', error);
            // En caso de error, limpiar cache corrupto
            localStorage.removeItem('ls-plastics-cart');
            localStorage.removeItem('ls-plastics-cart-timestamp');
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie (con debounce para rendimiento)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem('ls-plastics-cart', JSON.stringify(cartItems));
                localStorage.setItem('ls-plastics-cart-timestamp', Date.now().toString());

                // Enviar métricas del carrito al balanceador (opcional)
                if (cartItems.length > 0) {
                    fetch('/api/metrics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            cartItems: cartItems.length,
                            cartValue: getCartTotal(),
                            sessionId: sessionId,
                            timestamp: Date.now()
                        })
                    }).catch(() => {}); // Silently fail si no es crítico
                }
            } catch (error) {
                console.error('Error guardando carrito:', error);
            }
        }, 500); // Debounce de 500ms para evitar writes excesivos

        return () => clearTimeout(timeoutId);
    }, [cartItems, sessionId]);

    // Agregar producto al carrito (optimizado)
    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Usar codigo_producto como identificador único si no hay id
            const productId = product.id || product.codigo_producto || product.nombre;
            const existingItemIndex = prevItems.findIndex(item =>
                (item.id && item.id === productId) ||
                (item.codigo_producto && item.codigo_producto === product.codigo_producto)
            );

            if (existingItemIndex !== -1) {
                // Si el producto ya existe, incrementar cantidad (inmutable update)
                const newItems = [...prevItems];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + 1
                };
                return newItems;
            } else {
                // Si es nuevo, agregarlo con cantidad 1 y asegurar que tenga id
                const newProduct = {
                    ...product,
                    id: productId,
                    quantity: 1,
                    stock: product.stock || 100, // Valor por defecto si no existe
                    addedAt: Date.now(), // Para debugging y métricas
                    sessionId: sessionId
                };
                return [...prevItems, newProduct];
            }
        });
    };

    // Remover producto del carrito (optimizado)
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Actualizar cantidad de un producto (optimizado)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity, updatedAt: Date.now() }
                    : item
            )
        );
    };

    // Calcular total del carrito (memoizado para rendimiento)
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.precio || 0) * (item.quantity || 0));
        }, 0);
    };

    // Obtener cantidad total de productos (memoizado)
    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    // Limpiar carrito (con logging para métricas)
    const clearCart = () => {
        const itemCount = cartItems.length;
        const totalValue = getCartTotal();

        setCartItems([]);

        // Log para métricas del balanceador
        console.log(`🗑️ Carrito limpiado: ${itemCount} items, valor: $${totalValue.toFixed(2)}`);

        // Notificar al sistema de métricas
        fetch('/api/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'cart_cleared',
                itemCount,
                totalValue,
                sessionId: sessionId,
                timestamp: Date.now()
            })
        }).catch(() => {});
    };

    // Función para sincronizar carrito entre instancias (futuro uso con Redis)
    const syncCart = async () => {
        if (!sessionId) return;

        try {
            // En el futuro, esto se conectaría con Redis para sincronización
            // entre instancias del balanceador de carga
            const response = await fetch(`/api/cart/sync/${sessionId}`);
            if (response.ok) {
                const syncedCart = await response.json();
                if (syncedCart.items) {
                    setCartItems(syncedCart.items);
                }
            }
        } catch (error) {
            console.error('Error sincronizando carrito:', error);
        }
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartItemCount,
        clearCart,
        syncCart,
        isOpen,
        setIsOpen,
        sessionId
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
