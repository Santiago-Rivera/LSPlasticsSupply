export async function POST(request) {
    const headers = { 'Content-Type': 'application/json' };

    try {
        console.log('🔵 API create-payment-intent llamada');

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('❌ Stripe secret key no configurada');
            return new Response(JSON.stringify({ success: false, error: 'Stripe not configured' }), { status: 400, headers });
        }

        let requestData;
        try {
            requestData = await request.json();
            console.log('✅ Request JSON parseado:', JSON.stringify(requestData, null, 2));
        } catch (jsonError) {
            console.error('❌ Error parseando JSON:', jsonError);
            return new Response(JSON.stringify({ success: false, error: 'Invalid JSON data' }), { status: 400, headers });
        }

        const { items, currency = 'usd' } = requestData;

        if (!items || !Array.isArray(items) || items.length === 0) {
            console.error('❌ Cart items inválidos o vacíos');
            return new Response(JSON.stringify({ success: false, error: 'Cart items are required' }), { status: 400, headers });
        }

        console.log('✅ Items recibidos:', items.length, 'productos');

        // =================================================================================
        // CÁLCULO SEGURO DEL MONTO TOTAL EN EL SERVIDOR
        // =================================================================================
        // NUNCA confíes en el monto enviado por el cliente.
        // El servidor debe calcular el total basándose en los productos y sus precios en tu base de datos.

        // 1. Define una función para obtener los precios de tu base de datos.
        const getProductPrice = async (productId) => {
            try {
                console.log('🔍 Buscando precio para producto:', productId);
                // Leer productos desde el archivo JSON
                const fs = await import('fs/promises');
                const path = await import('path');
                const productosPath = path.join(process.cwd(), 'public', 'productos.json');
                const productosData = await fs.readFile(productosPath, 'utf-8');
                const productos = JSON.parse(productosData);

                // Buscar el producto por codigo_producto
                const product = productos.find(p => p.codigo_producto === productId);

                if (!product) {
                    console.error('❌ Producto no encontrado:', productId);
                    throw new Error(`Producto con ID ${productId} no encontrado.`);
                }

                console.log('✅ Precio encontrado para', productId, ':', product.precio);
                return product.precio;
            } catch (error) {
                console.error('❌ Error obteniendo precio del producto:', error);
                throw new Error(`Error al obtener el producto: ${error.message}`);
            }
        };

        // 2. Calcula el monto total de forma segura.
        console.log('💰 Calculando monto total...');
        let calculatedAmount = 0;
        for (const item of items) {
            if (!item.id || !item.quantity || item.quantity <= 0) {
                console.error('❌ Item inválido:', item);
                return new Response(JSON.stringify({ success: false, error: 'Invalid item in cart' }), { status: 400, headers });
            }
            const price = await getProductPrice(item.id);
            calculatedAmount += price * item.quantity;
            console.log('  ➕', item.id, ':', price, 'x', item.quantity, '=', price * item.quantity);
        }

        console.log('✅ Monto calculado:', calculatedAmount);

        // Aquí puedes añadir lógica adicional como descuentos, impuestos, etc.
        // Por ejemplo, un descuento del 5% si hay más de 2 items.
        if (items.reduce((acc, item) => acc + item.quantity, 0) > 2) {
            // calculatedAmount *= 0.95; // Aplica 5% de descuento
        }

        // =================================================================================

        const finalAmount = Math.round(calculatedAmount * 100); // Convertir a centavos

        if (finalAmount <= 0) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid total amount' }), { status: 400, headers });
        }

        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

        console.log('💳 Creando Payment Intent con monto calculado en servidor...');

        const paymentIntent = await stripe.paymentIntents.create({
            amount: finalAmount,
            currency: currency.toLowerCase(),
            automatic_payment_methods: { enabled: true },
            metadata: {
                integration_check: 'accept_a_payment',
                timestamp: new Date().toISOString(),
                // Guarda los IDs de los productos en los metadatos para futuras referencias
                cart_items: JSON.stringify(items.map(i => i.id)),
            }
        });

        console.log('✅ Payment Intent creado:', paymentIntent.id);

        return new Response(JSON.stringify({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency
        }), { status: 200, headers });

    } catch (error) {
        console.error('❌ Error en API Stripe:', error);
        const errorMessage = error.message || 'Error interno del servidor';

        return new Response(JSON.stringify({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), { status: 500, headers });
    }
}

