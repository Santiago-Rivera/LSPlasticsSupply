import paypal from '@paypal/checkout-server-sdk';

// Cache para órdenes de PayPal
const orderCache = new Map();

// Configuración del entorno PayPal optimizada
function environment() {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    return process.env.NODE_ENV === 'production'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// Cliente PayPal con pool de conexiones
let paypalClient = null;
function client() {
    if (!paypalClient) {
        paypalClient = new paypal.core.PayPalHttpClient(environment());
    }
    return paypalClient;
}

export async function POST(request) {
    const startTime = Date.now();

    try {
        const { amount, items, customerInfo } = await request.json();

        // Validación rápida
        if (!amount || amount <= 0) {
            return Response.json({ error: 'Monto inválido' }, { status: 400 });
        }

        // Generar clave de cache
        const cacheKey = `pp_${amount}_${items?.length || 0}_${Date.now()}`;

        // Crear orden de PayPal optimizada
        const orderRequest = new paypal.orders.OrdersCreateRequest();
        orderRequest.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount.toFixed(2),
                },
                description: `Compra L&S Plastics - ${items?.length || 0} productos`,
                custom_id: `ls_order_${Date.now()}`,
                soft_descriptor: 'L&S PLASTICS'
            }],
            application_context: {
                brand_name: 'L&S Plastics Supply',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
            },
        });

        const order = await client().execute(orderRequest);

        // Guardar en cache temporal
        orderCache.set(order.result.id, {
            orderData: order.result,
            items,
            amount,
            timestamp: Date.now()
        });

        // Limpiar cache antiguo
        if (Math.random() < 0.05) { // 5% de probabilidad
            for (const [key, value] of orderCache.entries()) {
                if (Date.now() - value.timestamp > 1800000) { // 30 minutos
                    orderCache.delete(key);
                }
            }
        }

        const response = Response.json({
            orderID: order.result.id,
            approvalUrl: order.result.links.find(link => link.rel === 'approve').href,
            processingTime: Date.now() - startTime,
            instance: process.env.INSTANCE_ID || 'default'
        });

        response.headers.set('X-Processing-Time', (Date.now() - startTime).toString());
        response.headers.set('X-Instance-ID', process.env.INSTANCE_ID || 'default');

        return response;

    } catch (error) {
        console.error('Error creando orden PayPal:', error);

        const errorResponse = Response.json(
            {
                error: 'Error creando orden de PayPal',
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
