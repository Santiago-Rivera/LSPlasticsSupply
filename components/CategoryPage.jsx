"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';

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
    const [categoryInfo, setCategoryInfo] = useState(null);
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
                    'contenedores-de-aluminio': 'Contenedores de Aluminio',
                    'aluminum-containers': 'Contenedores de Aluminio',
                    'contenedores-desechables-cajas': 'Contenedores Desechables (Cajas)',
                    'disposable-containers': 'Contenedores Desechables (Cajas)',
                    'contenedores-para-sopa': 'Contenedores para Sopa',
                    'soup-containers': 'Contenedores para Sopa',
                    'contenedores-de-plastico-microondas': 'Contenedores de Plástico (Microondas)',
                    'plastic-containers': 'Contenedores de Plástico (Microondas)',
                    'bolsas-de-papel': 'Bolsas de Papel',
                    'paper-bags': 'Bolsas de Papel',
                    'servilletas-y-toallas-de-papel': 'Servilletas y Toallas de Papel',
                    'napkins-paper-towels': 'Servilletas y Toallas de Papel',
                    'accesorios': 'Accesorios',
                    'accessories': 'Accesorios',
                    'plastics': 'Plastics',
                    'plastic': 'Plastics'
                };

                const mappedCategory = categoryMappings[categorySlug];
                if (mappedCategory) {
                    categoryProducts = allProducts.filter(product =>
                        product.categoria === mappedCategory
                    );
                }
            }

            if (categoryProducts.length > 0) {
                setCategoryInfo({
                    name: categoryProducts[0].categoria,
                    count: categoryProducts.length
                });
            }

            setProducts(categoryProducts);
            setLoading(false);

        } catch (error) {
            console.error('Error cargando productos:', error);
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
        <div className="category-page" style={{
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)'
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
                
                <h1 className="category-title" style={{
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
                    📦 {products.length} Productos Disponibles
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
                ← Volver a Categorías
            </button>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="category-grid">
                    {products.map((product, index) => (
                        <div key={product.codigo_producto || product.id || `product-${index}`} className="category-card" style={{
                            background: 'var(--pure-white)',
                            border: '3px solid var(--border-gray)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
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
                            <div className="category-product-image" style={{
                                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--border-gray) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '48px',
                                color: 'var(--primary-blue)',
                                border: '2px solid var(--accent-yellow)'
                            }}>
                                {categoryIcon || '📦'}
                            </div>

                            {/* Product Name */}
                            <h3 className="category-product-name" style={{
                                color: 'var(--dark-black)',
                                fontWeight: '700'
                            }}>
                                {product.nombre}
                            </h3>

                            {/* Product Description */}
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--light-black)',
                                margin: '0 0 12px 0',
                                lineHeight: '1.4',
                                fontWeight: '500'
                            }}>
                                {product.descripcion}
                            </p>

                            {/* Product Code */}
                            <p style={{
                                fontSize: '12px',
                                color: 'var(--gray-text)',
                                margin: '0 0 12px 0',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                background: 'var(--off-white)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                display: 'inline-block'
                            }}>
                                📋 {product.codigo_producto}
                            </p>

                            {/* Product Price */}
                            <div className="category-product-price" style={{
                                color: 'var(--primary-blue)',
                                background: 'var(--accent-yellow)',
                                padding: '10px 16px',
                                borderRadius: '10px',
                                display: 'inline-block',
                                border: '2px solid var(--bright-yellow)',
                                fontWeight: '800',
                                marginBottom: '16px',
                                fontSize: '18px'
                            }}>
                                💰 ${product.precio}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                className="category-add-button"
                                onClick={() => handleAddToCart(product)}
                                style={{
                                    background: addedProducts.has(product.id) 
                                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                                        : 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                                    color: 'var(--pure-white)',
                                    border: '3px solid var(--accent-yellow)',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontSize: '14px',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    width: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!addedProducts.has(product.id)) {
                                        e.target.style.background = 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)';
                                        e.target.style.color = 'var(--dark-black)';
                                    }
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 10px 25px rgba(30, 58, 138, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = addedProducts.has(product.id) 
                                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                                        : 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)';
                                    e.target.style.color = 'var(--pure-white)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {addedProducts.has(product.id) ? '✅ ¡Agregado!' : '🛒 Agregar al Carrito'}
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
                    <div style={{ fontSize: '80px', marginBottom: '24px' }}>
                        {categoryIcon || '📦'}
                    </div>
                    <h3 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: 'var(--dark-black)',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase'
                    }}>
                        No se encontraron productos
                    </h3>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--light-black)',
                        margin: '0 0 24px 0',
                        fontWeight: '500'
                    }}>
                        No hay productos disponibles en la categoría "{categoryTitle || categoryName}".
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
                        🔙 Ver Todas las Categorías
                    </button>
                </div>
            )}
        </div>
    );
}
