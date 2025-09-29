"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import CartNotification from './CartNotification';

export default function CategoryPage({ categoryName, categoryTitle, categoryDescription, categoryIcon }) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAvailable, setTotalAvailable] = useState(0);
    const [addedProducts, setAddedProducts] = useState(new Set());
    const [showNotification, setShowNotification] = useState(false);
    const [lastAddedProduct, setLastAddedProduct] = useState('');

    const handleAddToCart = (product) => {
        // Asegurar que el producto tenga un ID único
        const productWithId = {
            ...product,
            id: product.codigo_producto || product.nombre,
            stock: product.stock || 100 // Valor por defecto si no existe
        };

        addToCart(productWithId);
        setAddedProducts(prev => new Set(prev).add(product.codigo_producto || product.nombre));
        setLastAddedProduct(product.nombre);
        setShowNotification(true);
    };

    useEffect(() => {
        loadProductsFromJSON();
    }, [categoryName]);

    async function loadProductsFromJSON() {
        try {
            setLoading(true);
            setError(null);

            console.log('📁 Cargando productos desde JSON para:', categoryName);

            // Cargar el archivo productos.json
            const response = await fetch('/productos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo productos.json');
            }

            const allProducts = await response.json();
            console.log('📦 Total productos en JSON:', allProducts.length);

            // Crear un mapa de equivalencias entre nombres en inglés y español
            const categoryMap = {
                'Aluminum Containers': ['Contenedores de Aluminio', 'Aluminum Containers'],
                'Plastic Containers': ['Contenedores de Plástico', 'Plastic Containers'],
                'Paper Bags': ['Bolsas de Papel', 'Paper Bags'],
                'Accessories': ['Accesorios', 'Accessories'],
                'Disposable Containers': ['Contenedores Desechables', 'Disposable Containers'],
                'Soup Containers': ['Contenedores de Sopa', 'Soup Containers'],
                'Napkins and Paper Towels': ['Servilletas y Toallas de Papel', 'Napkins and Paper Towels']
            };

            // Filtrar productos que pertenecen a esta categoría usando bucle
            const categoryProducts = [];
            const possibleNames = categoryMap[categoryName] || [categoryName];

            for (let i = 0; i < allProducts.length; i++) {
                const product = allProducts[i];

                // Verificar si el producto pertenece a esta categoría
                for (let j = 0; j < possibleNames.length; j++) {
                    if (product.categoria === possibleNames[j] ||
                        product.categoria.toLowerCase() === possibleNames[j].toLowerCase()) {
                        categoryProducts.push(product);
                        break; // Salir del bucle interno una vez encontrada la coincidencia
                    }
                }
            }

            console.log(`✅ Productos encontrados para ${categoryName}:`, categoryProducts.length);
            console.log('🔍 Productos detalle:', categoryProducts);
            console.log('📋 Categorías disponibles en JSON:', [...new Set(allProducts.map(p => p.categoria))]);

            setProducts(categoryProducts);
            setTotalAvailable(allProducts.length);

        } catch (err) {
            console.error('❌ Error cargando productos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    textAlign: 'center',
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                        Cargando productos desde JSON...
                    </div>
                    <div style={{ fontSize: '14px', color: '#999' }}>
                        Categoría: {categoryName}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    maxWidth: '600px',
                    border: '2px solid #dc3545'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
                    <div style={{ fontSize: '18px', color: '#dc3545', marginBottom: '16px' }}>
                        Error al cargar productos
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                        No se pudo acceder al archivo productos.json
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        {error}
                    </div>
                    <button onClick={() => loadProductsFromJSON()} style={{
                        backgroundColor: '#4a5568',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>{categoryIcon}</div>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '16px',
                        letterSpacing: '-0.01em'
                    }}>
                        {categoryTitle}
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#666',
                        marginBottom: '24px',
                        maxWidth: '600px',
                        margin: '0 auto 24px'
                    }}>
                        {categoryDescription}
                    </p>
                </div>

                {/* Products Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px'
                }}>
                    {products.length === 0 ? (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '60px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>📦</div>
                            <h2 style={{ fontSize: '24px', color: '#666', marginBottom: '16px', fontWeight: 'bold' }}>
                                No hay productos en esta categoría
                            </h2>
                            <p style={{ fontSize: '16px', color: '#999', marginBottom: '24px' }}>
                                Categoría buscada: "{categoryName}"
                            </p>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                padding: '16px',
                                backgroundColor: '#e9ecef',
                                borderRadius: '8px',
                                margin: '0 auto 20px',
                                maxWidth: '500px',
                                textAlign: 'left'
                            }}>
                                <strong>💡 Información:</strong><br/>
                                • Total productos en JSON: {totalAvailable}<br/>
                                • Productos en "{categoryName}": {products.length}<br/>
                                • Archivo consultado: /productos.json
                            </div>
                            <button onClick={() => loadProductsFromJSON()} style={{
                                backgroundColor: '#4a5568',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}>
                                🔄 Recargar desde JSON
                            </button>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id || product.codigo_producto} style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '32px',
                                textAlign: 'center',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '1px solid #e9ecef'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                            }}>
                                {/* Product Image */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '200px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '12px',
                                    marginBottom: '24px'
                                }}>
                                    {product.imagen ? (
                                        <Image
                                            src={product.imagen}
                                            alt={product.nombre}
                                            width={180}
                                            height={150}
                                            style={{ objectFit: 'contain' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div style={{
                                        display: product.imagen ? 'none' : 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                        height: '100%',
                                        fontSize: '48px',
                                        color: '#666'
                                    }}>
                                        {categoryIcon}
                                    </div>
                                </div>

                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                    marginBottom: '16px'
                                }}>
                                    {product.nombre}
                                </h3>

                                <p style={{
                                    fontSize: '16px',
                                    color: '#666',
                                    lineHeight: '1.6',
                                    marginBottom: '20px'
                                }}>
                                    {product.descripcion}
                                </p>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '24px'
                                }}>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#28a745',
                                        fontWeight: '600',
                                        backgroundColor: '#d4edda',
                                        padding: '4px 12px',
                                        borderRadius: '20px'
                                    }}>
                                        ✓ Stock: {product.stock}
                                    </span>
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#2c3e50'
                                    }}>
                                        ${product.precio}
                                    </span>
                                </div>

                                <button style={{
                                    backgroundColor: '#4a5568',
                                    color: 'white',
                                    padding: '12px 32px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4a5568'}
                                onClick={() => {
                                    handleAddToCart(product);
                                }}>
                                    {addedProducts.has(product.id || product.codigo_producto) ? '✔ ADDED' : 'ADD TO CART'}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Back Navigation */}
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#4a5568',
                            padding: '12px 24px',
                            border: '2px solid #4a5568',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#4a5568';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#4a5568';
                        }}>
                        ← BACK TO CATEGORIES
                    </button>
                </div>
            </div>

            {/* Cart Notification */}
            {showNotification && (
                <CartNotification
                    productName={lastAddedProduct}
                    onClose={() => setShowNotification(false)}
                />
            )}
        </div>
    );
}
