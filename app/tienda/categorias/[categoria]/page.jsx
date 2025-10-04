"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

const DynamicCategoryPage = () => {
    const router = useRouter();
    const params = useParams();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
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
        if (name.includes('soufflé') || name.includes('souffle') || name.includes('cups') || name.includes('lids')) return '🥤';
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
            
            // Debug logs
            console.log('Category slug:', categorySlug);
            console.log('All products loaded:', allProducts.length);

            const categoryMappings = {
                'contenedores-de-aluminio': 'Aluminum Containers',
                'aluminum-containers': 'Aluminum Containers',
                'contenedores-desechables-cajas': 'Disposable Containers (Boxes)',
                'disposable-containers': 'Disposable Containers (Boxes)',
                'contenedores-para-sopa': 'Soup Containers',
                'soup-containers': 'Soup Containers',
                'contenedores-de-plastico-microondas': 'Plastic Containers (Microwave)',
                'plastic-containers': 'Plastic Containers',
                'bolsas-de-papel': 'Paper Bags',
                'paper-bags': 'Paper Bags',
                'servilletas-y-toallas-de-papel': 'Napkins & Paper Towels',
                'napkins-paper-towels': 'Napkins & Paper Towels',
                'accesorios': 'Accessories',
                'accessories': 'Accessories',
                'souffle-cups-lids': 'Soufflé Cups & Lids'
            };

            const mappedCategory = categoryMappings[categorySlug];
            console.log('Mapped category:', mappedCategory);

            let categoryProducts;

            if (mappedCategory) {
                categoryProducts = allProducts.filter(product => {
                    console.log('Product category:', product.categoria, 'Mapped category:', mappedCategory);
                    return product.categoria === mappedCategory;
                });
                console.log('Found products with exact match:', categoryProducts.length);
            } else {
                // Búsqueda alternativa más flexible
                categoryProducts = allProducts.filter(product => {
                    const productSlug = product.categoria
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim();
                    
                    // Búsqueda directa por palabras clave para souffle
                    if (categorySlug === 'souffle-cups-lids') {
                        return product.categoria.toLowerCase().includes('soufflé') ||
                               product.categoria.toLowerCase().includes('souffle') ||
                               product.nombre.toLowerCase().includes('soufflé') ||
                               product.nombre.toLowerCase().includes('souffle');
                    }

                    return productSlug === categorySlug ||
                           productSlug.includes(categorySlug) ||
                           categorySlug.includes(productSlug);
                });
                console.log('Found products with alternative search:', categoryProducts.length);
            }

            console.log('Final products found:', categoryProducts.length);
            setProducts(categoryProducts);
            setLoading(false);

        } catch (error) {
            console.error('Error loading products:', error);
            setError(error.message);
            setLoading(false);
        }
    }

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProducts(prev => new Set([...prev, product.codigo_producto]));

        setTimeout(() => {
            setAddedProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.codigo_producto);
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
                    }}>Cargando categoría...</h2>
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

    const categoryName = products.length > 0 ? products[0].categoria : categorySlug.replace(/-/g, ' ');
    const categoryIcon = getCategoryIcon(categoryName);

    return (
        <div className="category-page" style={{
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
            minHeight: '100vh',
            padding: '20px'
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
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)'
                }}></div>

                <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                    {categoryIcon}
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
                    {categoryName}
                </h1>

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
                    marginBottom: '30px'
                }}
            >
                ← VOLVER A CATEGORÍAS
            </button>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '30px',
                    padding: '20px 0'
                }}>
                    {products.map((product) => (
                        <div
                            key={product.codigo_producto}
                            style={{
                                background: 'var(--pure-white)',
                                borderRadius: '20px',
                                border: '3px solid var(--accent-yellow)',
                                padding: '24px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '200px',
                                position: 'relative',
                                marginBottom: '20px',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                background: 'var(--off-white)'
                            }}>
                                <Image
                                    src={product.imagen_url}
                                    alt={product.nombre}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                        padding: '10px'
                                    }}
                                />
                            </div>

                            <h3 style={{
                                color: 'var(--primary-dark-blue)',
                                fontSize: '20px',
                                fontWeight: '700',
                                margin: '0 0 12px 0'
                            }}>
                                {product.nombre}
                            </h3>

                            <p style={{
                                color: 'var(--light-black)',
                                fontSize: '14px',
                                margin: '0 0 20px 0'
                            }}>
                                {product.descripcion}
                            </p>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
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
                                        padding: '12px 20px',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: addedProducts.has(product.codigo_producto) ? 'default' : 'pointer'
                                    }}
                                >
                                    {addedProducts.has(product.codigo_producto) ? '🛒 AGREGADO' : '🛒 ADD TO CART'}
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
                        margin: '0 0 30px 0'
                    }}>
                        No hay productos disponibles en esta categoría.
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
                            cursor: 'pointer'
                        }}
                    >
                        ← VER TODAS LAS CATEGORÍAS
                    </button>
                </div>
            )}
        </div>
    );
};

export default DynamicCategoryPage;
