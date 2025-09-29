"use client";
import { useEffect, useState } from 'react';

// Componente principal sin Supabase
export default function CatalogoPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProductsFromJSON();
    }, []);

    async function loadProductsFromJSON() {
        try {
            setLoading(true);

            // Cargar productos desde JSON
            const response = await fetch('/productos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar productos.json');
            }

            const productos = await response.json();

            // Formatear datos para la tabla usando bucle
            const formattedProducts = [];
            for (let i = 0; i < productos.length; i++) {
                const producto = productos[i];
                formattedProducts.push({
                    categoria: producto.categoria,
                    producto: producto.nombre,
                    precio: producto.precio,
                    codigo: producto.codigo,
                    stock: producto.stock
                });
            }

            setProducts(formattedProducts);
            setError(null);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                    <p>Cargando catálogo desde JSON...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <main style={{ padding: '20px' }}>
                <h1>Catálogo de Suministros Desechables</h1>
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '8px',
                    color: '#721c24'
                }}>
                    <strong>Error:</strong> {error}
                    <br />
                    <button
                        onClick={loadProductsFromJSON}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main style={{ padding: '20px' }}>
            <h1>Catálogo de Suministros Desechables</h1>
            <div style={{
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#d1ecf1',
                borderRadius: '8px',
                border: '1px solid #bee5eb'
            }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#0c5460' }}>
                    📄 Datos cargados dinámicamente desde /productos.json ({products.length} productos)
                </p>
            </div>

            {/* Product Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#4a5568', color: 'white' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                                    CATEGORÍA
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                                    PRODUCTO
                                </th>
                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
                                    CÓDIGO
                                </th>
                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
                                    STOCK
                                </th>
                                <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                                    PRECIO
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index} style={{
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white';
                                }}>
                                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                                        <span style={{
                                            backgroundColor: '#e8f4fd',
                                            color: '#1976d2',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            {product.categoria}
                                        </span>
                                    </td>
                                    <td style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e9ecef',
                                        fontWeight: '500',
                                        color: '#2c3e50'
                                    }}>
                                        {product.producto}
                                    </td>
                                    <td style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e9ecef',
                                        textAlign: 'center',
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                        color: '#666'
                                    }}>
                                        {product.codigo}
                                    </td>
                                    <td style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e9ecef',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#28a745'
                                    }}>
                                        {product.stock}
                                    </td>
                                    <td style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e9ecef',
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        color: '#28a745',
                                        fontSize: '16px'
                                    }}>
                                        ${parseFloat(product.precio || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e9ecef',
                    textAlign: 'center'
                }}>
                    <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                        📊 Total de productos cargados desde JSON: {products.length}
                    </span>
                </div>
            </div>
        </main>
    );
}
