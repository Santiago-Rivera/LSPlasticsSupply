import Navbar from '../components/Navbar'
import { CartProvider } from '../contexts/CartContext'
import CartModal from '../components/CartModal'
import '../styles/responsive.css'

export const metadata = {
    title: 'L&S Plastics - Premium Packaging Supplies',
    description: 'Your trusted source for quality plastic supplies, containers, and packaging solutions',
    keywords: ['packaging', 'plastic supplies', 'food containers', 'L&S Plastics', 'premium quality'],
    icons: {
        icon: '/L&S.jpg',
        shortcut: '/L&S.jpg',
        apple: '/L&S.jpg',
    }
}

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                <title>L&S Plastics - Premium Packaging Supplies</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
                <meta name="theme-color" content="#1e3a8a" />
            </head>
            <body style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                backgroundColor: '#f8fafc',
                color: '#111827',
                overflowX: 'hidden'
            }}>
                <CartProvider>
                    <Navbar />
                    <main style={{
                        minHeight: 'calc(100vh - 60px)',
                        width: '100%',
                        maxWidth: '100vw',
                        overflowX: 'hidden'
                    }}>
                        {children}
                    </main>
                    <CartModal />
                </CartProvider>
            </body>
        </html>
    )
}
