"use client";
import { useEffect, useState } from 'react';

export default function PaymentProcessor({
    selectedMethod,
    amount,
    onSuccess,
    onError,
    onLoading,
    cartItems
}) {
    if (selectedMethod === 'card') {
        return (
            <div style={{ marginTop: '16px' }}>
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>
                        Información de Tarjeta de Crédito
                    </h4>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '600',
                            color: '#555'
                        }}>
                            Número de Tarjeta
                        </label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontFamily: 'monospace'
                            }}
                            onChange={(e) => {
                                // Auto-formatear el número de tarjeta
                                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                                e.target.value = formattedValue;
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '16px'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '600',
                                color: '#555'
                            }}>
                                MM/AA
                            </label>
                            <input
                                type="text"
                                placeholder="12/25"
                                maxLength="5"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontFamily: 'monospace'
                                }}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length >= 2) {
                                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                    }
                                    e.target.value = value;
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '600',
                                color: '#555'
                            }}>
                                CVV
                            </label>
                            <input
                                type="text"
                                placeholder="123"
                                maxLength="4"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontFamily: 'monospace'
                                }}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/\D/g, '');
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '600',
                            color: '#555'
                        }}>
                            Nombre del Titular
                        </label>
                        <input
                            type="text"
                            placeholder="Juan Pérez"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <button
                        onClick={async () => {
                            try {
                                onLoading(true);

                                // Simular procesamiento de pago
                                await new Promise(resolve => setTimeout(resolve, 3000));

                                // Simular pago exitoso
                                onSuccess({
                                    transactionId: `card_${Date.now()}`,
                                    paymentMethod: 'Credit Card',
                                    amount: amount,
                                    status: 'completed'
                                });
                            } catch (error) {
                                onError('Error procesando el pago: ' + error.message);
                            } finally {
                                onLoading(false);
                            }
                        }}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '14px 28px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#218838';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#28a745';
                        }}>
                        Pagar Ahora - ${amount.toFixed(2)}
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
