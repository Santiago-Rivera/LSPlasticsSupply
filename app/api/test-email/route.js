import nodemailer from 'nodemailer';

export async function POST(request) {
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        console.log('Probando configuracion de email...');

        // Verificar variables de entorno
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Variables de entorno EMAIL_USER o EMAIL_PASS no configuradas',
                config: {
                    EMAIL_USER: process.env.EMAIL_USER ? 'Configurado' : 'NO CONFIGURADO',
                    EMAIL_PASS: process.env.EMAIL_PASS ? 'Configurado' : 'NO CONFIGURADO'
                }
            }), { status: 400, headers });
        }

        // Configurar transporter
        const transporter = nodemailer.createTransporter({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log('Verificando conexion SMTP...');

        // Verificar conexión
        try {
            await transporter.verify();
            console.log('Conexion SMTP exitosa');
        } catch (verifyError) {
            console.error('Error de verificacion SMTP:', verifyError);
            return new Response(JSON.stringify({
                success: false,
                error: 'Error de conexión SMTP',
                details: verifyError.message,
                suggestions: [
                    'Verificar que el email y contraseña sean correctos',
                    'Si usas Gmail, necesitas una "Contraseña de aplicación"',
                    'Habilitar "Acceso de aplicaciones menos seguras" o usar OAuth2'
                ]
            }), { status: 400, headers });
        }

        // Obtener email de prueba del request
        const { testEmail } = await request.json();
        const emailToTest = testEmail || process.env.EMAIL_USER;

        console.log('Enviando email de prueba a:', emailToTest);

        // Enviar email de prueba
        const testMailOptions = {
            from: `"L&S Plastics Supply - Test" <${process.env.EMAIL_USER}>`,
            to: emailToTest,
            subject: 'Test de Configuracion de Email - L&S Plastics Supply',
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: white; border: 3px solid #10b981; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 800;">Test de Email</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">Configuración exitosa</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 2px solid #10b981;">
                            <h2 style="margin: 0 0 10px 0; color: #059669; font-size: 24px;">Sistema de Email Funcionando</h2>
                            <p style="margin: 0; color: #065f46;">Este email confirma que el sistema de notificaciones está operativo.</p>
                        </div>

                        <div style="background: #fefbf7; padding: 20px; border-radius: 8px; border: 1px solid #f3e8ff;">
                            <h3 style="color: #92400e; margin: 0 0 15px 0;">📋 Detalles de la Prueba:</h3>
                            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
                            <p style="margin: 5px 0;"><strong>Servidor:</strong> Gmail SMTP</p>
                            <p style="margin: 5px 0;"><strong>Puerto:</strong> 587</p>
                            <p style="margin: 5px 0;"><strong>Email de origen:</strong> ${process.env.EMAIL_USER}</p>
                        </div>

                        <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-top: 25px;">
                            <h3 style="margin: 0;">Sistema Listo para Procesar Ordenes!</h3>
                        </div>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(testMailOptions);
        
        console.log('Email de prueba enviado exitosamente');
        console.log('Message ID:', result.messageId);

        return new Response(JSON.stringify({
            success: true,
            message: 'Email de prueba enviado exitosamente',
            details: {
                messageId: result.messageId,
                from: process.env.EMAIL_USER,
                to: emailToTest,
                timestamp: new Date().toISOString()
            }
        }), { status: 200, headers });

    } catch (error) {
        console.error('Error en test de email:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Error enviando email de prueba',
            details: error.message,
            troubleshooting: [
                'Verificar credenciales de Gmail',
                'Generar contraseña de aplicación en Gmail',
                'Verificar configuración de seguridad de la cuenta'
            ]
        }), { status: 500, headers });
    }
}
