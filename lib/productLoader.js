// Helper para cargar productos de manera segura en cliente y servidor
export async function loadProducts() {
  try {
    // En el servidor durante el build, importar directamente el JSON
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'productos.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    }
    
    // En el cliente, hacer fetch normal
    const response = await fetch('/productos.json');
    if (!response.ok) {
      throw new Error('Could not load productos.json');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
    return []; // Retornar array vacío en caso de error
  }
}

// Verificar si estamos en el cliente
export function isClient() {
  return typeof window !== 'undefined';
}
