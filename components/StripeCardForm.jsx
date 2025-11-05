"use client";
import { useState } from 'react';

function StripeCardForm({ amount, onSuccess, onError }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardError, setCardError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);
        setCardError('Procesando pago demo...');

        // Simulate successful payment
        setTimeout(() => {
            const mockPaymentIntent = {
                id: 'demo_' + Date.now(),
                status: 'succeeded',
                amount: amount * 100,
                currency: 'usd',
                payment_method: 'demo_card_****1234',
                created: Math.floor(Date.now() / 1000)
            };
            
            setCardError('');
            setIsProcessing(false);
            onSuccess(mockPaymentIntent);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                background: '#e0f2fe', 
                borderRadius: '8px',
                border: '1px solid #0ea5e9'
            }}>
                <div style={{ fontSize: '14px', color: '#0c4a6e', textAlign: 'center' }}>
                    <strong>🧪 Modo de Demostración</strong><br/>
                    Este es un pago simulado para pruebas.<br/>
                    La orden se generará normalmente.
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Información de Pago
                    </label>
                    <div style={{
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: '#f9fafb',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        💳 Simulación de Pago Seguro<br/>
                        <small>Click en "Procesar Pago" para continuar</small>
                    </div>
                    {cardError && (
                        <p style={{ color: '#0ea5e9', margin: '5px 0 0 0', fontSize: '14px' }}>
                            {cardError}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: isProcessing ? '#ccc' : '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isProcessing ? 'Procesando...' : `🧪 Procesar Pago $${amount.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
}

export default StripeCardForm;
