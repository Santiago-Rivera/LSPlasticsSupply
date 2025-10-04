"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';

export default function CategoryPage({
    categoryName,
    categoryTitle,
    categoryDescription,
    categoryIcon,
    categorySlug
}) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedProducts, setAddedProducts] = useState(new Set());

    useEffect(() => {
        loadCategoryProducts();
    }, [categoryName, categorySlug]);

    async function loadCategoryProducts() {
        try {
            setLoading(true);
            setError(null);

            console.log(`📂 Loading products for category: ${categoryName || categorySlug}`);

            const response = await fetch('/productos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar productos.json');
            }

            const allProducts = await response.json();
            let categoryProducts = [];

            if (categoryName) {
                categoryProducts = allProducts.filter(product =>
                    product.categoria === categoryName ||
                    product.categoria.toLowerCase().includes(categoryName.toLowerCase())
                );
            } else if (categorySlug) {
                const categoryMappings = {
                    'aluminum-containers': 'Aluminum Containers',
                    'disposable-containers': 'Disposable Containers (Boxes)',
                    'soup-containers': 'Soup Containers',
                    'plastic-containers': 'Plastic Containers (Microwave)',
                    'paper-bags': 'Paper Bags',
                    'napkins-paper-towels': 'Napkins & Paper Towels',
                    'accessories': 'Accessories',
                    'souffle-cups-lids': 'Soufflé Cups & Lids',
                    'coffee-cups-lids': 'Coffee Cups & Lids',
                    'cold-cups-lids': 'Cold Cups & Lids',
                    'cutlery-accessories': 'Cutlery & Accessories',
                    'straws': 'Straws',
                    'miscellaneous': 'Miscellaneous'
                };

                const mappedCategory = categoryMappings[categorySlug];
                if (mappedCategory) {
                    categoryProducts = allProducts.filter(product =>
                        product.categoria === mappedCategory
                    );
                }
            }

            console.log(`✅ Found ${categoryProducts.length} products for ${categoryName || categorySlug}`);
            setProducts(categoryProducts);
            setLoading(false);

        } catch (error) {
            console.error('Error cargando productos:', error);
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
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                        {categoryIcon || '📦'}
                    </div>
                    <h2 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>Cargando {categoryTitle || categoryName}...</h2>
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
                    }}>Error</h2>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Category Header */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    padding: '50px 30px',
                    borderRadius: '20px',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
                    marginBottom: '40px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Header accent line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)'
                    }}></div>

                    <div style={{
                        fontSize: '64px',
                        marginBottom: '20px'
                    }}>
                        {categoryIcon || '📦'}
                    </div>
                    
                    <h1 style={{
                        color: 'var(--pure-white)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        marginBottom: '16px',
                        fontSize: '36px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        {categoryTitle || categoryName}
                    </h1>
                    
                    {categoryDescription && (
                        <p style={{
                            fontSize: '18px',
                            color: 'var(--accent-yellow)',
                            margin: '0 0 16px 0',
                            fontWeight: '600',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}>
                            {categoryDescription}
                        </p>
                    )}
                    
                    <p style={{
                        fontSize: '16px',
                        color: 'var(--pure-white)',
                        margin: 0,
                        fontWeight: '500',
                        opacity: 0.9
                    }}>
                        {products.length} Productos Disponibles
                    </p>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    style={{
                        background: 'linear-gradient(135deg, var(--light-black) 0%, var(--dark-black) 100%)',
                        color: 'var(--pure-white)',
                        border: '2px solid var(--accent-yellow)',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    ← VOLVER A CATEGORÍAS
                </button>

                {/* Products Grid */}
                {products.length > 0 ? (
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
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    margin: '0 0 8px 0',
                                    lineHeight: '1.3',
                                    textTransform: 'uppercase'
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

                                {/* Price and Add to Cart */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '16px'
                                }}>
                                    <span style={{
                                        fontSize: '24px',
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
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            cursor: addedProducts.has(product.codigo_producto) ? 'default' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            minWidth: '120px',
                                            justifyContent: 'center',
                                            textTransform: 'uppercase'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!addedProducts.has(product.codigo_producto)) {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.3)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!addedProducts.has(product.codigo_producto)) {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = 'none';
                                            }
                                        }}
                                    >
                                        {addedProducts.has(product.codigo_producto) ? (
                                            <>✓ ADDED</>
                                        ) : (
                                            <>🛒 ADD TO CART</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: 'var(--pure-white)',
                        borderRadius: '20px',
                        border: '3px solid var(--accent-yellow)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
                        <h2 style={{
                            color: 'var(--primary-dark-blue)',
                            fontSize: '28px',
                            fontWeight: '800',
                            margin: '0 0 16px 0',
                            textTransform: 'uppercase'
                        }}>NO SE ENCONTRARON PRODUCTOS</h2>
                        <p style={{
                            color: 'var(--light-black)',
                            fontSize: '16px',
                            margin: '0 0 30px 0',
                            fontWeight: '500'
                        }}>
                            No hay productos disponibles en la categoría "{categoryTitle || categoryName}".
                        </p>
                        <button
                            onClick={() => router.push('/tienda/categorias')}
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark-blue) 100%)',
                                color: 'var(--pure-white)',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            ← VER TODAS LAS CATEGORÍAS
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
