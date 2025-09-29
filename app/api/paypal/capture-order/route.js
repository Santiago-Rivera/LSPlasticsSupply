import paypal from '@paypal/checkout-server-sdk';

// Configuración del entorno PayPal
function environment() {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    return process.env.NODE_ENV === 'production'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

export async function POST(request) {
    try {
        const { orderID } = await request.json();

        // Capturar el pago de PayPal
        const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
        captureRequest.requestBody({});

        const capture = await client().execute(captureRequest);

        if (capture.result.status === 'COMPLETED') {
            return Response.json({
                success: true,
                orderID: capture.result.id,
                transactionID: capture.result.purchase_units[0].payments.captures[0].id,
                amount: capture.result.purchase_units[0].payments.captures[0].amount.value,
                currency: capture.result.purchase_units[0].payments.captures[0].amount.currency_code,
                payer: capture.result.payer,
            });
        } else {
            return Response.json({
                success: false,
                error: 'El pago no se completó',
                status: capture.result.status,
            });
        }
    } catch (error) {
        console.error('Error capturando pago PayPal:', error);
        return Response.json(
            { success: false, error: 'Error procesando el pago de PayPal' },
            { status: 500 }
        );
    }
}
