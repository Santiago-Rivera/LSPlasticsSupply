"use client";

export const CardValidator = {
    // Detectar tipo de tarjeta
    getCardType: (number) => {
        const cleanNumber = number.replace(/\s+/g, '');

        const patterns = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            dinersclub: /^3[0689][0-9]{11}$/
        };

        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(cleanNumber)) {
                return type;
            }
        }
        return 'unknown';
    },

    // Validar número de tarjeta usando algoritmo de Luhn
    validateCardNumber: (number) => {
        const cleanNumber = number.replace(/\s+/g, '');

        if (!/^\d+$/.test(cleanNumber) || cleanNumber.length < 13 || cleanNumber.length > 19) {
            return false;
        }

        let sum = 0;
        let isEven = false;

        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber.charAt(i), 10);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    },

    // Validar fecha de expiración
    validateExpiryDate: (expiry) => {
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(expiry)) {
            return { valid: false, message: 'Formato incorrecto (MM/YY)' };
        }

        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expYear = parseInt(year, 10);
        const expMonth = parseInt(month, 10);

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return { valid: false, message: 'Tarjeta expirada' };
        }

        if (expYear > currentYear + 20) {
            return { valid: false, message: 'Fecha muy lejana' };
        }

        return { valid: true, message: '' };
    },

    // Validar CVV
    validateCVV: (cvv, cardType) => {
        const amexLength = cardType === 'amex' ? 4 : 3;
        const expectedLength = cardType === 'amex' ? 4 : 3;

        if (!/^\d+$/.test(cvv)) {
            return { valid: false, message: 'Solo números' };
        }

        if (cvv.length !== expectedLength) {
            return {
                valid: false,
                message: `Debe tener ${expectedLength} dígitos`
            };
        }

        return { valid: true, message: '' };
    },

    // Formatear número de tarjeta con espacios
    formatCardNumber: (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    },

    // Formatear fecha de expiración
    formatExpiryDate: (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            let month = v.substring(0, 2);
            if (parseInt(month) > 12) {
                month = '12';
            }
            if (parseInt(month) === 0) {
                month = '01';
            }
            return month + (v.length > 2 ? '/' + v.substring(2, 4) : '');
        }
        return v;
    },

    // Validar email
    validateEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return { valid: false, message: 'Email inválido' };
        }
        return { valid: true, message: '' };
    },

    // Validar campos requeridos
    validateRequired: (value, fieldName) => {
        if (!value || value.trim().length === 0) {
            return { valid: false, message: `${fieldName} es requerido` };
        }
        return { valid: true, message: '' };
    }
};

// Componente visual de tarjeta de crédito
export function CreditCardPreview({ cardData }) {
    const cardType = CardValidator.getCardType(cardData.cardNumber);

    const getCardIcon = () => {
        switch (cardType) {
            case 'visa':
                return '💳';
            case 'mastercard':
                return '💳';
            case 'amex':
                return '💳';
            default:
                return '💳';
        }
    };

    const getCardColor = () => {
        switch (cardType) {
            case 'visa':
                return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
            case 'mastercard':
                return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
            case 'amex':
                return 'linear-gradient(135deg, #00b894 0%, #00a085 100%)';
            default:
                return 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)';
        }
    };

    return (
        <div style={{
            width: '300px',
            height: '180px',
            background: getCardColor(),
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            margin: '20px auto'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ fontSize: '24px' }}>{getCardIcon()}</div>
                <div style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    opacity: 0.8
                }}>
                    {cardType}
                </div>
            </div>

            <div style={{
                fontSize: '18px',
                letterSpacing: '2px',
                fontWeight: 'bold'
            }}>
                {cardData.cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end'
            }}>
                <div>
                    <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '4px' }}>
                        TITULAR
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {cardData.cardholderName || 'NOMBRE APELLIDO'}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '4px' }}>
                        VENCE
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {cardData.expiryDate || 'MM/YY'}
                    </div>
                </div>
            </div>
        </div>
    );
}
