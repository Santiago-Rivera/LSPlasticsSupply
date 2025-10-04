"use client";
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useCart } from '../../contexts/CartContext';

// Componente separado para manejar los parámetros de búsqueda
function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [error, setError] = useState(null);
    const [addedProducts, setAddedProducts] = useState(new Set());
    const [searchInfo, setSearchInfo] = useState(null);

    useEffect(() => {
        loadProductsFromJSON();
    }, [searchParams]);

    // Función para filtrar productos por búsqueda
    const filterProductsBySearch = (productos, searchTerm) => {
        if (!searchTerm) return productos;

        const lowercaseSearch = searchTerm.toLowerCase();
        return productos.filter(producto =>
            producto.nombre.toLowerCase().includes(lowercaseSearch) ||
            producto.descripcion.toLowerCase().includes(lowercaseSearch) ||
            producto.categoria.toLowerCase().includes(lowercaseSearch) ||
            producto.codigo_producto.toLowerCase().includes(lowercaseSearch)
        );
    };

    // Función optimizada para carga masiva de productos con cache
    async function loadProductsFromJSON() {
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
    }

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

                    <div style={{
                        fontSize: 'clamp(40px, 8vw, 64px)',
                        marginBottom: 'clamp(16px, 3vw, 20px)'
                    }}>
                        {searchInfo ? '🔍' : '📦'}
                    </div>

                    {searchInfo ? (
                        <>
                            <h1 style={{
                                fontSize: 'clamp(24px, 6vw, 36px)',
                                fontWeight: '800',
                                color: '#ffffff',
                                margin: '0 0 16px 0',
                                textTransform: 'uppercase',
                                letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                                Search Results
                            </h1>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                padding: 'clamp(12px, 3vw, 16px)',
                                borderRadius: '12px',
                                margin: '0 0 16px 0',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <p style={{
                                    fontSize: 'clamp(16px, 4vw, 20px)',
                                    color: '#fbbf24',
                                    margin: '0 0 8px 0',
                                    fontWeight: '700'
                                }}>
                                    "{searchInfo.term}"
                                </p>
                                <p style={{
                                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                                    color: '#ffffff',
                                    margin: 0,
                                    fontWeight: '600'
                                }}>
                                    {searchInfo.results} products found
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 style={{
                                fontSize: 'clamp(24px, 6vw, 36px)',
                                fontWeight: '800',
                                color: '#ffffff',
                                margin: '0 0 16px 0',
                                textTransform: 'uppercase',
                                letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                                All Products
                            </h1>
                            <p style={{
                                fontSize: 'clamp(14px, 3.5vw, 18px)',
                                color: '#fbbf24',
                                margin: 0,
                                fontWeight: '600'
                            }}>
                                {totalProducts} Premium Products Available
                            </p>
                        </>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div style={{
                    display: 'flex',
                    gap: 'clamp(12px, 3vw, 20px)',
                    marginBottom: 'clamp(24px, 5vw, 40px)',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => router.push('/tienda/categorias')}
                        style={{
                            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                            color: '#ffffff',
                            padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 24px)',
                            border: '2px solid #fbbf24',
                            borderRadius: 'clamp(8px, 1.5vw, 12px)',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase'
                        }}
                    >
                        📂 Browse Categories
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            color: '#111827',
                            padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 24px)',
                            border: '2px solid #f59e0b',
                            borderRadius: 'clamp(8px, 1.5vw, 12px)',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase'
                        }}
                    >
                        🏠 Back to Home
                    </button>
                </div>

                {/* Products by Category */}
                {Object.keys(productsByCategory).map((categoryName) => (
                    <div key={categoryName} style={{ marginBottom: 'clamp(40px, 8vw, 60px)' }}>
                        {/* Category Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                            padding: 'clamp(16px, 4vw, 24px)',
                            borderRadius: 'clamp(12px, 2.5vw, 16px)',
                            marginBottom: 'clamp(20px, 4vw, 30px)',
                            border: '2px solid #fbbf24'
                        }}>
                            <h2 style={{
                                fontSize: 'clamp(20px, 5vw, 28px)',
                                fontWeight: '700',
                                color: '#ffffff',
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                textAlign: 'center'
                            }}>
                                📦 {categoryName} ({productsByCategory[categoryName].length})
                            </h2>
                        </div>

                        {/* Products Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 30vw, 320px), 1fr))',
                            gap: 'clamp(20px, 4vw, 30px)'
                        }}>
                            {productsByCategory[categoryName].map((product) => (
                                <div
                                    key={product.codigo_producto}
                                    style={{
                                        background: '#ffffff',
                                        borderRadius: 'clamp(12px, 2.5vw, 20px)',
                                        padding: 'clamp(20px, 4vw, 24px)',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        border: '3px solid #e5e7eb',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Product accent line */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 'clamp(3px, 0.8vw, 4px)',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                                    }}></div>

                                    {/* Product Image */}
                                    <div style={{
                                        width: '100%',
                                        height: 'clamp(160px, 20vw, 200px)',
                                        position: 'relative',
                                        marginBottom: 'clamp(16px, 3vw, 20px)',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        background: '#f8fafc'
                                    }}>
                                        <Image
                                            src={product.imagen_url}
                                            alt={product.nombre}
                                            fill
                                            style={{
                                                objectFit: 'contain',
                                                padding: '8px'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <h3 style={{
                                        fontSize: 'clamp(16px, 4vw, 18px)',
                                        fontWeight: '700',
                                        color: '#1e3a8a',
                                        margin: '0 0 8px 0',
                                        lineHeight: 1.3
                                    }}>
                                        {product.nombre}
                                    </h3>

                                    <p style={{
                                        fontSize: 'clamp(12px, 3vw, 14px)',
                                        color: '#6b7280',
                                        lineHeight: 1.5,
                                        margin: '0 0 16px 0',
                                        fontWeight: '500'
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
                                        <span style={{
                                            fontSize: 'clamp(20px, 5vw, 24px)',
                                            fontWeight: '800',
                                            color: '#1e3a8a'
                                        }}>
                                            ${product.precio}
                                        </span>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={addedProducts.has(product.codigo_producto)}
                                            style={{
                                                background: addedProducts.has(product.codigo_producto)
                                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                    : 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                                                color: '#ffffff',
                                                border: 'none',
                                                padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)',
                                                borderRadius: 'clamp(8px, 1.5vw, 10px)',
                                                fontSize: 'clamp(12px, 3vw, 14px)',
                                                fontWeight: '600',
                                                cursor: addedProducts.has(product.codigo_producto) ? 'default' : 'pointer',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            {addedProducts.has(product.codigo_producto) ? '✓ ADDED' : '🛒 ADD TO CART'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* No Products Found */}
                {totalProducts === 0 && searchInfo && (
                    <div style={{
                        textAlign: 'center',
                        padding: 'clamp(40px, 8vw, 60px)',
                        background: '#ffffff',
                        borderRadius: 'clamp(12px, 2.5vw, 20px)',
                        border: '3px solid #fbbf24',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: 'clamp(60px, 12vw, 80px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                            🔍
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(24px, 6vw, 32px)',
                            fontWeight: '800',
                            color: '#1e3a8a',
                            margin: '0 0 16px 0',
                            textTransform: 'uppercase'
                        }}>
                            No Products Found
                        </h2>
                        <p style={{
                            fontSize: 'clamp(16px, 4vw, 18px)',
                            color: '#6b7280',
                            margin: '0 0 24px 0',
                            fontWeight: '500'
                        }}>
                            No products found for "{searchInfo.term}". Try another search term.
                        </p>
                        <button
                            onClick={() => router.push('/productos')}
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                                color: '#ffffff',
                                padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 24px)',
                                border: 'none',
                                borderRadius: 'clamp(8px, 1.5vw, 12px)',
                                fontSize: 'clamp(14px, 3.5vw, 16px)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Componente principal con Suspense boundary
export default function AllProductsPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '18px',
                color: '#6b7280'
            }}>
                Loading products...
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
