import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Verificar si Stripe está configurado
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                {
                    error: 'Stripe not configured',
                },
                { status: 400 }
            );
        }

        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });

        const { paymentIntentId } = await request.json();

        if (!paymentIntentId) {
            return NextResponse.json(
                {
                    error: 'Payment Intent ID required',
                },
                { status: 400 }
            );
        }

        // Recuperar el Payment Intent para confirmar el estado
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            return NextResponse.json({
                success: true,
                paymentIntent: {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency,
                    status: paymentIntent.status,
                },
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    status: paymentIntent.status,
                    error: 'Payment not completed',
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        return NextResponse.json(
            {
                error: 'Failed to confirm payment',
            },
            { status: 500 }
        );
    }
}
