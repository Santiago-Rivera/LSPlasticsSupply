import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        console.log('📧 API send-shipping-info: Recibiendo solicitud...');
        
        const data = await request.json();
        console.log('📝 Datos recibidos:', {
            shippingInfo: data.shippingInfo?.nombreCompleto || 'No disponible',
            cartItems: data.cartItems?.length || 0,
            total: data.total || 0
        });

        // Validar que los datos requeridos estén presentes
        const { shippingInfo, cartItems, total } = data;

        if (!shippingInfo || !cartItems || !total) {
            console.log('⚠️ Datos incompletos, pero continuando...');
        }

        // Verificar si las credenciales de email están configuradas correctamente
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        // Si las credenciales no están configuradas o son de ejemplo, devolver éxito sin enviar email
        if (!emailUser || !emailPass ||
            emailUser === 'tu-email@gmail.com' ||
            emailPass === 'tu-app-password' ||
            emailUser.includes('tu-email')) {

            console.log('⚠️ Credenciales de email no configuradas. Guardando información localmente.');

            // Guardar la información en logs para desarrollo
            console.log('📝 NUEVA ORDEN RECIBIDA:', {
                cliente: shippingInfo?.nombreCompleto || 'No especificado',
                email: shippingInfo?.correoElectronico || 'No especificado',
                telefono: shippingInfo?.telefono || 'No especificado',
                direccion: shippingInfo?.direccion || 'No especificado',
                ciudad: shippingInfo?.ciudad || 'No especificado',
                total: total || 0,
                productos: cartItems?.length || 0,
                fecha: new Date().toLocaleString('es-ES', {
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            });

            return NextResponse.json({
                success: true,
                message: 'Información recibida correctamente',
                note: 'Email service not configured - Information logged locally'
            });
        }

        // Si las credenciales están configuradas, intentar enviar el email
        try {
            console.log('📧 Intentando enviar email con credenciales configuradas...');
            
            // Configurar el transportador de Nodemailer
            const transporter = nodemailer.createTransporter({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: emailUser,
                    pass: emailPass
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // Preparar el contenido del email
            const emailOptions = {
                from: `"LS Plastics Supply" <${process.env.EMAIL_FROM || emailUser}>`,
                to: 'Lavadoandsonsllc@gmail.com',
                subject: `✅ Nueva Orden - LS Plastics Supply`,
                html: generateEmailHTML(shippingInfo, cartItems, total),
                text: generateEmailText(shippingInfo, cartItems, total)
            };

            // Enviar el email
            console.log('📧 Enviando email...');
            const info = await transporter.sendMail(emailOptions);

            console.log('✅ Email enviado exitosamente:', info.messageId);

            return NextResponse.json({
                success: true,
                message: 'Información de envío enviada exitosamente por email',
                messageId: info.messageId
            });

        } catch (emailError) {
            console.error('❌ Error enviando email:', emailError.message);

            // No bloquear el proceso si falla el email - guardar localmente
            console.log('📝 Guardando información localmente debido a error de email...');
            console.log('📝 ORDEN (Error de Email):', {
                cliente: shippingInfo?.nombreCompleto,
                email: shippingInfo?.correoElectronico,
                total: total,
                error: emailError.message
            });

            return NextResponse.json({
                success: true,
                message: 'Información recibida (email no disponible)',
                emailError: emailError.message
            });
        }

    } catch (error) {
        console.error('❌ Error general en API send-shipping-info:', error);

        // Siempre devolver éxito para no bloquear el checkout
        return NextResponse.json({
            success: true,
            message: 'Información procesada con advertencias',
            error: error.message
        }, { status: 200 });
    }
}

// Función para generar el HTML del email
function generateEmailHTML(shippingInfo, cartItems, total) {
    const itemsHTML = cartItems.map(item => {
        const basePrice = item.precio * item.quantity;
        const discountedPrice = item.quantity >= 2 ? basePrice * 0.95 : basePrice;
        const hasDiscount = item.quantity >= 2;
        
        return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; text-align: left;">${item.nombre}</td>
            <td style="padding: 12px; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right;">$${item.precio.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right; font-weight: bold;">
                ${hasDiscount ? `<span style="text-decoration: line-through; color: #999; font-size: 12px;">$${basePrice.toFixed(2)}</span><br>` : ''}
                $${discountedPrice.toFixed(2)}
                ${hasDiscount ? '<br><span style="color: #16a34a; font-size: 10px;">5% descuento</span>' : ''}
            </td>
        </tr>
        `;
    }).join('');

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Nueva Orden - LS Plastics Supply</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🛍️ Nueva Orden Recibida</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">LS Plastics Supply</p>
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
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.nombreCompleto}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📧 Correo Electrónico:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.correoElectronico}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📱 Teléfono:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.telefono}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏠 Dirección:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.direccion}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏙️ Ciudad:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.ciudad}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">🗺️ Provincia:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.provincia}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📫 Código Postal:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${shippingInfo.codigoPostal}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #374151;">📅 Fecha de Orden:</td>
                                <td style="padding: 8px 0; color: #1f2937;">${new Date().toLocaleString('es-ES', { 
                                    timeZone: 'America/New_York',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</td>
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
                    <div style="margin-top: 30px; padding: 20px; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                        <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">ℹ️ Información de la Orden:</h3>
                        <p style="margin: 0; color: #1e40af; font-size: 14px;">
                            • Esta orden fue realizada desde la página web<br>
                            • El cliente completó todos los datos de envío<br>
                            • Procesar pedido y contactar al cliente para coordinar entrega<br>
                            • Email del cliente: ${shippingInfo.correoElectronico}
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        Este es un correo automático de LS Plastics Supply
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Función para generar versión texto plano del email
function generateEmailText(shippingInfo, cartItems, total) {
    const itemsText = cartItems.map(item => {
        const basePrice = item.precio * item.quantity;
        const discountedPrice = item.quantity >= 2 ? basePrice * 0.95 : basePrice;
        const hasDiscount = item.quantity >= 2;
        
        return `- ${item.nombre} | Cantidad: ${item.quantity} | Precio: $${item.precio.toFixed(2)} | Total: $${discountedPrice.toFixed(2)}${hasDiscount ? ' (5% descuento aplicado)' : ''}`;
    }).join('\n');

    return `
NUEVA ORDEN - LS PLASTICS SUPPLY

Una nueva orden ha sido recibida desde la página web.

=== INFORMACIÓN DE ENVÍO ===
Nombre Completo: ${shippingInfo.nombreCompleto}
Correo Electrónico: ${shippingInfo.correoElectronico}
Teléfono: ${shippingInfo.telefono}
Dirección: ${shippingInfo.direccion}
Ciudad: ${shippingInfo.ciudad}
Provincia: ${shippingInfo.provincia}
Código Postal: ${shippingInfo.codigoPostal}
Fecha de Orden: ${new Date().toLocaleString('es-ES', { 
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}

=== PRODUCTOS ORDENADOS ===
${itemsText}

=== TOTAL ===
TOTAL: $${total.toFixed(2)}

=== INSTRUCCIONES ===
- Procesar pedido y contactar al cliente para coordinar entrega
- Email del cliente: ${shippingInfo.correoElectronico}
- Teléfono del cliente: ${shippingInfo.telefono}

Este es un correo automático de LS Plastics Supply.
    `;
}
