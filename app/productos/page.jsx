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

    useEffect(() => {
        loadProductsFromJSON();
    }, []);

    // Función optimizada para carga masiva de productos con cache
    async function loadProductsFromJSON() {
        try {
            setLoading(true);
            setError(null);

            console.log('📁 Cargando todos los productos desde productos.json...');

            // Verificar cache del navegador primero
            const cacheKey = 'productos_cache_v1';
            const cachedData = sessionStorage.getItem(cacheKey);
            const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);

            // Usar cache si es reciente (5 minutos)
            if (cachedData && cacheTimestamp &&
                (Date.now() - parseInt(cacheTimestamp)) < 300000) {
                console.log('📦 Usando productos desde cache del navegador');
                const productos = JSON.parse(cachedData);
                organizeProductsByCategory(productos);
                return;
            }

            // Cargar productos con optimizaciones para alta concurrencia
            const response = await fetch('/productos.json', {
                headers: {
                    'Cache-Control': 'public, max-age=300',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo productos.json');
            }

            const productos = await response.json();
            console.log('📦 Total productos cargados:', productos.length);

            // Guardar en cache del navegador
            sessionStorage.setItem(cacheKey, JSON.stringify(productos));
            sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

            organizeProductsByCategory(productos);

        } catch (err) {
            console.error('❌ Error al cargar productos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Función separada para organizar productos (optimizada)
    function organizeProductsByCategory(productos) {
        const productosPorCategoria = {};

        // Bucle optimizado para procesar cada producto
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            const categoria = producto.categoria;

            // Si la categoría no existe, crearla
            if (!productosPorCategoria[categoria]) {
                productosPorCategoria[categoria] = {
                    category: {
                        id: producto.categoria_id,
                        nombre: categoria
                    },
                    products: []
                };
            }

            // Agregar el producto a su categoría correspondiente
            productosPorCategoria[categoria].products.push(producto);
        }

        // Log para debugging - mostrar resumen por categoría
        console.log('📊 Resumen de productos por categoría:');
        for (const [categoria, data] of Object.entries(productosPorCategoria)) {
            console.log(`📂 ${categoria}: ${data.products.length} productos`);
        }

        setProductsByCategory(productosPorCategoria);
        setTotalProducts(productos.length);
    }

    const handleAddToCart = (product) => {
        // Asegurar que el producto tenga un ID único y los campos necesarios
        const productWithId = {
            ...product,
            id: product.codigo_producto || product.nombre,
            stock: product.stock || 100, // Valor por defecto si no existe
            codigo: product.codigo_producto // Para compatibilidad
        };

        addToCart(productWithId);
        setAddedProducts((prev) => new Set(prev).add(product.codigo_producto || product.nombre));
    };

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
                        Cargando catálogo desde JSON...
                    </div>
                    <div style={{ fontSize: '14px', color: '#999' }}>
                        Organizando productos por categorías
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

    const categoryCount = Object.keys(productsByCategory).length;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '60px'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛍️</div>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '16px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        letterSpacing: '-0.01em'
                    }}>
                        Catálogo Completo de Productos
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto',
                        marginBottom: '24px'
                    }}>
                        Productos cargados dinámicamente desde JSON y organizados automáticamente por categorías
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '12px 24px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                            <span style={{ fontSize: '14px', color: '#28a745', fontWeight: 'bold' }}>
                                📦 {totalProducts} Productos Totales
                            </span>
                        </div>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '12px 24px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                            <span style={{ fontSize: '14px', color: '#007bff', fontWeight: 'bold' }}>
                                🏷️ {categoryCount} Categorías
                            </span>
                        </div>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '12px 24px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                            <span style={{ fontSize: '14px', color: '#ffc107', fontWeight: 'bold' }}>
                                📄 Cargado desde JSON
                            </span>
                        </div>
                    </div>
                </div>

                {/* Products by Category */}
                {categoryCount === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 40px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>📦</div>
                        <h2 style={{ fontSize: '24px', color: '#666', marginBottom: '16px' }}>
                            No se encontraron productos
                        </h2>
                        <p style={{ fontSize: '16px', color: '#999', marginBottom: '32px' }}>
                            No se pudieron cargar productos desde el archivo JSON.
                        </p>
                        <button onClick={() => loadProductsFromJSON()} style={{
                            backgroundColor: '#4a5568',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}>
                            🔄 Recargar JSON
                        </button>
                    </div>
                ) : (
                    Object.entries(productsByCategory).map(([categoryName, categoryData]) => (
                        <div key={categoryName} style={{
                            marginBottom: '60px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden'
                        }}>
                            {/* Category Header */}
                            <div style={{
                                backgroundColor: '#4a5568',
                                color: 'white',
                                padding: '24px 32px',
                                borderBottom: '3px solid #2d3748'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '16px'
                                }}>
                                    <div>
                                        <h2 style={{
                                            fontSize: '28px',
                                            fontWeight: 'bold',
                                            margin: '0 0 8px 0'
                                        }}>
                                            📂 {categoryName}
                                        </h2>
                                        <p style={{
                                            fontSize: '14px',
                                            opacity: 0.9,
                                            margin: 0
                                        }}>
                                            ID de Categoría: {categoryData.category.id}
                                        </p>
                                    </div>
                                    <div style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        padding: '8px 16px',
                                        borderRadius: '20px'
                                    }}>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                            {categoryData.products.length} productos JSON
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div style={{
                                padding: '32px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '24px'
                            }}>
                                {categoryData.products.map((product, index) => (
                                    <div key={product.codigo_producto || index} style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        border: '1px solid #e9ecef',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                        {/* Product Image */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '120px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            marginBottom: '16px',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                fontSize: '32px',
                                                color: '#999'
                                            }}>
                                                📦
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div style={{ textAlign: 'center' }}>
                                            <h3 style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: '#2c3e50',
                                                marginBottom: '8px',
                                                lineHeight: '1.3'
                                            }}>
                                                {product.nombre}
                                            </h3>

                                            <p style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                lineHeight: '1.4',
                                                marginBottom: '12px'
                                            }}>
                                                {product.descripcion}
                                            </p>

                                            {/* Product Details */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: '#28a745',
                                                    fontWeight: '600',
                                                    backgroundColor: '#d4edda',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px'
                                                }}>
                                                    ✓ Disponible
                                                </span>
                                                <span style={{
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    color: '#2c3e50'
                                                }}>
                                                    ${product.precio}
                                                </span>
                                            </div>

                                            {/* JSON Data Display */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: '4px',
                                                marginBottom: '12px'
                                            }}>
                                                <div style={{
                                                    fontSize: '10px',
                                                    color: '#999',
                                                    backgroundColor: 'white',
                                                    padding: '3px 6px',
                                                    borderRadius: '4px',
                                                    fontFamily: 'monospace',
                                                    border: '1px solid #e9ecef'
                                                }}>
                                                    {product.codigo_producto}
                                                </div>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button onClick={() => handleAddToCart(product)} style={{
                                                marginTop: '12px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                padding: '10px 20px',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.3s ease',
                                                width: '100%'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#0056b3';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#007bff';
                                            }}>
                                                {addedProducts.has(product.codigo_producto) ? '✔ Agregado' : '➕ Agregar al Carrito'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                {/* JSON Source Info */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        📄 <strong>Fuente de datos:</strong> /productos.json
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                        Los productos se cargan dinámicamente y se organizan automáticamente por categorías usando bucles
                    </div>
                </div>

                {/* Back Navigation */}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#4a5568',
                            padding: '16px 32px',
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
                        ← VOLVER AL INICIO
                    </button>
                </div>
            </div>
        </div>
    );
}
