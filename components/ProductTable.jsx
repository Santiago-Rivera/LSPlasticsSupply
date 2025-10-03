"use client";

export default function ProductTable({ products }) {
    if (!products || products.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                borderRadius: '16px',
                border: '3px solid var(--accent-yellow)',
                boxShadow: '0 10px 30px rgba(30, 58, 138, 0.1)'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                }}>📦</div>
                <p style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--light-black)'
                }}>No hay productos para mostrar</p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'var(--pure-white)',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(30, 58, 138, 0.15)',
            overflow: 'hidden',
            border: '2px solid var(--border-gray)'
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
                            background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                            color: 'var(--pure-white)'
                        }}>
                            <th style={{
                                padding: '20px',
                                textAlign: 'left',
                                fontWeight: '700',
                                fontSize: '14px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                borderBottom: '3px solid var(--accent-yellow)'
                            }}>
                                📂 CATEGORÍA
                            </th>
                            <th style={{
                                padding: '20px',
                                textAlign: 'left',
                                fontWeight: '700',
                                fontSize: '14px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                borderBottom: '3px solid var(--accent-yellow)'
                            }}>
                                📦 PRODUCTO
                            </th>
                            <th style={{
                                padding: '20px',
                                textAlign: 'right',
                                fontWeight: '700',
                                fontSize: '14px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                borderBottom: '3px solid var(--accent-yellow)'
                            }}>
                                💰 PRECIO
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index} style={{
                                backgroundColor: index % 2 === 0 ? 'var(--off-white)' : 'var(--pure-white)',
                                transition: 'all 0.3s ease',
                                borderLeft: index % 2 === 0 ? '4px solid var(--accent-yellow)' : '4px solid var(--primary-blue)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--accent-yellow)';
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'var(--off-white)' : 'var(--pure-white)';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <td style={{
                                    padding: '20px',
                                    borderBottom: '2px solid var(--border-gray)',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: 'var(--primary-blue)'
                                }}>
                                    {product.categoria || product.category}
                                </td>
                                <td style={{
                                    padding: '20px',
                                    borderBottom: '2px solid var(--border-gray)',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: 'var(--dark-black)'
                                }}>
                                    {product.producto || product.product || product.nombre}
                                </td>
                                <td style={{
                                    padding: '20px',
                                    borderBottom: '2px solid var(--border-gray)',
                                    textAlign: 'right',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: 'var(--primary-dark-blue)'
                                }}>
                                    ${product.precio || product.price}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
