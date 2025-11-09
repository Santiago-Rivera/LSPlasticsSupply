import { NextResponse } from 'next/server';

/**
 * Ruta de Prueba - Sistema de Protección
 * Esta ruta simula una operación de modificación que debería estar protegida
 */

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Si llegamos aquí, significa que el sistema de protección permitió el acceso
        return NextResponse.json({
            success: true,
            message: 'PRUEBA EXITOSA - El sistema de proteccion esta funcionando correctamente',
            data: {
                testType: 'Modificación simulada',
                timestamp: new Date().toISOString(),
                authorizedUser: 'Santiago',
                requestBody: body
            }
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error en la prueba',
            error: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Endpoint de Prueba del Sistema de Proteccion',
        status: 'Activo',
        description: 'Esta ruta está protegida y requiere autenticación',
        owner: 'Santiago',
        project: 'L&S Plastics Supply'
    });
}

export async function PUT(request) {
    // Operación de actualización simulada
    const body = await request.json();
    
    return NextResponse.json({
        success: true,
        message: 'PRUEBA PUT EXITOSA - Modificacion autorizada',
        operation: 'UPDATE',
        data: body,
        timestamp: new Date().toISOString()
    });
}

export async function DELETE() {
    // Operación de eliminación simulada
    return NextResponse.json({
        success: true,
        message: 'PRUEBA DELETE EXITOSA - Eliminacion autorizada',
        operation: 'DELETE',
        timestamp: new Date().toISOString()
    });
}
