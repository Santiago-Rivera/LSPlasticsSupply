"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '../../../../contexts/CartContext';
import Image from 'next/image';

export default function DynamicCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedProducts, setAddedProducts] = useState(new Set());

    const categorySlug = params.categoria;

    // Función para obtener icono de categoría
    const getCategoryIcon = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('aluminum') || name.includes('aluminio')) return '🥄';
        if (name.includes('plastic') || name.includes('plástico') || name.includes('microondas')) return '🥡';
        if (name.includes('bag') || name.includes('bolsa') || name.includes('papel')) return '🛍️';
        if (name.includes('napkin') || name.includes('servilleta') || name.includes('toalla')) return '📋';
        if (name.includes('accessory') || name.includes('accesorio')) return '🔧';
        if (name.includes('soup') || name.includes('sopa')) return '🍲';
        if (name.includes('desechable') || name.includes('disposable') || name.includes('caja')) return '📦';
        return '📦';
    };

    useEffect(() => {
        if (categorySlug) {
            loadCategoryProducts();
        }
    }, [categorySlug]);

    async function loadCategoryProducts() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/productos.json');
            if (!response.ok) {
                throw new Error('Could not load productos.json');
            }

            const allProducts = await response.json();
            
            const categoryMappings = {
                'contenedores-de-aluminio': 'Aluminum Containers',
                'aluminum-containers': 'Aluminum Containers',
                'contenedores-desechables-cajas': 'Disposable Containers (Boxes)',
                'disposable-containers': 'Disposable Containers (Boxes)',
                'contenedores-para-sopa': 'Soup Containers',
                'soup-containers': 'Soup Containers',
                'contenedores-de-plastico-microondas': 'Plastic Containers (Microwave)',
                'plastic-containers': 'Plastic Containers (Microwave)',
                'bolsas-de-papel': 'Paper Bags',
                'paper-bags': 'Paper Bags',
                'servilletas-y-toallas-de-papel': 'Napkins & Paper Towels',
                'napkins-paper-towels': 'Napkins & Paper Towels',
                'accesorios': 'Accessories',
                'accessories': 'Accessories',
                'plastics': 'Plastics',
                'plastic': 'Plastics'
            };

            const mappedCategory = categoryMappings[categorySlug];
            let categoryProducts = [];

            if (mappedCategory) {
                categoryProducts = allProducts.filter(product =>
                    product.categoria === mappedCategory
                );
            } else {
                categoryProducts = allProducts.filter(product => {
                    const productSlug = product.categoria
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim();
                    
                    return productSlug === categorySlug || 
                           productSlug.includes(categorySlug) ||
                           categorySlug.includes(productSlug);
                });
            }

            setProducts(categoryProducts);

            if (categoryProducts.length > 0) {
                setCategoryInfo({
                    name: categoryProducts[0].categoria,
                    slug: categorySlug,
                    count: categoryProducts.length
                });
            }

            setLoading(false);

        } catch (error) {
            console.error('Error loading products:', error);
            setError(error.message);
            setLoading(false);
        }
    }

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProducts(prev => new Set([...prev, product.id]));

        setTimeout(() => {
            setAddedProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
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
                    textAlign: 'center'
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
                    }}>Error</h2>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-page" style={{
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)'
        }}>
            {/* Category Header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                padding: '40px',
                borderRadius: '20px',
                border: '3px solid var(--accent-yellow)',
                boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
                marginBottom: '40px',
                textAlign: 'center'
            }}>
                <h1 className="category-title" style={{
                    color: 'var(--pure-white)',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    marginBottom: '16px'
                }}>
                    📂 {categoryInfo?.name || categorySlug}
                </h1>
                <p style={{
                    fontSize: '18px',
                    color: 'var(--accent-yellow)',
                    margin: 0,
                    fontWeight: '600',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                }}>
                    📦 {products.length} Products Available
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
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(17, 24, 39, 0.4)';
                    e.target.style.borderColor = 'var(--bright-yellow)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = 'var(--accent-yellow)';
                }}
            >
                ← Back to Categories
            </button>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="category-grid">
                    {products.map((product) => (
                        <div key={product.id || product.codigo_producto} className="category-card">
                            {/* Product image with real images */}
                            <div className="category-product-image" style={{
                                background: 'var(--off-white)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--accent-yellow)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {product.imagen_url ? (
                                    <Image
                                        src={`/${product.imagen_url}`}
                                        alt={product.nombre}
                                        width={250}
                                        height={180}
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
                                    display: product.imagen_url ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%'
                                }}>
                                    {getCategoryIcon(categoryInfo?.name || '')}
                                </div>
                            </div>

                            <h3 className="category-product-name">{product.nombre}</h3>
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--light-black)',
                                margin: '0 0 12px 0',
                                lineHeight: '1.4',
                                fontWeight: '500'
                            }}>
                                {product.descripcion}
                            </p>
                            <div className="category-product-price">${product.precio}</div>
                            <button
                                className="category-add-button"
                                onClick={() => handleAddToCart(product)}
                                style={{
                                    background: addedProducts.has(product.id || product.codigo_producto) 
                                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                                        : 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                                    color: 'var(--pure-white)',
                                    border: '2px solid var(--accent-yellow)',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {addedProducts.has(product.id || product.codigo_producto) ? '✅ Added!' : '🛒 Add to Cart'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 40px',
                    background: 'var(--pure-white)',
                    borderRadius: '20px',
                    border: '3px solid var(--border-gray)',
                    boxShadow: '0 15px 35px rgba(30, 58, 138, 0.1)'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '24px' }}>📦</div>
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
                        margin: '0 0 24px 0',
                        fontWeight: '500'
                    }}>
                        No products available in this category.
                    </p>
                    <button
                        onClick={() => router.push('/tienda/categorias')}
                        style={{
                            background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                            color: 'var(--pure-white)',
                            border: '2px solid var(--accent-yellow)',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 25px rgba(30, 58, 138, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        🔙 View All Categories
                    </button>
                </div>
            )}
        </div>
    );
}
