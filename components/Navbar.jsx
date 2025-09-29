"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

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
                        color: '#030303',
                        fontFamily: 'Roboto, Arial, sans-serif'
                    }}>
                        L&S Plastics
                    </span>
                </Link>
            </div>

            {/* Navigation links */}
            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
                <Link href="/" style={{
                    color: '#030303',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Roboto, Arial, sans-serif',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                }}>
                    Home
                </Link>
                <button
                    onClick={handleAboutClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#030303',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: 'Roboto, Arial, sans-serif',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    About
                </button>
                <Link href="/tienda" style={{
                    color: '#030303',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Roboto, Arial, sans-serif',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                }}>
                    Store
                </Link>
            </div>
        </nav>
    );
}
