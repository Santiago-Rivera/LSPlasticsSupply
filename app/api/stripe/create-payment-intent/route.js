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

        const { amount, currency = 'usd' } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({
                error: 'Invalid amount'
            }, { status: 400 });
        }

        // Crear Payment Intent real con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe usa centavos
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Error creando Payment Intent:', error);
        return NextResponse.json({
            error: 'Failed to create payment intent',
            details: error.message
        }, { status: 500 });
    }
}

