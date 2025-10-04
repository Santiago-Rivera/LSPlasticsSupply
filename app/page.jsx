"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../styles/responsive.css';

export default function HomePage() {
    const router = useRouter();

    const productCategories = [
        {
            title: 'Clip Food Containers',
            description: 'Secure and durable containers for all your food storage needs.',
            icon: '🥡',
            image: '/Clip-Container.png',
            link: '/productos?search=clip%20food%20containers'
        },
        {
            title: 'Premium Plastic Tubs',
            description: 'Versatile tubs for storage, catering, and food service.',
            icon: '📦',
            image: '/Plastic-Tubs.png',
            link: '/productos?search=premium%20plastic%20tubs'
        },
        {
            title: 'Multi-Use Containers',
            description: 'Ideal for delivery services and organizing food items.',
            icon: '🍱',
            image: '/Multi-Use-Containers.png',
            link: '/productos?search=multi%20use%20containers'
        }
    ];

    const categories = [
        {
            name: 'Aluminum Containers',
            icon: '🥄',
            description: 'Durable aluminum containers for food storage',
            link: '/tienda/categorias/aluminum-containers'
        },
        {
            name: 'Plastic Containers',
            icon: '🥡',
            description: 'Versatile plastic containers for all needs',
            link: '/tienda/categorias/plastic-containers'
        },
        {
            name: 'Paper Bags',
            icon: '🛍️',
            description: 'Eco-friendly paper bags for packaging',
            link: '/tienda/categorias/paper-bags'
        },
        {
            name: 'Napkins & Paper Towels',
            icon: '📋',
            description: 'Essential paper products for dining',
            link: '/tienda/categorias/napkins-paper-towels'
        },
        {
            name: 'Soup Containers',
            icon: '🍲',
            description: 'Leak-proof containers for liquids',
            link: '/tienda/categorias/soup-containers'
        },
        {
            name: 'Soufflé Cups & Lids',
            icon: '🥤',
            description: 'Small portion containers with lids',
            link: '/tienda/categorias/souffle-cups-lids'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
        }}>
            {/* Banner Section */}
            <section className="banner-section" style={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '4px solid #fbbf24'
            }}>
                <Image
                    src="/images/banner-packaging.jpg"
                    alt="Your Trusted Source for Packaging Supplies"
                    width={1400}
                    height={600}
                    style={{
                        width: '100%',
                        height: 'clamp(300px, 40vw, 600px)',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                    priority
                />

                {/* Banner Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(59, 130, 246, 0.6) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'clamp(20px, 5vw, 40px)'
                }}>
                    <div style={{
                        textAlign: 'center',
                        color: '#ffffff',
                        maxWidth: '800px'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(32px, 8vw, 56px)',
                            fontWeight: '800',
                            margin: '0 0 24px 0',
                            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            lineHeight: 1.1
                        }}>
                            Your Trusted Source for Premium Packaging
                        </h1>
                        <p style={{
                            fontSize: 'clamp(16px, 4vw, 24px)',
                            margin: '0 0 32px 0',
                            fontWeight: '500',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            opacity: 0.95
                        }}>
                            Quality plastic supplies, containers, and food service solutions
                        </p>
                        <button
                            onClick={() => router.push('/tienda/categorias')}
                            style={{
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                color: '#111827',
                                padding: 'clamp(14px, 3vw, 18px) clamp(28px, 6vw, 40px)',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: 'clamp(16px, 4vw, 20px)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                                e.target.style.boxShadow = '0 12px 32px rgba(251, 191, 36, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 8px 24px rgba(251, 191, 36, 0.3)';
                            }}
                        >
                            🛍️ Shop Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section style={{
                padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: 'clamp(40px, 8vw, 60px)'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(28px, 6vw, 40px)',
                        fontWeight: '800',
                        color: '#1e3a8a',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        📦 Featured Products
                    </h2>
                    <p style={{
                        fontSize: 'clamp(16px, 4vw, 20px)',
                        color: '#6b7280',
                        margin: 0,
                        fontWeight: '500'
                    }}>
                        Discover our most popular packaging solutions
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 30vw, 350px), 1fr))',
                    gap: 'clamp(24px, 5vw, 40px)'
                }}>
                    {productCategories.map((category, index) => (
                        <div
                            key={index}
                            onClick={() => router.push(category.link)}
                            style={{
                                background: '#ffffff',
                                borderRadius: '20px',
                                padding: 'clamp(24px, 5vw, 32px)',
                                textAlign: 'center',
                                boxShadow: '0 10px 30px rgba(30, 58, 138, 0.1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: '3px solid #e5e7eb',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(30, 58, 138, 0.2)';
                                e.currentTarget.style.borderColor = '#fbbf24';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(30, 58, 138, 0.1)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            {/* Product accent line */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                            }}></div>

                            {/* Product Image */}
                            <div style={{
                                width: '100%',
                                height: 'clamp(180px, 20vw, 220px)',
                                position: 'relative',
                                marginBottom: 'clamp(20px, 4vw, 24px)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                background: '#f8fafc'
                            }}>
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    style={{
                                        objectFit: 'contain',
                                        padding: '10px'
                                    }}
                                />
                            </div>

                            {/* Product Info */}
                            <div style={{
                                fontSize: 'clamp(32px, 8vw, 48px)',
                                marginBottom: 'clamp(16px, 3vw, 20px)'
                            }}>
                                {category.icon}
                            </div>

                            <h3 style={{
                                fontSize: 'clamp(18px, 4vw, 22px)',
                                fontWeight: '700',
                                color: '#1e3a8a',
                                margin: '0 0 12px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {category.title}
                            </h3>

                            <p style={{
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                color: '#6b7280',
                                lineHeight: 1.6,
                                margin: '0 0 24px 0',
                                fontWeight: '500'
                            }}>
                                {category.description}
                            </p>

                            <div style={{
                                background: '#fbbf24',
                                color: '#111827',
                                padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)',
                                borderRadius: '8px',
                                fontSize: 'clamp(12px, 3vw, 14px)',
                                fontWeight: '700',
                                display: 'inline-block',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                🔍 View Products
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)',
                color: '#ffffff'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: 'clamp(40px, 8vw, 60px)'
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(28px, 6vw, 40px)',
                            fontWeight: '800',
                            margin: '0 0 16px 0',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            📂 Shop by Category
                        </h2>
                        <p style={{
                            fontSize: 'clamp(16px, 4vw, 20px)',
                            color: '#fbbf24',
                            margin: 0,
                            fontWeight: '600'
                        }}>
                            Find exactly what you need for your business
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 25vw, 300px), 1fr))',
                        gap: 'clamp(20px, 4vw, 30px)'
                    }}>
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => router.push(category.link)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: 'clamp(20px, 4vw, 28px)',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = '#fbbf24';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                            >
                                <div style={{
                                    fontSize: 'clamp(32px, 8vw, 48px)',
                                    marginBottom: 'clamp(12px, 3vw, 16px)'
                                }}>
                                    {category.icon}
                                </div>
                                <h3 style={{
                                    fontSize: 'clamp(16px, 4vw, 18px)',
                                    fontWeight: '700',
                                    margin: '0 0 8px 0',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {category.name}
                                </h3>
                                <p style={{
                                    fontSize: 'clamp(12px, 3vw, 14px)',
                                    color: '#e5e7eb',
                                    margin: 0,
                                    fontWeight: '500'
                                }}>
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about-section" style={{
                padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                    gap: 'clamp(30px, 6vw, 60px)',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: 'clamp(28px, 6vw, 40px)',
                            fontWeight: '800',
                            color: '#1e3a8a',
                            margin: '0 0 24px 0',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            ℹ️ About L&S Plastics
                        </h2>
                        <p style={{
                            fontSize: 'clamp(16px, 4vw, 18px)',
                            color: '#4b5563',
                            lineHeight: 1.7,
                            margin: '0 0 20px 0',
                            fontWeight: '500'
                        }}>
                            Leading supplier of quality plastic products for the food service industry.
                            We provide premium packaging solutions that help businesses serve their customers better.
                        </p>
                        <p style={{
                            fontSize: 'clamp(16px, 4vw, 18px)',
                            color: '#4b5563',
                            lineHeight: 1.7,
                            margin: '0 0 32px 0',
                            fontWeight: '500'
                        }}>
                            From durable food containers to eco-friendly packaging, we offer comprehensive
                            solutions for restaurants, catering services, and food distributors.
                        </p>
                        <div style={{
                            background: '#fbbf24',
                            color: '#111827',
                            padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 24px)',
                            borderRadius: '12px',
                            fontSize: 'clamp(16px, 4vw, 18px)',
                            fontWeight: '700',
                            display: 'inline-block',
                            textDecoration: 'none'
                        }}>
                            📞 Contact: 908-708-5425
                        </div>
                    </div>
                    <div style={{
                        position: 'relative',
                        height: 'clamp(250px, 30vw, 400px)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)'
                    }}>
                        <Image
                            src="/L&S.jpg"
                            alt="L&S Plastics - Quality Supplies"
                            fill
                            style={{
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}