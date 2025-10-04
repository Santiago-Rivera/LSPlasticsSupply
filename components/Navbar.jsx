"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const { getCartItemCount, getCartTotal, setIsOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [activePreview, setActivePreview] = useState(null);

    const handleAboutClick = (e) => {
        e.preventDefault();
        try {
            // If we're already on the main page, scroll to the section
            if (typeof window !== 'undefined' && window.location.pathname === '/') {
                const aboutSection = document.getElementById('about-section');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            } else {
                // If we're on another page, navigate to main and then scroll
                router.push('/#about-section');
            }
        } catch (error) {
            console.error('Error navigating to about section:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        try {
            if (searchQuery.trim()) {
                router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
    };

    // Handle preview item clicks
    const handleCategoryClick = (index) => {
        try {
            setActivePreview(null);
            const categoryRoutes = {
                0: '/tienda/categorias/aluminum-containers',
                1: '/tienda/categorias/plastic-containers',
                2: '/tienda/categorias/paper-bags',
                3: '/tienda/categorias/napkins-paper-towels',
                4: '/tienda/categorias/soup-containers',
                5: '/tienda/categorias/accessories'
            };

            if (categoryRoutes[index]) {
                router.push(categoryRoutes[index]);
            } else {
                router.push('/tienda/categorias');
            }
        } catch (error) {
            console.error('Error navigating to category:', error);
        }
    };

    const cartItemCount = getCartItemCount();
    const cartTotal = getCartTotal();

    return (
        <div className="navbar-container">
            {/* Main navbar with logo, search, and cart */}
            <nav className="navbar-main">
                {/* Logo section */}
                <div className="navbar-logo">
                    <Link href="/" className="navbar-logo-link">
                        <Image
                            src="/L&S.jpg"
                            alt="L&S Plastics Logo"
                            width={40}
                            height={40}
                            style={{ borderRadius: '50%' }}
                        />
                        <span className="navbar-brand">L&S Plastics Supply</span>
                    </Link>
                </div>

                {/* Search section */}
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

                {/* Cart section */}
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

            {/* Secondary navigation menu */}
            <nav className="navbar-secondary">
                <div className="nav-links">
                    <Link href="/" className="nav-link">
                        🏠 HOME
                    </Link>

                    <div
                        className="nav-dropdown"
                        onMouseEnter={() => setActivePreview('about')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <button
                            onClick={handleAboutClick}
                            className="nav-link dropdown-trigger"
                        >
                            ℹ️ ABOUT
                        </button>

                        {activePreview === 'about' && (
                            <div className="nav-preview">
                                <h4>About L&S Plastics</h4>
                                <p>Leading supplier of quality plastic products for food service industry</p>
                                <small>📞 Contact: 908-708-5425</small>
                            </div>
                        )}
                    </div>

                    <div 
                        className="nav-dropdown"
                        onMouseEnter={() => setActivePreview('categories')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <Link href="/tienda/categorias" className="nav-link dropdown-trigger">
                            📂 CATEGORIES
                        </Link>

                        {activePreview === 'categories' && (
                            <div className="nav-preview">
                                <h4>Product Categories</h4>
                                <div className="preview-grid">
                                    <button onClick={() => handleCategoryClick(0)} className="preview-item">
                                        🥄 Aluminum Containers
                                    </button>
                                    <button onClick={() => handleCategoryClick(1)} className="preview-item">
                                        🥡 Plastic Containers
                                    </button>
                                    <button onClick={() => handleCategoryClick(2)} className="preview-item">
                                        🛍️ Paper Bags
                                    </button>
                                    <button onClick={() => handleCategoryClick(3)} className="preview-item">
                                        📋 Napkins & Towels
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div 
                        className="nav-dropdown"
                        onMouseEnter={() => setActivePreview('products')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <Link href="/productos" className="nav-link dropdown-trigger">
                            📦 PRODUCTS
                        </Link>

                        {activePreview === 'products' && (
                            <div className="nav-preview">
                                <h4>Featured Products</h4>
                                <div className="preview-grid">
                                    <div className="preview-item">
                                        📦 Clip Food Containers
                                    </div>
                                    <div className="preview-item">
                                        🥡 Premium Plastic Tubs
                                    </div>
                                    <div className="preview-item">
                                        📦 Multi-Use Containers
                                    </div>
                                    <div className="preview-item">
                                        🥄 Aluminum Containers
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/tienda" className="nav-link">
                        🛍️ SHOP
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
