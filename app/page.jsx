"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../styles/responsive.css';

export default function HomePage() {
    const router = useRouter();

    return (
        <div>
            {/* Banner Section */}
            <section
                className="banner-section"
                style={{
                    height: 'clamp(300px, 50vw, 500px)',
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
                <Image
                    src="/images/banner-packaging.jpg"
                    alt="Your Trusted Source for Packaging Supplies"
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                    priority
                    sizes="100vw"
                />
            </section>

            {/* About Section */}
            <section id="about-section" className="about-section">
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'center'
                }}>
                    {/* Left Content */}
                    <div>
                        <div style={{
                            background: 'var(--accent-yellow)',
                            color: 'var(--dark-black)',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            marginBottom: '20px',
                            display: 'inline-block'
                        }}>
                            ABOUT US
                        </div>
                        <h2 style={{
                            fontSize: '36px',
                            fontWeight: '800',
                            color: 'var(--dark-black)',
                            marginBottom: '24px'
                        }}>
                            L&S Plastics Supply
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--light-black)',
                            lineHeight: '1.7',
                            marginBottom: '24px'
                        }}>
                            Your trusted supplier of high-quality containers and plastic products.
                            We offer complete solutions for restaurants, food services, and businesses.
                        </p>
                        <button
                            onClick={() => router.push('/catalogo')}
                            className="view-products-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: 'auto'
                            }}
                        >
                            📋 VIEW CATALOG
                        </button>
                    </div>

                    {/* Right Content - Logo */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'var(--pure-white)',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '3px solid var(--accent-yellow)'
                    }}>
                        <Image
                            src="/L&S.jpg"
                            alt="L&S Plastics Supply Logo"
                            width={300}
                            height={200}
                            style={{
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="mission-vision-section">
                <div className="mission-vision-grid">
                    <div className="mission-card">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                        <h3>OUR MISSION</h3>
                        <p>
                            To provide the highest quality plastic products for the food industry,
                            ensuring our customers have access to reliable, safe, and efficient solutions
                            for their packaging and storage needs.
                        </p>
                    </div>
                    <div className="vision-card">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
                        <h3>OUR VISION</h3>
                        <p>
                            To be the leading company in plastic supplies for the food industry,
                            recognized for our innovation, exceptional quality, and commitment to
                            customer satisfaction and environmental care.
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section">
                <h2 className="section-title">OUR PRODUCTS</h2>
                <div className="products-grid">
                    <div className="product-card">
                        <Image
                            src="/Clip-Container.png"
                            alt="Clip Food Containers"
                            width={200}
                            height={200}
                            className="product-image"
                        />
                        <h3 className="product-title">Clip Food Containers</h3>
                        <p className="product-description">
                            Secure and durable containers for all your food storage needs.
                        </p>
                        <button
                            className="view-products-btn"
                            onClick={() => router.push('/tienda/categorias')}
                        >
                            VIEW PRODUCTS
                        </button>
                    </div>

                    <div className="product-card">
                        <Image
                            src="/Plastic-Tubs.png"
                            alt="Premium Plastic Tubs"
                            width={200}
                            height={200}
                            className="product-image"
                        />
                        <h3 className="product-title">Premium Plastic Tubs</h3>
                        <p className="product-description">
                            Versatile tubs for storage, catering, and food service.
                        </p>
                        <button
                            className="view-products-btn"
                            onClick={() => router.push('/tienda/categorias')}
                        >
                            VIEW PRODUCTS
                        </button>
                    </div>

                    <div className="product-card">
                        <Image
                            src="/Multi-Use-Containers.png"
                            alt="Multi-Use Containers"
                            width={200}
                            height={200}
                            className="product-image"
                        />
                        <h3 className="product-title">Multi-Use Containers</h3>
                        <p className="product-description">
                            Ideal for delivery services and organizing food items.
                        </p>
                        <button
                            className="view-products-btn"
                            onClick={() => router.push('/tienda/categorias')}
                        >
                            VIEW PRODUCTS
                        </button>
                    </div>
                </div>
            </section>

            {/* Customer Testimonials */}
            <section className="testimonials-section">
                <h2 className="section-title">⭐ CUSTOMER TESTIMONIALS</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "With L&S Plastics Supply I found exactly what I was looking for: resistant, practical products at
                            an excellent price. They also always deliver on time, something I value tremendously for my
                            catering business."
                        </p>
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--primary-blue)' }}>Maria Gonzalez</div>
                            <div style={{ fontSize: '12px', color: 'var(--light-black)' }}>Professional Catering Entrepreneur</div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "Before, it was hard for me to find a supplier who really delivered what they promised. Since
                            working with L&S Plastics, I have the security that I will never run out of the quality supplies I
                            need for my restaurant."
                        </p>
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--primary-blue)' }}>Andrés Pérez</div>
                            <div style={{ fontSize: '12px', color: 'var(--light-black)' }}>Restaurant Owner & Chef</div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "I ordered by recommendation and I was truly delighted. The customer service was very
                            cordial and professional, and the products arrived quickly and in excellent condition. I will
                            definitely continue as a loyal customer!"
                        </p>
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--primary-blue)' }}>Carolina Vásquez</div>
                            <div style={{ fontSize: '12px', color: 'var(--light-black)' }}>Event Planning Specialist</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}