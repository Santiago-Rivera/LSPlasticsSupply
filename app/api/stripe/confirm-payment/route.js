import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

export async function POST(request) {
    try {
        const { paymentIntentId } = await request.json();

        // Recuperar el Payment Intent para confirmar el estado
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // El pago fue exitoso
            return Response.json({
                success: true,
                paymentIntent: {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount / 100, // Convertir de centavos a dólares
                    currency: paymentIntent.currency,
                    status: paymentIntent.status,
                    receipt_url: paymentIntent.charges.data[0]?.receipt_url,
                    customer_email: paymentIntent.receipt_email,
                },
            });
        } else {
            return Response.json({
                success: false,
                error: 'El pago no se completó correctamente',
                status: paymentIntent.status,
            });
        }
    } catch (error) {
        console.error('Error confirmando pago:', error);
        return Response.json(
            { success: false, error: 'Error verificando el pago' },
            { status: 500 }
        );
    }
}
