"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoriasPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategoriesFromJSON();
    }, []);

    // Load categories and products from JSON
    async function loadCategoriesFromJSON() {
        try {
            setLoading(true);
            setError(null);

            console.log('📂 Loading categories from productos.json...');

            const response = await fetch('/productos.json');
            if (!response.ok) {
                throw new Error('Could not load productos.json');
            }

            const products = await response.json();
            
            // Extraer categorías únicas del JSON
            const categoryMap = new Map();
            
            products.forEach(product => {
                const categoryId = product.categoria_id;
                const categoryName = product.categoria;
                
                if (!categoryMap.has(categoryId)) {
                    categoryMap.set(categoryId, {
                        id: categoryId,
                        name: categoryName,
                        slug: generateSlug(categoryName),
                        products: [],
                        icon: getCategoryIcon(categoryName)
                    });
                }
                
                categoryMap.get(categoryId).products.push(product);
            });

            const categoriesArray = Array.from(categoryMap.values());
            setCategories(categoriesArray);

            console.log(`✅ Categories loaded: ${categoriesArray.length}`);
            setLoading(false);

        } catch (error) {
            console.error('❌ Error loading categories:', error);
            setError(error.message);
            setLoading(false);
        }
    }

    // Generar slug URL-friendly
    function generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .trim('-');
    }

    // Obtener icono para categoría
    function getCategoryIcon(categoryName) {
        const name = categoryName.toLowerCase();
        if (name.includes('aluminum')) return '🥄';
        if (name.includes('plastic') || name.includes('container')) return '🥡';
        if (name.includes('bag') || name.includes('bolsa')) return '🛍️';
        if (name.includes('napkin') || name.includes('servilleta')) return '📋';
        if (name.includes('accessory') || name.includes('accesorio')) return '🔧';
        if (name.includes('soup') || name.includes('sopa')) return '🍲';
        return '📦';
    }

    // Manejar click en categoría
    const handleCategoryClick = (category) => {
        console.log(`🔗 Navegando a categoría: ${category.name} (${category.slug})`);
        router.push(`/tienda/categorias/${category.slug}`);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    color: 'var(--pure-white)',
                    padding: '24px 32px',
                    borderRadius: '16px',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 10px 30px rgba(30, 58, 138, 0.3)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '32px',
                        marginBottom: '16px'
                    }}>📦</div>
                    <p style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>Cargando categorías...</p>
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
                minHeight: '60vh',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    color: 'var(--pure-white)',
                    padding: '24px 32px',
                    borderRadius: '16px',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px'
                    }}>⚠️</div>
                    <h2 style={{
                        margin: '0 0 12px 0',
                        fontSize: '24px',
                        fontWeight: '800',
                        textTransform: 'uppercase'
                    }}>Error cargando categorías</h2>
                    <p style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '500'
                    }}>{error}</p>
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
                padding: '0 clamp(12px, 2vw, 32px)'
            }}>
                {/* Header - Responsive */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: 'clamp(24px, 5vw, 40px)',
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    padding: 'clamp(20px, 5vw, 50px)',
                    borderRadius: 'clamp(12px, 2.5vw, 20px)',
                    border: '3px solid var(--accent-yellow)',
                    boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Header accent line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 'clamp(4px, 1vw, 6px)',
                        background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)'
                    }}></div>

                    <div style={{
                        fontSize: 'clamp(40px, 8vw, 64px)',
                        marginBottom: 'clamp(16px, 3vw, 20px)',
                        animation: 'bounce 2s infinite'
                    }}>📂</div>

                    <h1 style={{
                        fontSize: 'clamp(24px, 6vw, 36px)',
                        fontWeight: '800',
                        color: 'var(--pure-white)',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        lineHeight: 1.2
                    }}>
                        Product Categories
                    </h1>

                    <p style={{
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        color: 'var(--accent-yellow)',
                        margin: 0,
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}>
                        🎯 Find exactly what you need
                    </p>
                </div>

                {/* Categories Grid - Enhanced Responsive */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fit, minmax(clamp(250px, 30vw, 300px), 1fr))`,
                    gap: 'clamp(16px, 4vw, 30px)',
                    marginBottom: 'clamp(24px, 5vw, 40px)'
                }}>
                    {categories.map((category) => (
                        <div
                            key={category.slug}
                            onClick={() => router.push(`/tienda/categorias/${category.slug}`)}
                            style={{
                                background: 'var(--pure-white)',
                                borderRadius: 'clamp(12px, 2.5vw, 20px)',
                                padding: 'clamp(20px, 4vw, 32px)',
                                textAlign: 'center',
                                boxShadow: '0 clamp(8px, 2vw, 15px) clamp(20px, 5vw, 35px) rgba(30, 58, 138, 0.1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: '3px solid var(--border-gray)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 clamp(20px, 5vw, 30px) clamp(40px, 10vw, 60px) rgba(30, 58, 138, 0.2)';
                                e.currentTarget.style.borderColor = 'var(--accent-yellow)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 clamp(8px, 2vw, 15px) clamp(20px, 5vw, 35px) rgba(30, 58, 138, 0.1)';
                                e.currentTarget.style.borderColor = 'var(--border-gray)';
                            }}
                        >
                            {/* Category accent line */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 'clamp(3px, 0.8vw, 5px)',
                                background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)',
                                transition: 'height 0.3s ease'
                            }}></div>

                            {/* Category Icon */}
                            <div style={{
                                fontSize: 'clamp(40px, 10vw, 64px)',
                                marginBottom: 'clamp(16px, 3vw, 24px)',
                                color: 'var(--primary-blue)',
                                transition: 'all 0.3s ease'
                            }}>
                                {category.icon}
                            </div>

                            {/* Category Name */}
                            <h3 style={{
                                fontSize: 'clamp(16px, 4vw, 20px)',
                                fontWeight: '700',
                                color: 'var(--dark-black)',
                                margin: '0 0 clamp(12px, 3vw, 16px) 0',
                                textTransform: 'uppercase',
                                letterSpacing: 'clamp(0.3px, 0.2vw, 0.5px)',
                                lineHeight: 1.3
                            }}>
                                {category.name}
                            </h3>

                            {/* Category Description */}
                            <p style={{
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                color: 'var(--light-black)',
                                lineHeight: 1.5,
                                margin: '0 0 clamp(16px, 4vw, 20px) 0',
                                fontWeight: '500'
                            }}>
                                {category.description}
                            </p>

                            {/* Product Count Badge */}
                            <div style={{
                                background: 'var(--accent-yellow)',
                                color: 'var(--dark-black)',
                                padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                fontWeight: '700',
                                display: 'inline-block',
                                border: '2px solid var(--bright-yellow)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                📦 {category.count} products
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons - Responsive */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'clamp(12px, 3vw, 20px)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <button
                        onClick={() => router.push('/productos')}
                        style={{
                            background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                            color: 'var(--pure-white)',
                            padding: 'clamp(14px, 3.5vw, 18px) clamp(20px, 5vw, 32px)',
                            border: '3px solid var(--accent-yellow)',
                            borderRadius: 'clamp(8px, 1.5vw, 12px)',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: 'clamp(0.3px, 0.2vw, 0.5px)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'clamp(6px, 1.5vw, 8px)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 15px 30px rgba(30, 58, 138, 0.4)';
                            e.target.style.borderColor = 'var(--bright-yellow)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = 'var(--accent-yellow)';
                        }}
                    >
                        📦 View All Products
                    </button>

                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)',
                            color: 'var(--dark-black)',
                            padding: 'clamp(14px, 3.5vw, 18px) clamp(20px, 5vw, 32px)',
                            border: '3px solid var(--bright-yellow)',
                            borderRadius: 'clamp(8px, 1.5vw, 12px)',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: 'clamp(0.3px, 0.2vw, 0.5px)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'clamp(6px, 1.5vw, 8px)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, var(--bright-yellow) 0%, var(--accent-yellow) 100%)';
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 15px 30px rgba(251, 191, 36, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        🏠 Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}