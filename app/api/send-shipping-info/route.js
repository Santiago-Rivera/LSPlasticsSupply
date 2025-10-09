import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const data = await request.json();

        // Validar que los datos requeridos estén presentes
        const { shippingInfo, cartItems, total } = data;

        if (!shippingInfo || !cartItems || !total) {
            return NextResponse.json(
                { error: 'Datos incompletos' },
                { status: 400 }
            );
        }

        // Configurar el transportador de Nodemailer
        const transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // Para desarrollo, en producción considera cambiarlo a true
            }
        });

        // Preparar el contenido del email
        const emailOptions = {
            from: `"LS Plastics Supply" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || 'Lavadoandsonsllc@gmail.com',
            subject: `🛒 Nueva Orden - Información de Envío - ${shippingInfo.fullName}`,
            html: generateEmailHTML(shippingInfo, cartItems, total),
            // También incluir versión texto plano
            text: generateEmailText(shippingInfo, cartItems, total)
        };

        // Enviar el email
        console.log('📧 Enviando email con Nodemailer...');
        const info = await transporter.sendMail(emailOptions);

        console.log('✅ Email enviado exitosamente:', info.messageId);

        return NextResponse.json({
            success: true,
            message: 'Información de envío enviada exitosamente por email',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Error enviando email:', error);

        // Diferentes tipos de error para diagnóstico
        let errorMessage = 'Error interno del servidor';

        if (error.code === 'EAUTH') {
            errorMessage = 'Error de autenticación de email. Verifica las credenciales.';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'No se pudo conectar al servidor de email.';
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Tiempo de espera agotado al enviar email.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// Función para generar el HTML del email
function generateEmailHTML(shippingInfo, cartItems, total) {
    const itemsHTML = cartItems.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; text-align: left;">${item.nombre}</td>
            <td style="padding: 12px; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right;">$${item.precio.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right; font-weight: bold;">$${(item.precio * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Nueva Orden - Información de Envío</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🛒 Nueva Orden Recibida</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">Información de Envío del Cliente</p>
                </div>

                <!-- Información del Cliente -->
                <div style="padding: 30px 20px;">
                    <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px; border-bottom: 3px solid #fbbf24; padding-bottom: 10px;">
                        📍 INFORMACIÓN DE ENVÍO
                    </h2>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 40%;">👤 Nombre Completo:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.fullName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📧 Correo Electrónico:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📱 Teléfono:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏠 Dirección Principal:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.mainStreet}</td>
                            </tr>
                            ${shippingInfo.secondaryStreet ? `
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏢 Dirección Secundaria:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.secondaryStreet}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏙️ Ciudad:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.city}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🗺️ Provincia/Estado:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.province}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🌎 País:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.country}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📫 Código Postal:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.postalCode}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Productos Ordenados -->
                    <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px; border-bottom: 3px solid #fbbf24; padding-bottom: 10px;">
                        🛍️ PRODUCTOS ORDENADOS
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <thead>
                            <tr style="background-color: #1e3a8a; color: white;">
                                <th style="padding: 15px; text-align: left; font-weight: bold;">Producto</th>
                                <th style="padding: 15px; text-align: center; font-weight: bold;">Cantidad</th>
                                <th style="padding: 15px; text-align: right; font-weight: bold;">Precio Unit.</th>
                                <th style="padding: 15px; text-align: right; font-weight: bold;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>

                    <!-- Total -->
                    <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: bold;">💰 TOTAL: $${total.toFixed(2)}</h2>
                    </div>

                    <!-- Información Adicional -->
                    <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">ℹ️ Información Importante:</h3>
                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                            • El cliente ha completado la información de envío<br>
                            • Fecha y hora: ${new Date().toLocaleString('es-ES', { 
                                timeZone: 'America/Bogota',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}<br>
                            • El cliente procederá al pago a continuación
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        Este email fue generado automáticamente desde el sistema de pedidos de LS Plastics Supply
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Función para generar versión texto plano del email
function generateEmailText(shippingInfo, cartItems, total) {
    const itemsText = cartItems.map(item =>
        `- ${item.nombre} | Cantidad: ${item.quantity} | Precio: $${item.precio.toFixed(2)} | Total: $${(item.precio * item.quantity).toFixed(2)}`
    ).join('\n');

    return `
NUEVA ORDEN RECIBIDA - LS PLASTICS SUPPLY

=== INFORMACIÓN DE ENVÍO ===
Nombre Completo: ${shippingInfo.fullName}
Correo Electrónico: ${shippingInfo.email}
Teléfono: ${shippingInfo.phone}
Dirección Principal: ${shippingInfo.mainStreet}
${shippingInfo.secondaryStreet ? `Dirección Secundaria: ${shippingInfo.secondaryStreet}` : ''}
Ciudad: ${shippingInfo.city}
Provincia/Estado: ${shippingInfo.province}
País: ${shippingInfo.country}
Código Postal: ${shippingInfo.postalCode}

=== PRODUCTOS ORDENADOS ===
${itemsText}

=== TOTAL ===
TOTAL: $${total.toFixed(2)}

=== INFORMACIÓN ADICIONAL ===
- El cliente ha completado la información de envío
- Fecha y hora: ${new Date().toLocaleString('es-ES', { 
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}
- El cliente procederá al pago a continuación

Este email fue generado automáticamente desde el sistema de pedidos de LS Plastics Supply.
    `.trim();
}
