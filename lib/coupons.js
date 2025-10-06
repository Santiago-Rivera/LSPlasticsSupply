// Sistema de cupones reales para LS Plastics Supply
export const REAL_COUPONS = {
    // Cupones de descuento porcentual
    'WELCOME10': {
        code: 'WELCOME10',
        type: 'percentage',
        discount: 10,
        description: '10% de descuento de bienvenida',
        minimumPurchase: 50,
        maxDiscount: null,
        expirationDate: '2025-12-31',
        usageLimit: 1000,
        usedCount: 0,
        isActive: true,
        category: 'welcome'
    },
    'SAVE15': {
        code: 'SAVE15',
        type: 'percentage',
        discount: 15,
        description: '15% de descuento en tu compra',
        minimumPurchase: 100,
        maxDiscount: 50,
        expirationDate: '2025-06-30',
        usageLimit: 500,
        usedCount: 0,
        isActive: true,
        category: 'general'
    },
    'BULK20': {
        code: 'BULK20',
        type: 'percentage',
        discount: 20,
        description: '20% de descuento en compras mayoristas',
        minimumPurchase: 200,
        maxDiscount: 100,
        expirationDate: '2025-08-15',
        usageLimit: 200,
        usedCount: 0,
        isActive: true,
        category: 'bulk'
    },

    // Cupones de descuento fijo
    'FIRST25': {
        code: 'FIRST25',
        type: 'fixed',
        discount: 25,
        description: '$25 de descuento en tu primera compra',
        minimumPurchase: 75,
        maxDiscount: null,
        expirationDate: '2025-12-31',
        usageLimit: 1000,
        usedCount: 0,
        isActive: true,
        category: 'first_order'
    },
    'SAVE30': {
        code: 'SAVE30',
        type: 'fixed',
        discount: 30,
        description: '$30 de descuento',
        minimumPurchase: 150,
        maxDiscount: null,
        expirationDate: '2025-09-30',
        usageLimit: 300,
        usedCount: 0,
        isActive: true,
        category: 'general'
    },

    // Cupones estacionales
    'SPRING2025': {
        code: 'SPRING2025',
        type: 'percentage',
        discount: 12,
        description: '12% de descuento promoción primavera',
        minimumPurchase: 80,
        maxDiscount: 40,
        expirationDate: '2025-06-21',
        usageLimit: 500,
        usedCount: 0,
        isActive: true,
        category: 'seasonal'
    },
    'SUMMER2025': {
        code: 'SUMMER2025',
        type: 'fixed',
        discount: 20,
        description: '$20 de descuento promoción verano',
        minimumPurchase: 100,
        maxDiscount: null,
        expirationDate: '2025-09-21',
        usageLimit: 400,
        usedCount: 0,
        isActive: true,
        category: 'seasonal'
    },

    // Cupones especiales para categorías
    'PLASTIC15': {
        code: 'PLASTIC15',
        type: 'percentage',
        discount: 15,
        description: '15% en productos de plástico',
        minimumPurchase: 60,
        maxDiscount: 35,
        expirationDate: '2025-11-30',
        usageLimit: 250,
        usedCount: 0,
        isActive: true,
        category: 'plastic_products',
        applicableCategories: ['Plastic', 'Plastic Bags', 'Plastic Containers Microwave']
    },
    'CUTLERY10': {
        code: 'CUTLERY10',
        type: 'percentage',
        discount: 10,
        description: '10% en cubiertos y accesorios',
        minimumPurchase: 40,
        maxDiscount: 25,
        expirationDate: '2025-10-31',
        usageLimit: 200,
        usedCount: 0,
        isActive: true,
        category: 'cutlery',
        applicableCategories: ['Cutlery & Accessories']
    },

    // Cupones VIP
    'VIP25': {
        code: 'VIP25',
        type: 'percentage',
        discount: 25,
        description: '25% descuento VIP',
        minimumPurchase: 300,
        maxDiscount: 150,
        expirationDate: '2025-12-31',
        usageLimit: 50,
        usedCount: 0,
        isActive: true,
        category: 'vip'
    },

    // Cupones expirados o inactivos (para testing)
    'EXPIRED': {
        code: 'EXPIRED',
        type: 'percentage',
        discount: 20,
        description: 'Cupón expirado',
        minimumPurchase: 50,
        maxDiscount: null,
        expirationDate: '2024-12-31',
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
        category: 'test'
    },
    'MAXEDOUT': {
        code: 'MAXEDOUT',
        type: 'fixed',
        discount: 15,
        description: 'Cupón agotado',
        minimumPurchase: 50,
        maxDiscount: null,
        expirationDate: '2025-12-31',
        usageLimit: 100,
        usedCount: 100,
        isActive: true,
        category: 'test'
    },
    'INACTIVE': {
        code: 'INACTIVE',
        type: 'percentage',
        discount: 30,
        description: 'Cupón inactivo',
        minimumPurchase: 50,
        maxDiscount: null,
        expirationDate: '2025-12-31',
        usageLimit: 100,
        usedCount: 0,
        isActive: false,
        category: 'test'
    }
};

// Función para validar si un cupón es válido
export function validateCoupon(couponCode, cartTotal, cartItems = []) {
    const coupon = REAL_COUPONS[couponCode?.toUpperCase()];

    if (!coupon) {
        return {
            valid: false,
            error: 'Código de cupón no válido'
        };
    }

    // Verificar si el cupón está activo
    if (!coupon.isActive) {
        return {
            valid: false,
            error: 'Este cupón ya no está disponible'
        };
    }

    // Verificar fecha de expiración
    const currentDate = new Date();
    const expirationDate = new Date(coupon.expirationDate);
    if (currentDate > expirationDate) {
        return {
            valid: false,
            error: 'Este cupón ha expirado'
        };
    }

    // Verificar límite de uso
    if (coupon.usedCount >= coupon.usageLimit) {
        return {
            valid: false,
            error: 'Este cupón ha alcanzado su límite de uso'
        };
    }

    // Verificar compra mínima
    if (cartTotal < coupon.minimumPurchase) {
        return {
            valid: false,
            error: `Compra mínima requerida: $${coupon.minimumPurchase.toFixed(2)}`
        };
    }

    // Verificar categorías aplicables (si las hay)
    if (coupon.applicableCategories && cartItems.length > 0) {
        const hasApplicableItems = cartItems.some(item =>
            coupon.applicableCategories.includes(item.categoria)
        );

        if (!hasApplicableItems) {
            return {
                valid: false,
                error: `Este cupón solo aplica para: ${coupon.applicableCategories.join(', ')}`
            };
        }
    }

    return {
        valid: true,
        coupon: coupon
    };
}

// Función para calcular el descuento
export function calculateDiscount(coupon, cartTotal) {
    if (!coupon) return 0;

    let discount = 0;

    if (coupon.type === 'percentage') {
        discount = cartTotal * (coupon.discount / 100);
        // Aplicar descuento máximo si existe
        if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
        }
    } else if (coupon.type === 'fixed') {
        discount = coupon.discount;
    }

    // El descuento no puede ser mayor al total del carrito
    return Math.min(discount, cartTotal);
}

// Función para obtener cupones sugeridos basados en el carrito
export function getSuggestedCoupons(cartTotal, cartItems = []) {
    const currentDate = new Date();
    const suggested = [];

    // Filtrar cupones válidos
    Object.values(REAL_COUPONS).forEach(coupon => {
        const expirationDate = new Date(coupon.expirationDate);
        const isValid = coupon.isActive &&
                       currentDate <= expirationDate &&
                       coupon.usedCount < coupon.usageLimit &&
                       coupon.category !== 'test'; // Excluir cupones de prueba

        if (isValid) {
            // Sugerir cupones que el usuario puede usar
            if (cartTotal >= coupon.minimumPurchase) {
                suggested.push(coupon);
            }
        }
    });

    // Ordenar por descuento (mayor primero)
    return suggested.sort((a, b) => {
        const discountA = a.type === 'percentage' ? a.discount : (a.discount / cartTotal) * 100;
        const discountB = b.type === 'percentage' ? b.discount : (b.discount / cartTotal) * 100;
        return discountB - discountA;
    }).slice(0, 4); // Máximo 4 sugerencias
}

export default REAL_COUPONS;
