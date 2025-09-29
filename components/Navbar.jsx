"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
    const router = useRouter();
    const { getCartItemCount, getCartTotal, setIsOpen } = useCart();

    const handleAboutClick = (e) => {
        e.preventDefault();
        // Si ya estamos en la página principal, hacer scroll a la sección
        if (window.location.pathname === '/') {
            const aboutSection = document.getElementById('about-section');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
            // Si estamos en otra página, navegar a la principal y luego hacer scroll
            router.push('/#about-section');
        }
    };

    const cartItemCount = getCartItemCount();
    const cartTotal = getCartTotal();

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: '56px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e5e5',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            {/* Logo section */}
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Link href="/" style={{display: 'flex', alignItems: 'center', textDecoration: 'none'}}>
                    <Image
                        src={"/L&S.jpg"}
                        alt={"Plastics Supply L&S Logo"}
                        width={40}
                        height={40}
                        style={{marginRight: '8px', borderRadius: '4px'}}
                    />
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#2c3e50'
                    }}>
                        L&S Plastics
                    </span>
                </Link>
            </div>

            {/* Navigation links */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
            }}>
                <Link
                    href="#"
                    onClick={handleAboutClick}
                    style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.target.style.color = '#666'}>
                    About
                </Link>

                <Link
                    href="/tienda/categorias"
                    style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Categories
                </Link>

                <Link
                    href="/productos"
                    style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Products
                </Link>

                {/* Cart Button */}
                <button
                    onClick={() => router.push('/cart')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#4a5568',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2d3748';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#4a5568';
                        e.target.style.transform = 'translateY(0)';
                    }}>
                    🛒 Cart
                    {cartItemCount > 0 && (
                        <span style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '50%',
                            minWidth: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px'
                        }}>
                            {cartItemCount}
                        </span>
                    )}
                    {cartTotal > 0 && (
                        <span style={{
                            fontSize: '12px',
                            opacity: 0.9,
                            marginLeft: '4px'
                        }}>
                            ${cartTotal.toFixed(2)}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}
