// app/components/ProductTable.jsx
'use client';

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
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  // Agrupar productos por categoría
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.categoria;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div style={{ margin: '20px 0' }}>
      {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
        <div key={category} style={{ 
          marginBottom: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#4a5568',
            color: 'white',
            padding: '16px 24px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {category}
          </div>
          
          <div style={{ padding: '0' }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Producto
                  </th>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'right',
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryProducts.map((product, index) => (
                  <tr key={index} style={{ 
                    borderBottom: index < categoryProducts.length - 1 ? '1px solid #e9ecef' : 'none',
                    ':hover': { backgroundColor: '#f8f9fa' }
                  }}
                  onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'white'}
                  >
                    <td style={{ 
                      padding: '16px 24px',
                      color: '#212529'
                    }}>
                      {product.producto}
                    </td>
                    <td style={{ 
                      padding: '16px 24px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#28a745'
                    }}>
                      ${parseFloat(product.precio).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
