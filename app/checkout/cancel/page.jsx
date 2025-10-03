"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancel() {
    const router = useRouter();

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
                {/* Cancel Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'var(--pure-white)',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚠️</div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Payment Cancelled
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        margin: 0,
                        opacity: 0.9
                    }}>
                        Your payment was cancelled or interrupted
                    </p>
                </div>

                {/* Cancel Details */}
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
                            🛡️ Your cart is safe
                        </h3>

                        <div style={{ fontSize: '14px', color: 'var(--light-black)', lineHeight: '1.6' }}>
                            <p style={{ margin: '8px 0' }}>
                                • No charges were made to your account
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                • Your items are still in your cart
                            </p>
                            <p style={{ margin: '8px 0' }}>
                                • You can complete your purchase anytime
                            </p>
                        </div>
                    </div>

                    {/* Reasons for cancellation */}
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
                            💡 Common reasons for cancellation:
                        </h3>
                        <ul style={{
                            margin: 0,
                            paddingLeft: '20px',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }}>
                            <li>Payment window was closed</li>
                            <li>Session timed out</li>
                            <li>Changed mind about the purchase</li>
                            <li>Payment method not available</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px'
                    }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-yellow) 0%, var(--bright-yellow) 100%)',
                                color: 'var(--dark-black)',
                                padding: '16px 24px',
                                borderRadius: '12px',
                                border: '2px solid var(--bright-yellow)',
                                fontWeight: '700',
                                fontSize: '14px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            ← Try Again
                        </button>

                        <Link href="/" style={{
                            background: 'linear-gradient(135deg, var(--light-black) 0%, var(--dark-black) 100%)',
                            color: 'var(--pure-white)',
                            padding: '16px 24px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            border: '2px solid var(--accent-yellow)',
                            transition: 'all 0.3s ease',
                            display: 'block'
                        }}>
                            🏠 Home
                        </Link>
                    </div>

                    {/* Help Section */}
                    <div style={{
                        marginTop: '24px',
                        padding: '20px',
                        background: 'var(--off-white)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid var(--border-gray)'
                    }}>
                        <p style={{
                            margin: '0 0 12px 0',
                            fontSize: '14px',
                            color: 'var(--light-black)'
                        }}>
                            Need help with your purchase?
                        </p>
                        <a href="tel:908-708-5425" style={{
                            color: 'var(--primary-blue)',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '16px'
                        }}>
                            📞 Call us: 908-708-5425
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
