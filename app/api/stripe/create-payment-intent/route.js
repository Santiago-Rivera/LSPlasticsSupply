

export async function POST(request) {
    // Asegurar que siempre devolvemos JSON válido
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        console.log('API Stripe: Recibiendo solicitud...');

        // Verificar configuración de Stripe
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Stripe secret key no configurada');
            return new Response(JSON.stringify({
                success: false,
                error: 'Stripe not configured'
            }), {
                status: 400,
                headers
            });
        }

        // Obtener datos del request
        let requestData;
        try {
            requestData = await request.json();
        } catch (jsonError) {
            console.error('Error parseando JSON:', jsonError);
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid JSON data'
            }), {
                status: 400,
                headers
            });
        }

        const { amount, currency = 'usd' } = requestData;

        console.log('Monto recibido:', amount);

        // Validar monto
        if (!amount || amount <= 0 || isNaN(amount)) {
            console.error('Monto invalido:', amount);
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid amount'
            }), {
                status: 400,
                headers
            });
        }

        // Importar y configurar Stripe
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });

        console.log('💳 Creando Payment Intent...');

        // Crear Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                integration_check: 'accept_a_payment',
                timestamp: new Date().toISOString()
            }
        });

        console.log('✅ Payment Intent creado:', paymentIntent.id);

        return new Response(JSON.stringify({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency
        }), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Error en API Stripe:', error);

        // Manejar errores específicos de Stripe
        if (error.type === 'StripeCardError') {
            return new Response(JSON.stringify({
                success: false,
                error: 'Error con la tarjeta: ' + error.message
            }), {
                status: 400,
                headers
            });
        } else if (error.type === 'StripeInvalidRequestError') {
            return new Response(JSON.stringify({
                success: false,
                error: 'Solicitud inválida: ' + error.message
            }), {
                status: 400,
                headers
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                error: 'Error interno del servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }), {
                status: 500,
                headers
            });
        }
    }
}