// app/api/productos/route.js
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión (asegúrate de tener tu .env.local configurado)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Handler para la solicitud GET
export async function GET() {
    let client;
    try {
        client = await pool.connect();

        // Consulta para obtener productos y sus categorías
        const queryText = `
      SELECT
        c.nombre AS categoria,
        p.nombre AS producto,
        p.precio
      FROM
        productos p
      JOIN
        categorias c ON p.categoria_id = c.categoria_id
      ORDER BY
        c.nombre, p.nombre;
    `;

        const result = await client.query(queryText);

        // Devuelve los datos como JSON (endpoint: /api/productos)
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error('Error al obtener datos de PostgreSQL:', error);
        return NextResponse.json(
            { error: 'Error al consultar la base de datos.' },
            { status: 500 }
        );
    } finally {
        if (client) {
            client.release(); // Libera la conexión
        }
    }
}