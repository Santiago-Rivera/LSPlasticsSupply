import Navbar from '../components/Navbar'
import { CartProvider } from '../contexts/CartContext'
import LoadBalancerMonitor from '../components/LoadBalancerMonitor'

export const metadata = {
    title: 'Plastics Supply L&S',
    description: 'Venta de productos plásticos y más',
    keywords: ['tienda, online, ecommerce', 'plásticos', 'venta', 'productos plásticos', 'Plastics Supply L&S'],
    icons: {
        icon: '/L&S.jpg',
        shortcut: '/L&S.jpg',
        apple: '/L&S.jpg',
    }
}

export default function RootLayout({children}) {
    return (
        <html>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

            {/* Scripts para pagos reales */}
            <script src="https://js.stripe.com/v3/" async></script>
            <script src="https://pay.google.com/gp/p/js/pay.js" async></script>
            <script src="https://www.paypal.com/sdk/js?client-id=your-paypal-client-id&currency=USD&intent=capture" async></script>

            {/* Meta tags para pagos seguros y balanceador de carga */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            <meta name="x-instance-id" content={process.env.INSTANCE_ID || 'default'} />
        </head>
        <body style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
        <CartProvider>
            <Navbar/>
            {children}
            <LoadBalancerMonitor />
        </CartProvider>
        </body>
        </html>
    );
}
