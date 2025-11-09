import sgMail from '@sendgrid/mail';

// Configurar SendGrid como respaldo
export async function sendEmailWithSendGrid(emailData) {
    try {
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error('SendGrid API key no configurada');
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: emailData.to,
            from: {
                email: 'noreply@plasticsupplyls.com', // Email verificado en SendGrid
                name: 'L&S Plastics Supply'
            },
            subject: emailData.subject,
            html: emailData.html,
            replyTo: 'Lavadoandsonsllc@gmail.com'
        };

        const result = await sgMail.send(msg);
        console.log('✅ Email enviado via SendGrid:', emailData.to);
        return { success: true, messageId: result[0].headers['x-message-id'] };

    } catch (error) {
        console.error('Error SendGrid:', error.message);
        return { success: false, error: error.message };
    }
}

// Sistema híbrido: Gmail primero, SendGrid como respaldo
export async function sendEmailHybrid(transporter, emailData) {
    console.log('Intentando envio hibrido para:', emailData.to);

    // Intentar primero con Gmail (Nodemailer)
    try {
        console.log('Intentando Gmail...');
        const gmailResult = await transporter.sendMail({
            from: `"L&S Plastics Supply" <${process.env.EMAIL_USER}>`,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            replyTo: emailData.replyTo || 'Lavadoandsonsllc@gmail.com'
        });

        console.log('✅ Gmail exitoso:', gmailResult.messageId);
        return { success: true, method: 'Gmail', messageId: gmailResult.messageId };

    } catch (gmailError) {
        console.log('Gmail fallo, intentando SendGrid...');
        console.error('Gmail error:', gmailError.message);

        // Respaldo con SendGrid
        const sendGridResult = await sendEmailWithSendGrid(emailData);

        if (sendGridResult.success) {
            console.log('✅ SendGrid exitoso como respaldo');
            return { success: true, method: 'SendGrid', messageId: sendGridResult.messageId };
        } else {
            console.error('Ambos metodos fallaron');
            return {
                success: false,
                error: `Gmail: ${gmailError.message}, SendGrid: ${sendGridResult.error}`
            };
        }
    }
}

// Función de simulación si no hay configuración de email
export function simulateEmailSend(emailData) {
    console.log('SIMULANDO ENVIO DE EMAIL (Sin configuracion real)');
    console.log('Para:', emailData.to);
    console.log('📋 Asunto:', emailData.subject);
    console.log('⏰ Timestamp:', new Date().toISOString());

    // Guardar en logs para debugging
    const simulatedLog = {
        timestamp: new Date().toISOString(),
        to: emailData.to,
        subject: emailData.subject,
        method: 'SIMULADO',
        status: 'LOGGED'
    };

    console.log('📝 Email simulado registrado:', simulatedLog);

    return {
        success: true,
        method: 'Simulación',
        messageId: `sim_${Date.now()}`,
        note: 'Email simulado - configurar credenciales reales para envío'
    };
}
