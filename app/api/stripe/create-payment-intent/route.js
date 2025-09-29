import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

// Cache en memoria para reducir llamadas a Stripe
const paymentIntentCache = new Map();

export async function POST(request) {
    const startTime = Date.now();

    try {
        const { amount, currency = 'usd', items, customerInfo } = await request.json();

        // Validación rápida para evitar procesamiento innecesario
        if (!amount || amount <= 0) {
            return Response.json({ error: 'Monto inválido' }, { status: 400 });
        }

        // Generar clave de cache única
        const cacheKey = `pi_${amount}_${currency}_${JSON.stringify(customerInfo?.email || '')}`;

        // Verificar cache primero (útil para reintentos)
        const cached = paymentIntentCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 minutos
            return Response.json({
                clientSecret: cached.clientSecret,
                paymentIntentId: cached.paymentIntentId,
                cached: true
            });
        }

        // Crear Payment Intent optimizado
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                order_id: `ls_order_${Date.now()}`,
                customer_email: customerInfo?.email || '',
                customer_name: customerInfo?.name || '',
                items_count: items?.length || 0,
                instance_id: process.env.INSTANCE_ID || 'default',
                processing_time: Date.now() - startTime
            },
            description: `Compra L&S Plastics - ${items?.length || 0} productos`,
            receipt_email: customerInfo?.email,
        });

        // Guardar en cache
        paymentIntentCache.set(cacheKey, {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            timestamp: Date.now()
        });

        // Limpiar cache antiguo (cada 100 requests)
        if (Math.random() < 0.01) {
            for (const [key, value] of paymentIntentCache.entries()) {
                if (Date.now() - value.timestamp > 600000) { // 10 minutos
                    paymentIntentCache.delete(key);
                }
            }
        }

        // Headers para balanceador de carga
        const response = Response.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            processingTime: Date.now() - startTime,
            instance: process.env.INSTANCE_ID || 'default'
        });

        response.headers.set('X-Processing-Time', (Date.now() - startTime).toString());
        response.headers.set('X-Instance-ID', process.env.INSTANCE_ID || 'default');

        return response;

    } catch (error) {
        console.error('Error creando Payment Intent:', error);

        // Logging para monitoreo
        const errorResponse = Response.json(
            {
                error: 'Error procesando el pago',
                instance: process.env.INSTANCE_ID || 'default',
                processingTime: Date.now() - startTime
            },
            { status: 500 }
        );

        errorResponse.headers.set('X-Processing-Time', (Date.now() - startTime).toString());
        errorResponse.headers.set('X-Instance-ID', process.env.INSTANCE_ID || 'default');

        return errorResponse;
    }
}
