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
            if (item.quantity >= 2) { // 5% de descuento para 2 o más unidades
                const itemTotal = parseFloat(item.precio || 0) * item.quantity;
                const discount = itemTotal * 0.05;
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

    // Cargar carrito desde localStorage al inicio
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedCart = localStorage.getItem('ls-plastics-cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(parsedCart);
                }
            } catch (error) {
                console.error('Error cargando carrito desde localStorage:', error);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('ls-plastics-cart');
                }
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('ls-plastics-cart', JSON.stringify(cartItems));
            } catch (error) {
                console.error('Error guardando carrito:', error);
            }
        }
    }, [cartItems]);

    // Agregar producto al carrito
    const addToCart = useCallback((product) => {
        setCartItems(prevItems => {
            const productId = product.id || product.codigo_producto || product.nombre;
            const existingItem = prevItems.find(item => item.id === productId);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...product, id: productId, quantity: 1 }];
            }
        });
    }, []);

    // Remover producto del carrito
    const removeFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }, []);

    // Actualizar cantidad de un producto
    const updateQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    }, [removeFromCart]);

    // Limpiar carrito (con logging para métricas)
    const clearCart = useCallback(() => {
        const itemCount = getCartItemCount(); // Reutilizar lógica existente
        const totalValue = getCartTotal(); // Reutilizar lógica de cálculo de total para consistencia

        setCartItems([]);

        // Log para métricas
        console.log(`🗑️ Carrito limpiado: ${itemCount} items, valor: $${totalValue.toFixed(2)}`);

        // Limpiar también del localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ls-plastics-cart');
            localStorage.removeItem('ls-plastics-cart-timestamp');
        }
    }, [getCartItemCount, getCartTotal]);

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
