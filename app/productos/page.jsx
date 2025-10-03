"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';

export default function AllProductsPage() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [error, setError] = useState(null);
    const [addedProducts, setAddedProducts] = useState(new Set());
    const [searchInfo, setSearchInfo] = useState(null);

    useEffect(() => {
        loadProductsFromJSON();
    }, []);

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

            // Check search parameters
            const urlParams = new URLSearchParams(window.location.search);
            const searchTerm = urlParams.get('search');

            const response = await fetch('/productos.json');
            if (!response.ok) {
                throw new Error('Could not load productos.json');
            }

            let productos = await response.json();

            // Apply search filter if exists
            if (searchTerm) {
                productos = filterProductsBySearch(productos, searchTerm);
                setSearchInfo({
                    term: searchTerm,
                    count: productos.length
                });
            }

            // Agrupar productos por categoría
            const groupedProducts = productos.reduce((acc, producto) => {
                const categoria = producto.categoria;
                if (!acc[categoria]) {
                    acc[categoria] = [];
                }
                acc[categoria].push(producto);
                return acc;
            }, {});

            setProductsByCategory(groupedProducts);
            setTotalProducts(productos.length);
            setLoading(false);

            console.log(`✅ Products loaded: ${productos.length}`);

        } catch (error) {
            console.error('❌ Error loading products:', error);
            setError(error.message);
            setLoading(false);
        }
    }

    const handleAddToCart = (producto) => {
        addToCart(producto);
        setAddedProducts(prev => new Set([...prev, producto.id]));

        // Remover el estado después de 2 segundos
        setTimeout(() => {
            setAddedProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(producto.id);
                return newSet;
            });
        }, 2000);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    color: 'var(--pure-white)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.3)',
                    textAlign: 'center',
                    animation: 'pulse 2s infinite'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
                    <h2 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>Loading products...</h2>
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
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    color: 'var(--pure-white)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '3px solid var(--accent-yellow)',
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
                    }}>Error loading products</h2>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
            padding: 'clamp(12px, 3vw, 20px)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 clamp(12px, 3vw, 32px)'
            }}>
                {/* Header - Responsive */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: 'clamp(24px, 5vw, 40px)',
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    padding: 'clamp(20px, 5vw, 40px)',
                    borderRadius: 'clamp(12px, 2vw, 20px)',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(20px, 5vw, 36px)',
                        fontWeight: '800',
                        color: 'var(--pure-white)',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        lineHeight: 1.2
                    }}>
                        {searchInfo ? '🔍 Search Results' : '🌟 Complete Product Catalog'}
                    </h1>
                    
                    {searchInfo && (
                        <div style={{
                            background: 'var(--accent-yellow)',
                            color: 'var(--dark-black)',
                            padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                            borderRadius: 'clamp(6px, 1.5vw, 10px)',
                            margin: '16px auto',
                            maxWidth: '90%',
                            border: '2px solid var(--bright-yellow)'
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: 'clamp(12px, 3vw, 16px)',
                                fontWeight: '700'
                            }}>
                                🔍 "{searchInfo.term}": {searchInfo.count} products found
                            </p>
                        </div>
                    )}

                    <p style={{
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        color: 'var(--accent-yellow)',
                        margin: 0,
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}>
                        📦 {totalProducts} Premium Products Available
                    </p>
                </div>

                {/* Products by Category - Responsive */}
                {Object.entries(productsByCategory).map(([categoria, productos]) => (
                    <div key={categoria} style={{
                        marginBottom: 'clamp(30px, 6vw, 50px)',
                        background: 'var(--pure-white)',
                        borderRadius: 'clamp(12px, 2.5vw, 20px)',
                        padding: 'clamp(16px, 4vw, 30px)',
                        border: '3px solid var(--border-gray)',
                        boxShadow: '0 15px 35px rgba(30, 58, 138, 0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Category accent line */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)'
                        }}></div>

                        {/* Category Header - Responsive */}
                        <h2 style={{
                            fontSize: 'clamp(18px, 4vw, 28px)',
                            fontWeight: '800',
                            color: 'var(--dark-black)',
                            margin: '0 0 clamp(16px, 4vw, 30px) 0',
                            textTransform: 'uppercase',
                            letterSpacing: 'clamp(0.5px, 0.2vw, 1px)',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                            📂 {categoria}
                            <div style={{
                                width: 'clamp(40px, 8vw, 60px)',
                                height: '3px',
                                background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark-blue) 100%)',
                                borderRadius: '2px',
                                margin: 'clamp(8px, 2vw, 12px) auto 0 auto'
                            }}></div>
                        </h2>

                        {/* Products Grid - Responsive */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 30vw, 300px), 1fr))',
                            gap: 'clamp(12px, 3vw, 24px)'
                        }}>
                            {productos.map((producto) => (
                                <div key={`${categoria}-${producto.id || producto.codigo_producto || Math.random()}`} className="category-card">
                                    {/* Product image - Real images from JSON */}
                                    <div className="category-product-image" style={{
                                        background: 'var(--off-white)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid var(--accent-yellow)',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {producto.imagen_url ? (
                                            <Image
                                                src={`/${producto.imagen_url}`}
                                                alt={producto.nombre}
                                                width={200}
                                                height={150}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    background: 'var(--pure-white)',
                                                    padding: '8px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div style={{
                                            fontSize: '48px',
                                            color: 'var(--primary-blue)',
                                            display: producto.imagen_url ? 'none' : 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            height: '100%'
                                        }}>
                                            📦
                                        </div>
                                    </div>

                                    {/* Product details */}
                                    <h3 className="category-product-name" style={{
                                        color: 'var(--dark-black)',
                                        fontWeight: '700'
                                    }}>
                                        {producto.nombre}
                                    </h3>
                                    
                                    <p style={{
                                        fontSize: '14px',
                                        color: 'var(--light-black)',
                                        margin: '0 0 12px 0',
                                        lineHeight: '1.4',
                                        fontWeight: '500'
                                    }}>
                                        {producto.descripcion}
                                    </p>

                                    <div className="category-product-price" style={{
                                        color: 'var(--primary-blue)',
                                        background: 'var(--accent-yellow)',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        display: 'inline-block',
                                        border: '2px solid var(--bright-yellow)'
                                    }}>
                                        ${producto.precio}
                                    </div>

                                    {/* Add to cart button */}
                                    <button
                                        className="category-add-button"
                                        onClick={() => handleAddToCart(producto)}
                                        style={{
                                            background: addedProducts.has(producto.id) 
                                                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                                                : 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                                            color: 'var(--pure-white)',
                                            border: '2px solid var(--accent-yellow)',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!addedProducts.has(producto.id)) {
                                                e.target.style.background = 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)';
                                                e.target.style.color = 'var(--dark-black)';
                                            }
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 8px 20px rgba(30, 58, 138, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = addedProducts.has(producto.id) 
                                                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                                                : 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)';
                                            e.target.style.color = 'var(--pure-white)';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        {addedProducts.has(producto.id) ? '✅ Added!' : '🛒 Add to Cart'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* No products message */}
                {totalProducts === 0 && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 40px',
                        background: 'var(--pure-white)',
                        borderRadius: '20px',
                        border: '3px solid var(--border-gray)',
                        boxShadow: '0 15px 35px rgba(30, 58, 138, 0.1)'
                    }}>
                        <div style={{
                            fontSize: '80px',
                            marginBottom: '24px'
                        }}>📦</div>
                        <h3 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            color: 'var(--dark-black)',
                            margin: '0 0 16px 0',
                            textTransform: 'uppercase'
                        }}>
                            No products found
                        </h3>
                        <p style={{
                            fontSize: '18px',
                            color: 'var(--light-black)',
                            margin: 0,
                            fontWeight: '500'
                        }}>
                            {searchInfo 
                                ? `No products found for "${searchInfo.term}". Try another search term.`
                                : 'Please come back later to see available products.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
