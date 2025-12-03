import Navbar from '../components/Navbar'
import { CartProvider } from '../contexts/CartContext'
import CartModal from '../components/CartModal'
import '../styles/responsive.css'
import { Inter } from 'next/font/google' // Importar la fuente Inter de next/font/google

const inter = Inter({ subsets: ['latin'] }) // Configurar la fuente Inter

export const metadata = {
    title: {
        default: 'L&S Plastics - Premium Packaging Supplies',
        template: '%s | L&S Plastics', // Plantilla para títulos dinámicos
    },
    description: 'Your trusted source for quality plastic supplies, containers, and packaging solutions',
    keywords: ['packaging', 'plastic supplies', 'food containers', 'L&S Plastics', 'premium quality'],
    icons: {
        icon: '/L&S.jpg',
        shortcut: '/L&S.jpg',
        apple: '/L&S.jpg',
    },
    // Configuración del viewport y theme-color a través de metadata
    viewport: {
        width: 'device-width',
        initialScale: 1.0,
        userScalable: 'yes',
    },
    themeColor: '#1e3a8a',
}

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            {/* El contenido del <head> ahora se gestiona automáticamente por Next.js a través del objeto metadata */}
            <body className={inter.className} style={{ // Aplicar la clase de la fuente al body
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
