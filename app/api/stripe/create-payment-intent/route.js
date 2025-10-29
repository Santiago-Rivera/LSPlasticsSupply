import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

export async function POST(request) {
    try {
        // Verificar si Stripe está configurado
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({
                error: 'Stripe not configured'
            }, { status: 400 });
        }

        const { amount, currency = 'usd' } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({
                error: 'Invalid amount'
            }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json({
            error: 'Failed to create payment intent',
            details: error.message
        }, { status: 500 });
    }
}
