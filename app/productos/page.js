"use client";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useCart } from '../../contexts/CartContext';

// Componente separado para manejar los parámetros de búsqueda
function ProductsContent() {
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [error, setError] = useState(null);
    const [addedProducts, setAddedProducts] = useState(new Set());
    const [searchInfo, setSearchInfo] = useState(null);

    // Función para filtrar productos por búsqueda
    const filterProductsBySearch = useCallback((productos, searchTerm) => {
        if (!searchTerm) return productos;

        const lowercaseSearch = searchTerm.toLowerCase();
        return productos.filter(producto =>
            producto.nombre.toLowerCase().includes(lowercaseSearch) ||
            producto.descripcion.toLowerCase().includes(lowercaseSearch) ||
            producto.categoria.toLowerCase().includes(lowercaseSearch) ||
            producto.codigo_producto.toLowerCase().includes(lowercaseSearch)
        );
    }, []);

    // Función optimizada para carga masiva de productos con cache
    const loadProductsFromJSON = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📁 Loading all products from productos.json...');

            // Check search parameters using Next.js hook
            const searchTerm = searchParams.get('search');

            const response = await fetch('/productos.json');
            if (!response.ok) {
                throw new Error('Could not load productos.json');
            }

            let productos = await response.json();

            // Apply search filter if present
            if (searchTerm) {
                const originalCount = productos.length;
                productos = filterProductsBySearch(productos, searchTerm);
                setSearchInfo({
                    term: searchTerm,
                    results: productos.length,
                    total: originalCount
                });
                console.log(`🔍 Search "${searchTerm}": ${productos.length}/${originalCount} products found`);
            }

            // Group products by category
            const grouped = productos.reduce((acc, producto) => {
                const category = producto.categoria;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(producto);
                return acc;
            }, {});

            setProductsByCategory(grouped);
            setTotalProducts(productos.length);
            setLoading(false);

            console.log(`✅ Products loaded: ${productos.length} total, ${Object.keys(grouped).length} categories`);

        } catch (error) {
            console.error('❌ Error loading products:', error);
            setError(error.message);
            setLoading(false);
        }
    }, [searchParams, filterProductsBySearch]);

    useEffect(() => {
        loadProductsFromJSON();
    }, [loadProductsFromJSON]);

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

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '3px solid #fbbf24',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.3)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
                    <h2 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>Loading Products...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    color: '#ffffff',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '3px solid #fbbf24',
                    boxShadow: '0 20px 40px rgba(220, 38, 38, 0.3)',
                    textAlign: 'center',
                    maxWidth: '600px'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
                    <h2 style={{
                        margin: '0 0 16px 0',
                        fontSize: '28px',
                        fontWeight: '800',
                        textTransform: 'uppercase'
                    }}>Error Loading Products</h2>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            padding: 'clamp(12px, 3vw, 20px)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 clamp(12px, 2vw, 32px)'
            }}>
                {/* Header with search info */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: 'clamp(24px, 5vw, 40px)',
                    background: searchInfo ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    padding: 'clamp(20px, 5vw, 50px)',
                    borderRadius: 'clamp(12px, 2.5vw, 20px)',
                    border: '3px solid #fbbf24',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 'clamp(4px, 1vw, 6px)',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                    }}></div>

                    <h1 style={{
                        fontSize: 'clamp(24px, 6vw, 48px)',
                        fontWeight: '900',
                        color: '#ffffff',
                        margin: '0 0 clamp(12px, 3vw, 24px) 0',
                        textTransform: 'uppercase',
                        letterSpacing: 'clamp(1px, 0.3vw, 3px)',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        lineHeight: '1.1'
                    }}>
                        {searchInfo ? '🔍 Search Results' : '🛍️ All Products'}
                    </h1>

                    {searchInfo ? (
                        <div style={{
                            fontSize: 'clamp(16px, 4vw, 20px)',
                            color: '#ffffff',
                            fontWeight: '600',
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            Found {searchInfo.results} products for &quot;{searchInfo.term}&quot;
                            <br />
                            <span style={{ fontSize: 'clamp(14px, 3vw, 16px)', opacity: 0.9 }}>
                                ({searchInfo.results} of {searchInfo.total} total products)
                            </span>
                        </div>
                    ) : (
                        <div style={{
                            fontSize: 'clamp(16px, 4vw, 20px)',
                            color: '#ffffff',
                            fontWeight: '600',
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            Discover our complete catalog of {totalProducts} premium plastic products
                            <br />
                            <span style={{ fontSize: 'clamp(14px, 3vw, 16px)', opacity: 0.9 }}>
                                Organized by {Object.keys(productsByCategory).length} categories for easy browsing
                            </span>
                        </div>
                    )}
                </div>

                {/* Categories and Products */}
                {Object.keys(productsByCategory).length === 0 ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '40vh',
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)',
                        borderRadius: '20px',
                        border: '2px solid #e5e7eb',
                        padding: '40px'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            color: '#6b7280'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 12px 0' }}>
                                {searchInfo ? 'No products found' : 'No products available'}
                            </h3>
                            <p style={{ fontSize: '16px', margin: 0 }}>
                                {searchInfo ? 
                                    `Try adjusting your search term &quot;${searchInfo.term}&quot;` :
                                    'Please check back later or contact support'
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    Object.entries(productsByCategory).map(([category, products]) => (
                        <div key={category} style={{ marginBottom: 'clamp(40px, 8vw, 80px)' }}>
                            {/* Category Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                padding: 'clamp(16px, 4vw, 32px)',
                                borderRadius: 'clamp(12px, 2vw, 16px)',
                                marginBottom: 'clamp(20px, 4vw, 32px)',
                                border: '2px solid #fbbf24',
                                boxShadow: '0 8px 25px rgba(5, 150, 105, 0.2)'
                            }}>
                                <h2 style={{
                                    fontSize: 'clamp(20px, 5vw, 36px)',
                                    fontWeight: '800',
                                    color: '#ffffff',
                                    margin: '0 0 clamp(8px, 2vw, 16px) 0',
                                    textTransform: 'uppercase',
                                    letterSpacing: 'clamp(0.5px, 0.2vw, 2px)',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                }}>
                                    📦 {category}
                                </h2>
                                <p style={{
                                    fontSize: 'clamp(14px, 3vw, 18px)',
                                    color: '#ffffff',
                                    margin: 0,
                                    fontWeight: '600',
                                    opacity: 0.95
                                }}>
                                    {products.length} product{products.length !== 1 ? 's' : ''} available
                                </p>
                            </div>

                            {/* Products Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 25vw, 350px), 1fr))',
                                gap: 'clamp(16px, 3vw, 32px)',
                                padding: '0 clamp(8px, 2vw, 16px)'
                            }}>
                                {products.map((product) => (
                                    <div
                                        key={product.codigo_producto}
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: 'clamp(12px, 2vw, 20px)',
                                            padding: 'clamp(16px, 3vw, 24px)',
                                            border: '2px solid #e5e7eb',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 58, 138, 0.15)';
                                            e.currentTarget.style.borderColor = '#3b82f6';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: 'clamp(200px, 20vw, 280px)',
                                            marginBottom: 'clamp(12px, 2vw, 20px)',
                                            borderRadius: 'clamp(8px, 1.5vw, 12px)',
                                            overflow: 'hidden',
                                            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Image
                                                src={`/images/productos/${product.imagen}`}
                                                alt={product.nombre}
                                                fill
                                                style={{
                                                    objectFit: 'contain',
                                                    padding: '8px'
                                                }}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={false}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                fontSize: 'clamp(16px, 3vw, 20px)',
                                                fontWeight: '700',
                                                color: '#1f2937',
                                                margin: '0 0 clamp(8px, 1.5vw, 12px) 0',
                                                lineHeight: '1.3'
                                            }}>
                                                {product.nombre}
                                            </h3>

                                            <p style={{
                                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                                color: '#6b7280',
                                                margin: '0 0 clamp(8px, 1.5vw, 12px) 0',
                                                fontWeight: '500'
                                            }}>
                                                Code: {product.codigo_producto}
                                            </p>

                                            <p style={{
                                                fontSize: 'clamp(14px, 2.8vw, 16px)',
                                                color: '#4b5563',
                                                margin: '0 0 clamp(12px, 2vw, 20px) 0',
                                                lineHeight: '1.4'
                                            }}>
                                                {product.descripcion}
                                            </p>

                                            {/* Price and Add to Cart */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: 'auto'
                                            }}>
                                                <div style={{
                                                    fontSize: 'clamp(18px, 4vw, 24px)',
                                                    fontWeight: '800',
                                                    color: '#059669',
                                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                                }}>
                                                    ${parseFloat(product.precio).toFixed(2)}
                                                </div>

                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={addedProducts.has(product.codigo_producto)}
                                                    style={{
                                                        background: addedProducts.has(product.codigo_producto) 
                                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                            : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                                                        color: '#ffffff',
                                                        border: 'none',
                                                        padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                                                        borderRadius: 'clamp(6px, 1.5vw, 10px)',
                                                        fontSize: 'clamp(12px, 2.5vw, 16px)',
                                                        fontWeight: '700',
                                                        cursor: addedProducts.has(product.codigo_producto) ? 'default' : 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!addedProducts.has(product.codigo_producto)) {
                                                            e.target.style.transform = 'translateY(-2px)';
                                                            e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                                                    }}
                                                >
                                                    {addedProducts.has(product.codigo_producto) ? '✓ Added' : '🛒 Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Componente principal con Suspense boundary
export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '3px solid #fbbf24',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Loading Products...</h2>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
