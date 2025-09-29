"use client";
import Link from "next/link";
import { useState } from "react";

export default function TiendaPage() {
    const [cartItems, setCartItems] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            padding: '60px 40px'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        margin: '0 0 16px 0',
                        lineHeight: '1.2',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        letterSpacing: '-0.02em'
                    }}>
                        TU CARRITO ESTÁ VACÍO
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        color: '#666',
                        lineHeight: '1.6',
                        margin: '0 0 40px 0'
                    }}>
                        Una vez que añadas algo a tu carrito, aparecerá aquí. ¿Listo para empezar?
                    </p>
                </div>

                {/* Empty Cart Content */}
                {cartItems.length === 0 && (
                    <div style={{
                        textAlign: 'left',
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <Link href="/tienda/categorias">
                            <button
                                style={{
                                    backgroundColor: isHovered ? 'transparent' : '#000',
                                    color: isHovered ? '#000' : 'white',
                                    padding: '16px 32px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    border: '2px solid #000',
                                    borderRadius: '0',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                type="button"
                            >
                                CONTINUAR COMPRANDO
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>
                                    →
                                </span>
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
