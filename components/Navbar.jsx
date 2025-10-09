"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const { getCartItemCount, getCartTotal, setIsOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [activePreview, setActivePreview] = useState(null);

    const handleAboutClick = (e) => {
        e.preventDefault();
        if (typeof window !== 'undefined' && window.location.pathname === '/') {
            const aboutSection = document.getElementById('about-section');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
            router.push('/#about-section');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleCategoryClick = (index) => {
        setActivePreview(null);
        const categoryRoutes = {
            0: '/tienda/categorias/aluminum-containers',
            1: '/tienda/categorias/plastic-containers',
            2: '/tienda/categorias/paper-bags',
            3: '/tienda/categorias/napkins-paper-towels',
            4: '/tienda/categorias/plastic-containers-microwave',
            5: '/tienda/categorias/cutlery-accessories',
            6: '/tienda/categorias/soup-containers',
            7: '/tienda/categorias/disposable-containers',
            8: '/tienda/categorias/plastic-bags',
            9: '/tienda/categorias/cold-cups-lids',
            10: '/tienda/categorias/straws'
        };

        if (categoryRoutes[index]) {
            router.push(categoryRoutes[index]);
        } else {
            router.push('/tienda/categorias');
        }
    };

    const cartItemCount = getCartItemCount();
    const cartTotal = getCartTotal();

    return (
        <div className="navbar-container">
            {/* Main navbar */}
            <nav className="navbar-main">
                {/* Logo */}
                <div className="navbar-logo">
                    <Link href="/" className="navbar-logo-link">
                        <Image
                            src="/L&S.jpg"
                            alt="L&S Plastics Logo"
                            width={100}
                            height={100}
                            style={{ borderRadius: '50%' }}
                        />
                        <span className="navbar-brand">L&S Plastics</span>
                    </Link>
                </div>

                {/* Search */}
                <div className="navbar-search">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            🔍
                        </button>
                    </form>
                </div>

                {/* Cart */}
                <div className="navbar-cart">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="cart-button"
                    >
                        <span className="cart-icon">🛒</span>
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                        <span className="cart-total">${cartTotal.toFixed(2)}</span>
                    </button>
                </div>
            </nav>

            {/* Secondary navigation */}
            <nav className="navbar-secondary">
                <div className="nav-links">
                    <div
                        className="nav-dropdown"
                        onMouseEnter={() => setActivePreview('about')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <button
                            onClick={handleAboutClick}
                            className="nav-link"
                        >
                            ℹ️ ABOUT
                        </button>

                        {activePreview === 'about' && (
                            <div className="nav-preview">
                                <h4>About L&S Plastics</h4>
                                <p>Leading supplier of quality plastic products</p>
                                <small>📞 Contact: 908-708-5425</small>
                            </div>
                        )}
                    </div>

                    <div 
                        className="nav-dropdown"
                        onMouseEnter={() => setActivePreview('categories')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <Link href="/tienda/categorias" className="nav-link">
                            📂 CATEGORIES
                        </Link>

                        {activePreview === 'categories' && (
                            <div className="nav-preview">
                                <h4>Product Categories</h4>
                                <div className="preview-grid">
                                    <button onClick={() => handleCategoryClick(0)} className="preview-item">
                                        Aluminum Containers
                                    </button>
                                    <button onClick={() => handleCategoryClick(2)} className="preview-item">
                                        Paper Bags
                                    </button>
                                    <button onClick={() => handleCategoryClick(3)} className="preview-item">
                                        Napkins & Towels
                                    </button>
                                    <button onClick={() => handleCategoryClick(4)} className="preview-item">
                                        Plastic Containers (Microwave)
                                    </button>
                                    <button onClick={() => handleCategoryClick(5)} className="preview-item">
                                        Cutlery & Accessories
                                    </button>
                                    <button onClick={() => handleCategoryClick(6)} className="preview-item">
                                        Soup Containers
                                    </button>
                                    <button onClick={() => handleCategoryClick(7)} className="preview-item">
                                        Disposable Containers (Boxes)
                                    </button>
                                    <button onClick={() => handleCategoryClick(8)} className="preview-item">
                                        Plastic Bags
                                    </button>
                                    <button onClick={() => handleCategoryClick(9)} className="preview-item">
                                        Cold Cups & Lids
                                    </button>
                                    <button onClick={() => handleCategoryClick(10)} className="preview-item">
                                        Straws
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/productos" className="nav-link">
                        📦 PRODUCTS
                    </Link>
                </div>
            </nav>
        </div>
    );
}
