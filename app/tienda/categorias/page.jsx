"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function CategoriasPage() {
    const router = useRouter();
    const [categories, setCategories] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [windowWidth, setWindowWidth] = useState(768);

    useEffect(() => {
        loadCategoriesFromJSON();

        // Handle window resize
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                setWindowWidth(window.innerWidth);
            }
        };

        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
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
                        icon: getCategoryIcon(categoryName),
                        description: getCategoryDescription(categoryName),
                        count: 0,
                        featuredImage: null
                    });
                }
                
                const category = categoryMap.get(categoryId);
                category.products.push(product);
                category.count++;

                // Usar la imagen del primer producto como imagen destacada de la categoría
                if (!category.featuredImage) {
                    category.featuredImage = product.imagen_url;
                }
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
        // Mapeo específico para categorías conocidas
        const specificMappings = {
            'Souffle Cups & Lids': 'souffle-cups-lids',
            'Aluminum Containers': 'aluminum-containers',
            'Plastic Containers (Microwave)': 'plastic-containers-microwave',
            'Plastic Containers': 'plastic-containers',
            'Paper Bags': 'paper-bags',
            'Napkins & Paper Towels': 'napkins-paper-towels',
            'Soup Containers': 'soup-containers',
            'Accessories': 'accessories',
            'Disposable Containers (Boxes)': 'disposable-containers',
            'Coffee Cups & Lids': 'coffee-cups-lids',
            'Cold Cups & Lids': 'cold-cups-lids',
            'Cutlery & Accessories': 'cutlery-accessories',
            'Straws': 'straws',
            'Miscellaneous': 'miscellaneous'
        };

        // Si hay un mapeo específico, usarlo
        if (specificMappings[name]) {
            return specificMappings[name];
        }

        // Función genérica para otros casos
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, ''); // Limpiar guiones al inicio y final
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
        if (name.includes('soufflé') || name.includes('souffle') || name.includes('cups') || name.includes('lids')) return '🥤';
        if (name.includes('coffee')) return '☕';
        if (name.includes('cold')) return '🧊';
        if (name.includes('cutlery')) return '🍴';
        if (name.includes('straw')) return '🥤';
        return '📦';
    }

    // Obtener descripción para categoría
    function getCategoryDescription(categoryName) {
        const descriptions = {
            'Aluminum Containers': 'Durable aluminum containers for food storage and takeout',
            'Plastic Containers (Microwave)': 'Microwave-safe plastic containers for reheating',
            'Plastic Containers': 'Versatile plastic containers for food storage',
            'Paper Bags': 'Eco-friendly paper bags for packaging',
            'Napkins & Paper Towels': 'Essential paper products for dining',
            'Soup Containers': 'Leak-proof containers perfect for liquids',
            'Accessories': 'Additional items to complete your setup',
            'Disposable Containers (Boxes)': 'Convenient disposable food boxes',
            'Souffle Cups & Lids': 'Small portion containers with matching lids',
            'Coffee Cups & Lids': 'Hot beverage cups with secure lids',
            'Cold Cups & Lids': 'Clear cups perfect for cold beverages',
            'Cutlery & Accessories': 'Disposable utensils and serving accessories',
            'Straws': 'Drinking straws in various sizes',
            'Miscellaneous': 'Other useful food service items'
        };

        return descriptions[categoryName] || 'Quality food service products';
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
                        marginBottom: 'clamp(16px, 3vw, 20px)'
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
                            onClick={() => handleCategoryClick(category)}
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

                            {/* Category Image + Icon - Real Product Image with Emoji */}
                            <div style={{
                                width: '100%',
                                height: 'clamp(150px, 20vw, 200px)',
                                position: 'relative',
                                marginBottom: 'clamp(16px, 3vw, 20px)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                background: 'var(--off-white)',
                                border: '2px solid var(--accent-yellow)'
                            }}>
                                <Image
                                    src={`/${category.featuredImage}`}
                                    alt={`${category.name} - Featured Product`}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                        padding: '12px'
                                    }}
                                    onError={(e) => {
                                        console.log('Image failed to load:', category.featuredImage);
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
                                    fontSize: 'clamp(40px, 10vw, 64px)',
                                    color: 'var(--primary-blue)'
                                }}>
                                    {category.icon}
                                </div>

                                {/* Category Emoji Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'rgba(251, 191, 36, 0.9)',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    border: '2px solid var(--pure-white)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                }}>
                                    {category.icon}
                                </div>
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
                    gridTemplateColumns: windowWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
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
};
