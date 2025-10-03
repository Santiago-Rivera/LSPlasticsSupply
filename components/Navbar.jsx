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
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Handle preview item clicks
    const handlePreviewItemClick = (type, index) => {
        setActivePreview(null); // Close preview

        if (type === 'about') {
            switch (index) {
                case 0: // Mission
                case 1: // Vision
                    if (typeof window !== 'undefined' && window.location.pathname === '/') {
                        const aboutSection = document.getElementById('about-section');
                        if (aboutSection) {
                            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    } else {
                        router.push('/#about-section');
                    }
                    break;
                case 2: // Contact
                    if (typeof window !== 'undefined') {
                        window.location.href = 'tel:908-708-5425';
                    }
                    break;
                case 3: // Trusted services
                    if (typeof window !== 'undefined' && window.location.pathname === '/') {
                        const testimonialsSection = document.querySelector('.testimonials-section');
                        if (testimonialsSection) {
                            testimonialsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    } else {
                        router.push('/#testimonials');
                    }
                    break;
            }
        } else if (type === 'categories') {
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
        } else if (type === 'products') {
            const productSearches = {
                0: 'clip food containers',
                1: 'plastic tubs',
                2: 'multi-use containers',
                3: 'half size aluminum',
                4: 'round aluminum',
                5: 'custom solutions'
            };
            if (productSearches[index]) {
                router.push(`/productos?search=${encodeURIComponent(productSearches[index])}`);
            } else {
                router.push('/productos');
            }
        }
    };

    const cartItemCount = getCartItemCount();
    const cartTotal = getCartTotal();

    // Preview content data with navigation info
    const previewContent = {
        about: {
            title: "About L&S Plastics",
            content: [
                { text: "🎯 Mission: Provide high-quality plastic products for the food industry", clickable: true },
                { text: "🚀 Vision: Leading supplier recognized for innovation and quality", clickable: true },
                { text: "📞 Contact: 908-708-5425", clickable: true },
                { text: "🏆 Trusted by restaurants and food services", clickable: true }
            ]
        },
        categories: {
            title: "Product Categories",
            content: [
                { text: "📦 Aluminum Containers - Various sizes and depths", clickable: true },
                { text: "🥡 Plastic Containers - Durable food storage solutions", clickable: true },
                { text: "🛍️ Paper Bags - Eco-friendly packaging options", clickable: true },
                { text: "🧻 Napkins & Paper Towels - Essential supplies", clickable: true },
                { text: "🍜 Soup Containers - Perfect for liquids", clickable: true },
                { text: "✨ Accessories - Complete your setup", clickable: true }
            ]
        },
        products: {
            title: "Featured Products",
            content: [
                { text: "🥡 Clip Food Containers - Secure storage solutions", clickable: true },
                { text: "📦 Premium Plastic Tubs - Versatile containers", clickable: true },
                { text: "🍱 Multi-Use Containers - Perfect for delivery", clickable: true },
                { text: "🔄 Half Size Aluminum - Various depths available", clickable: true },
                { text: "⭕ Round Aluminum Containers - 8' & 9' sizes", clickable: true },
                { text: "🎯 Custom Solutions - Tailored to your needs", clickable: true }
            ]
        }
    };

    return (
        <div className="navbar-container">
            {/* Main navbar with logo, search, and cart */}
            <nav className="navbar-main">
                {/* Logo section */}
                <div className="navbar-logo">
                    <Link href="/" className="navbar-logo-link">
                        <Image
                            src={"/L&S.jpg"}
                            alt={"L&S Plastics Logo"}
                            width={40}
                            height={40}
                            className="navbar-logo-image"
                        />
                        <span className="navbar-logo-text">L&S Plastics</span>
                    </Link>
                </div>

                {/* Search bar (desktop) */}
                <div className="navbar-search">
                    <form onSubmit={handleSearch} className="navbar-search-form">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="navbar-search-input"
                        />
                        <button type="submit" style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: 'var(--primary-blue)',
                            fontSize: '16px'
                        }}>
                            🔍
                        </button>
                    </form>
                </div>

                {/* Cart button */}
                <button onClick={() => setIsOpen(true)} className="navbar-cart">
                    <span style={{ fontSize: '20px' }}>🛒</span>
                    {cartItemCount > 0 && (
                        <span className="navbar-cart-badge">{cartItemCount}</span>
                    )}
                    <span className="navbar-cart-total">${cartTotal.toFixed(2)}</span>
                </button>
            </nav>

            {/* Navigation Links Section with Previews */}
            <nav className="navbar-secondary">
                <div className="navbar-links">
                    <div 
                        className="navbar-link-container"
                        onMouseEnter={() => setActivePreview('about')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <Link href="/#about-section" className="navbar-link" onClick={handleAboutClick}>
                            📖 About
                        </Link>
                        {activePreview === 'about' && (
                            <div className="navbar-preview">
                                <h4 className="preview-title">{previewContent.about.title}</h4>
                                <ul className="preview-list">
                                    {previewContent.about.content.map((item, index) => (
                                        <li
                                            key={index}
                                            className={`preview-item ${item.clickable ? 'preview-item-clickable' : ''}`}
                                            onClick={() => item.clickable && handlePreviewItemClick('about', index)}
                                        >
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div 
                        className="navbar-link-container"
                        onMouseEnter={() => setActivePreview('categories')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <Link href="/tienda/categorias" className="navbar-link">
                            📂 Categories
                        </Link>
                        {activePreview === 'categories' && (
                            <div className="navbar-preview">
                                <h4 className="preview-title">{previewContent.categories.title}</h4>
                                <ul className="preview-list">
                                    {previewContent.categories.content.map((item, index) => (
                                        <li
                                            key={index}
                                            className={`preview-item ${item.clickable ? 'preview-item-clickable' : ''}`}
                                            onClick={() => item.clickable && handlePreviewItemClick('categories', index)}
                                        >
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div 
                        className="navbar-link-container"
                        onMouseEnter={() => setActivePreview('products')}
                        onMouseLeave={() => setActivePreview(null)}
                    >
                        <Link href="/productos" className="navbar-link">
                            📦 Products
                        </Link>
                        {activePreview === 'products' && (
                            <div className="navbar-preview">
                                <h4 className="preview-title">{previewContent.products.title}</h4>
                                <ul className="preview-list">
                                    {previewContent.products.content.map((item, index) => (
                                        <li
                                            key={index}
                                            className={`preview-item ${item.clickable ? 'preview-item-clickable' : ''}`}
                                            onClick={() => item.clickable && handlePreviewItemClick('products', index)}
                                        >
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
