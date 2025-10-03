"use client";
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import '../styles/responsive.css';

export default function HomePage() {
    const router = useRouter();

    const productCategories = [
        {
            title: 'Clip Food Containers',
            description: 'Secure and durable containers for all your food storage needs.',
            icon: '🥡',
            image: '/Clip-Container.png',
            link: '/tienda/categorias'
        },
        {
            title: 'Premium Plastic Tubs',
            description: 'Versatile tubs for storage, catering, and food service.',
            icon: '📦',
            image: '/Plastic-Tubs.png',
            link: '/tienda/categorias'
        },
        {
            title: 'Multi-Use Containers',
            description: 'Ideal for delivery services and organizing food items.',
            icon: '🍱',
            image: '/Multi-Use-Containers.png',
            link: '/tienda/categorias'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--off-white) 0%, var(--pure-white) 100%)',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
        }}>
            {/* Banner Section - Image Implementation */}
            <section className="banner-section" style={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '4px solid var(--accent-yellow)'
            }}>
                <Image
                    src="/images/banner-packaging.jpg"
                    alt="Your Trusted Source for Packaging Supplies"
                    width={1400}
                    height={600}
                    style={{
                        width: '100%',
                        height: 'auto',
                        minHeight: 'clamp(200px, 30vw, 400px)',
                        maxHeight: 'clamp(300px, 50vw, 600px)',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                    }}
                    priority
                />
            </section>

            {/* Hero Section */}
            <section className="hero-container">
                <div className="hero-content">
                    <span className="hero-about-label">About Us</span>
                    <h1 className="hero-title">L&S Plastics Supply</h1>
                    <p className="hero-description">
                        Your trusted supplier of high-quality containers and plastic products.
                        We offer complete solutions for restaurants, food services, and businesses.
                    </p>
                    <button
                        className="hero-button"
                        onClick={() => router.push('/tienda/categorias')}
                    >
                        <span>🛍️</span>
                        View Catalog
                    </button>
                </div>

                <div className="hero-logo">
                    <Image
                        src="/L&S.jpg"
                        alt="L&S Plastics Supply Logo"
                        width={400}
                        height={400}
                        className="hero-logo-image"
                    />
                </div>
            </section>

            {/* About Section */}
            <section id="about-section" className="mission-vision-section">
                <div className="mission-vision-container">
                    <div className="mission-vision-grid">
                        <div className="mission-card">
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
                            <h2 className="mission-title">Our Mission</h2>
                            <p className="mission-text">
                                To provide the highest quality plastic products for the food industry,
                                ensuring our customers have access to reliable, safe, and efficient solutions
                                for their packaging and storage needs.
                            </p>
                        </div>

                        <div className="vision-card">
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚀</div>
                            <h2 className="vision-title">Our Vision</h2>
                            <p className="vision-text">
                                To be the leading company in plastic supplies for the food industry,
                                recognized for our innovation, exceptional quality, and commitment
                                to customer satisfaction and environmental care.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Preview Section */}
            <section className="products-section">
                <div className="products-container">
                    <h2 className="products-title">Our Products</h2>
                    <div className="products-grid">
                        {productCategories.map((category) => (
                            <div key={category.title} className="product-card" onClick={() => router.push(category.link)}>
                                <div className="product-image-container">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        width={300}
                                        height={200}
                                        className="product-image"
                                    />
                                </div>
                                <h3 className="product-title">{category.title}</h3>
                                <p className="product-description">{category.description}</p>
                                <button className="product-button">View Products</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="testimonials-container">
                    <h2 className="testimonials-title">🌟 Customer Testimonials</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "With L&S Plastics Supply I found exactly what I was looking for: resistant, practical
                                products at an excellent price. They also always deliver on time, something I value
                                tremendously for my catering business."
                            </p>
                            <div className="testimonial-author">
                                <h4 className="testimonial-name">Maria González</h4>
                                <p className="testimonial-role">Professional Catering Entrepreneur</p>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "Before, it was hard for me to find a supplier who really delivered what they promised.
                                Since working with L&S Plastics, I have the security that I will never run out of the
                                quality supplies I need for my restaurant."
                            </p>
                            <div className="testimonial-author">
                                <h4 className="testimonial-name">Andrés Pérez</h4>
                                <p className="testimonial-role">Restaurant Owner & Chef</p>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "I ordered by recommendation and I was truly delighted. The customer service was very cordial and
                                professional, and the products arrived quickly and in excellent condition. I will definitely
                                continue as a loyal customer!"
                            </p>
                            <div className="testimonial-author">
                                <h4 className="testimonial-name">Carolina Vásquez</h4>
                                <p className="testimonial-role">Event Planning Specialist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}