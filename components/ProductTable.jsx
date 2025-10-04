"use client";
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

export default function ProductTable({ products }) {
    const { addToCart } = useCart();
    const [addedProducts, setAddedProducts] = useState(new Set());

    const handleAddToCart = (product) => {
        try {
            addToCart(product);
            setAddedProducts(prev => new Set([...prev, product.codigo_producto]));

            setTimeout(() => {
                setAddedProducts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(product.codigo_producto);
                    return newSet;
                });
            }, 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (!products || products.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                borderRadius: '16px',
                border: '3px solid var(--accent-yellow)',
                boxShadow: '0 10px 30px rgba(30, 58, 138, 0.1)'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                }}>📦</div>
                <p style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--light-black)'
                }}>No hay productos para mostrar</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            padding: '20px 0'
        }}>
            {products.map((product) => (
                <div
                    key={product.codigo_producto}
                    style={{
                        background: 'var(--pure-white)',
                        borderRadius: '16px',
                        border: '3px solid var(--accent-yellow)',
                        padding: '20px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    {/* Product accent line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)'
                    }}></div>

                    {/* Product Image */}
                    <div style={{
                        width: '100%',
                        height: '180px',
                        position: 'relative',
                        marginBottom: '16px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: 'var(--off-white)',
                        border: '2px solid var(--border-gray)'
                    }}>
                        <Image
                            src={`/${product.imagen_url}`}
                            alt={product.nombre}
                            fill
                            style={{
                                objectFit: 'contain',
                                padding: '8px'
                            }}
                            onError={(e) => {
                                console.log('Product image failed to load:', product.imagen_url);
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        {/* Fallback icon if image fails */}
                        <div style={{
                            display: 'none',
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            color: 'var(--primary-blue)'
                        }}>
                            📦
                        </div>
                    </div>

                    {/* Product Info */}
                    <h3 style={{
                        color: 'var(--primary-dark-blue)',
                        fontSize: '16px',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        lineHeight: '1.3'
                    }}>
                        {product.nombre}
                    </h3>

                    <p style={{
                        color: 'var(--light-black)',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        margin: '0 0 16px 0',
                        fontWeight: '500'
                    }}>
                        {product.descripcion}
                    </p>

                    <div style={{
                        fontSize: '12px',
                        color: 'var(--primary-blue)',
                        fontWeight: '600',
                        marginBottom: '12px'
                    }}>
                        Código: {product.codigo_producto}
                    </div>

                    {/* Price and Add to Cart */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px'
                    }}>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: '800',
                            color: 'var(--primary-dark-blue)'
                        }}>
                            ${product.precio}
                        </span>

                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addedProducts.has(product.codigo_producto)}
                            style={{
                                background: addedProducts.has(product.codigo_producto)
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark-blue) 100%)',
                                color: 'var(--pure-white)',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: addedProducts.has(product.codigo_producto) ? 'default' : 'pointer',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase'
                            }}
                        >
                            {addedProducts.has(product.codigo_producto) ? '✓ ADDED' : 'ADD TO CART'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Ejemplo de productos mock para mostrar en la tabla
export const mockProducts = [
    { categoria: "Aluminum Containers", producto: "Food Tray Small", precio: 2.99 },
    { categoria: "Aluminum Containers", producto: "Food Tray Large", precio: 4.99 },
    { categoria: "Plastic Containers", producto: "Clear Container 16oz", precio: 2.79 },
    { categoria: "Plastic Containers", producto: "Black Container 24oz", precio: 3.29 },
    { categoria: "Paper Bags", producto: "Brown Paper Bag", precio: 0.89 },
    { categoria: "Paper Bags", producto: "White Paper Bag", precio: 1.29 },
    { categoria: "Accessories", producto: "Plastic Utensil Set", precio: 9.99 },
    { categoria: "Accessories", producto: "Paper Straws", precio: 6.49 }
];
