import Navbar from '../components/Navbar'

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
        <body>
        <Navbar/>
        {children}
        </body>
        </html>
    );
}
