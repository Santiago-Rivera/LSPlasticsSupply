"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    // Generar ID de sesión único para el balanceador de carga
    useEffect(() => {
        if (typeof window !== 'undefined') {
            let sid = localStorage.getItem('ls-session-id');
            if (!sid) {
                sid = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('ls-session-id', sid);
            }
            setSessionId(sid);
        }
    }, []);

    // Calcular descuentos por cantidad (5% para 2 o más unidades del mismo producto)
    const getQuantityDiscounts = useCallback(() => {
        return cartItems.reduce((totalDiscount, item) => {
            if (item.quantity >= 2) { // Cambiado de > 2 a >= 2
                const itemTotal = parseFloat(item.precio || 0) * item.quantity;
                const discount = itemTotal * 0.05; // 5% de descuento
                return totalDiscount + discount;
            }
            return totalDiscount;
        }, 0);
    }, [cartItems]);

    // Calcular total del carrito CON descuentos aplicados (memoizado para rendimiento)
    const getCartTotal = useCallback(() => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (parseFloat(item.precio || 0) * (item.quantity || 0));
        }, 0);

        const quantityDiscount = getQuantityDiscounts();
        return subtotal - quantityDiscount;
    }, [cartItems, getQuantityDiscounts]);

    // Calcular subtotal SIN descuentos
    const getCartSubtotal = useCallback(() => {
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.precio || 0) * (item.quantity || 0));
        }, 0);
    }, [cartItems]);

    // Obtener cantidad total de productos (memoizado)
    const getCartItemCount = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    }, [cartItems]);

    // Cargar carrito desde localStorage al inicio (optimizado para alta concurrencia)
    useEffect(() => {
        if (typeof window !== 'undefined') {
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
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('ls-plastics-cart');
                    localStorage.removeItem('ls-plastics-cart-timestamp');
                }
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie (con debounce para rendimiento)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('ls-plastics-cart', JSON.stringify(cartItems));
                    localStorage.setItem('ls-plastics-cart-timestamp', Date.now().toString());
                } catch (error) {
                    console.error('Error guardando carrito:', error);
                }
            }
        }, 500); // Debounce de 500ms para evitar writes excesivos

        return () => clearTimeout(timeoutId);
    }, [cartItems, sessionId]);

    // Agregar producto al carrito (optimizado)
    const addToCart = useCallback((product) => {
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
    }, [sessionId]);

    // Remover producto del carrito (optimizado)
    const removeFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }, []);

    // Actualizar cantidad de un producto (optimizado)
    const updateQuantity = useCallback((productId, newQuantity) => {
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
    }, [removeFromCart]);

    // Limpiar carrito (con logging para métricas)
    const clearCart = useCallback(() => {
        const itemCount = cartItems.length;
        const totalValue = cartItems.reduce((total, item) => {
            const basePrice = item.precio * item.quantity;
            const discountedPrice = item.quantity >= 2 ? basePrice * 0.95 : basePrice;
            return total + discountedPrice;
        }, 0);

        setCartItems([]);

        // Log para métricas del balanceador
        console.log(`🗑️ Carrito limpiado: ${itemCount} items, valor: $${totalValue.toFixed(2)}`);

        // Limpiar también del localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ls-plastics-cart');
            localStorage.removeItem('ls-plastics-cart-timestamp');
        }
    }, [cartItems]);

    const value = {
        cartItems,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartSubtotal,
        getQuantityDiscounts,
        getCartItemCount,
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
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
