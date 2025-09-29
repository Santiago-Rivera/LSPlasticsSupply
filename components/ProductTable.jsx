"use client";

export default function ProductTable({ products }) {
    if (!products || products.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <p>No hay productos para mostrar</p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        }}>
            <div style={{
                overflowX: 'auto'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                }}>
                    <thead>
                        <tr style={{
                            backgroundColor: '#4a5568',
                            color: 'white'
                        }}>
                            <th style={{
                                padding: '16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}>
                                CATEGORÍA
                            </th>
                            <th style={{
                                padding: '16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}>
                                PRODUCTO
                            </th>
                            <th style={{
                                padding: '16px',
                                textAlign: 'right',
                                fontWeight: '600',
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}>
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
                                <td style={{
                                    padding: '16px',
                                    borderBottom: '1px solid #e9ecef'
                                }}>
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
            
            {/* Footer with product count */}
            <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e9ecef',
                textAlign: 'center'
            }}>
                <span style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500'
                }}>
                    📊 Total de productos: {products.length}
                </span>
            </div>
        </div>
    );
}

// Ejemplo de productos mock para mostrar en la tabla
export const mockProducts = [
    { categoria: "Aluminum Containers", producto: "Food Tray Small", precio: 2.99 },
    { categoria: "Aluminum Containers", producto: "Food Tray Large", precio: 4.99 },
    { categoria: "Plastic Containers", producto: "Clear Container 16oz", precio: 2.79 },
    { categoria: "Plastic Containers", producto: "Black Container 24oz", precio: 3.29 },
    { categoria: "Paper Bags", producto: "Brown Paper Bag", precio: 0.89 },
    { categoria: "Paper Bags", producto: "White Paper Bag", precio: 1.29 },
    { categoria: "Accessories", producto: "Plastic Utensil Set", precio: 9.99 },
    { categoria: "Accessories", producto: "Paper Straws", precio: 6.49 }
];
