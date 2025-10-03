"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
    useRouter();
    const searchParams = useSearchParams();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const paymentIntentId = searchParams.get('payment_intent');

        if (sessionId || paymentIntentId) {
            setPaymentDetails({
                sessionId,
                paymentIntentId,
                timestamp: new Date().toLocaleString()
            });
        }
        setLoading(false);
    }, [searchParams]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                    color: 'var(--pure-white)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '3px solid var(--accent-yellow)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                    <h2>Processing payment confirmation...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                background: 'var(--pure-white)',
                borderRadius: '20px',
                border: '3px solid var(--accent-yellow)',
                boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
                overflow: 'hidden'
            }}>
                {/* Success Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'var(--pure-white)',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Payment Successful!
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        margin: 0,
                        opacity: 0.9
                    }}>
                        Your order has been processed successfully
                    </p>
                </div>

                {/* Payment Details */}
                <div style={{ padding: '40px' }}>
                    <div style={{
                        background: 'var(--off-white)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '2px solid var(--border-gray)',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{
                            color: 'var(--primary-blue)',
                            margin: '0 0 16px 0',
                            fontSize: '20px',
                            fontWeight: '700'
                        }}>
                            📋 Payment Details
                        </h3>

                        {paymentDetails && (
                            <div style={{ fontSize: '14px', color: 'var(--light-black)' }}>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>💳 Payment Method:</strong> Stripe
                                </p>
                                {paymentDetails.paymentIntentId && (
                                    <p style={{ margin: '8px 0' }}>
                                        <strong>🔗 Transaction ID:</strong> {paymentDetails.paymentIntentId}
                                    </p>
                                )}
                                <p style={{ margin: '8px 0' }}>
                                    <strong>⏰ Processed at:</strong> {paymentDetails.timestamp}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong>✉️ Confirmation:</strong> A receipt has been sent to your email
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Next Steps */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                        color: 'var(--pure-white)',
                        padding: '24px',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            fontSize: '18px',
                            fontWeight: '700'
                        }}>
                            📦 What happens next?
                        </h3>
                        <ul style={{
                            margin: 0,
                            paddingLeft: '20px',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }}>
                            <li>You'll receive an email confirmation shortly</li>
                            <li>Your order will be prepared for shipment</li>
                            <li>We'll send tracking information once shipped</li>
                            <li>Expected delivery: 3-5 business days</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px'
                    }}>
                        <Link href="/" style={{
                            background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)',
                            color: 'var(--dark-black)',
                            padding: '16px 24px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            border: '2px solid var(--bright-yellow)',
                            transition: 'all 0.3s ease',
                            display: 'block'
                        }}>
                            🏠 Continue Shopping
                        </Link>

                        <button
                            onClick={() => window.print()}
                            style={{
                                background: 'linear-gradient(135deg, var(--light-black) 0%, var(--dark-black) 100%)',
                                color: 'var(--pure-white)',
                                padding: '16px 24px',
                                borderRadius: '12px',
                                border: '2px solid var(--accent-yellow)',
                                fontWeight: '700',
                                fontSize: '14px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🖨️ Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-dark-blue) 0%, var(--primary-blue) 100%)',
                color: 'var(--pure-white)',
                padding: '40px',
                borderRadius: '20px',
                border: '3px solid var(--accent-yellow)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                <h2>Loading payment details...</h2>
            </div>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
