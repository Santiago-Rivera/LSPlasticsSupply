import { NextResponse } from 'next/server';
import { validateCoupon, calculateDiscount, REAL_COUPONS } from '../../../../lib/coupons';

export async function POST(request) {
    try {
        const { couponCode, cartTotal, cartItems } = await request.json();

        if (!couponCode) {
            return NextResponse.json({
                success: false,
                error: 'Código de cupón requerido'
            }, { status: 400 });
        }

        if (!cartTotal || cartTotal <= 0) {
            return NextResponse.json({
                success: false,
                error: 'Total del carrito inválido'
            }, { status: 400 });
        }

        // Validar el cupón
        const validation = validateCoupon(couponCode, cartTotal, cartItems || []);

        if (!validation.valid) {
            return NextResponse.json({
                success: false,
                error: validation.error
            }, { status: 400 });
        }

        const coupon = validation.coupon;
        const discountAmount = calculateDiscount(coupon, cartTotal);
        const finalTotal = Math.max(0, cartTotal - discountAmount);

        // Simular incremento de uso del cupón (en producción esto se guardaría en base de datos)
        console.log(`Cupón ${couponCode} aplicado. Descuento: $${discountAmount.toFixed(2)}`);

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                discount: coupon.discount,
                description: coupon.description,
                category: coupon.category
            },
            discountAmount: discountAmount,
            finalTotal: finalTotal,
            savings: discountAmount
        });

    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({
            success: false,
            error: 'Error interno del servidor'
        }, { status: 500 });
    }
}

export async function GET() {
    // Endpoint para obtener cupones públicos disponibles
    try {
        const currentDate = new Date();
        const publicCoupons = [];

        Object.values(REAL_COUPONS).forEach(coupon => {
            const expirationDate = new Date(coupon.expirationDate);
            const isPublic = coupon.category !== 'vip' &&
                           coupon.category !== 'test' &&
                           coupon.isActive &&
                           currentDate <= expirationDate &&
                           coupon.usedCount < coupon.usageLimit;

            if (isPublic) {
                publicCoupons.push({
                    code: coupon.code,
                    type: coupon.type,
                    discount: coupon.discount,
                    description: coupon.description,
                    minimumPurchase: coupon.minimumPurchase,
                    category: coupon.category,
                    expirationDate: coupon.expirationDate
                });
            }
        });

        return NextResponse.json({
            success: true,
            coupons: publicCoupons
        });

    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({
            success: false,
            error: 'Error interno del servidor'
        }, { status: 500 });
    }
}
