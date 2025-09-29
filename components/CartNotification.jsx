"use client";
import { useEffect, useState } from 'react';

export default function CartNotification({ show, productName, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for animation to finish
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{ fontSize: '24px' }}>✅</div>
                <div>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                    }}>
                        ¡Producto agregado!
                    </div>
                    <div style={{
                        fontSize: '14px',
                        opacity: 0.9
                    }}>
                        {productName}
                    </div>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '4px'
                    }}>
                    ×
                </button>
            </div>
        </div>
    );
}
