"use client";
import Image from 'next/image';
import {useRouter} from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    const handleCategoriesClick = () => {
        router.push('/tienda/categorias');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
        }}>
            {/* Hero Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '60px 40px',
                gap: '60px'
            }}>
                {/* Left side - Logo */}
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {/* Logo */}
                    <div style={{
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <Image
                            src="/L&S.jpg"
                            alt="L&S Plastics Logo"
                            width={400}
                            height={400}
                            style={{
                                objectFit: 'contain',
                                borderRadius: '15px',
                                backgroundColor: 'white',
                                padding: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>
                </div>

                {/* Right side - Content */}
                <div id="about-section" style={{
                    padding: '20px 0'
                }}>
                    <div style={{
                        marginBottom: '16px'
                    }}>
                        <span style={{
                            fontSize: '16px',
                            color: '#666',
                            fontWeight: '500',
                            letterSpacing: '0.5px'
                        }}>
                            About
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        margin: '0 0 32px 0',
                        lineHeight: '1.2',
                        letterSpacing: '-0.02em'
                    }}>
                        L&S Plastics
                    </h1>

                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.8',
                        color: '#666',
                        marginBottom: '40px',
                        maxWidth: '500px'
                    }}>
                        At Plastics Supply L&S, we believe that the little details make a difference. We are a business
                        dedicated to selling quality plastic supplies, designed for businesses, events, and everyday
                        life. We are driven by the idea of offering practical, affordable, and reliable products, always
                        with a friendly and honest approach towards our customers.
                    </p>

                    <button
                        onClick={handleCategoriesClick}
                        style={{
                            backgroundColor: '#4a5568',
                            color: 'white',
                            padding: '16px 32px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '16px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2d3748';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(74, 85, 104, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#4a5568';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}>
                        🛒 view categories
                    </button>
                </div>
            </div>

            {/* Products Section - EMPAQUES */}
            <div style={{
                backgroundColor: 'white',
                padding: '80px 40px',
                marginTop: '0'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        textAlign: 'center',
                        marginBottom: '24px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        letterSpacing: '-0.01em'
                    }}>
                        PACKAGING
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px'
                    }}>
                        {/* Viandas Clip */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            padding: '32px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                marginBottom: '16px'
                            }}>
                                Clip Food Containers
                            </h3>
                            <p style={{
                                fontSize: '16px',
                                color: '#666',
                                lineHeight: '1.6',
                                marginBottom: '24px'
                            }}>
                                We have the best food containers, designed for handling takeaway meals...
                            </p>
                            <button style={{
                                backgroundColor: '#3b4a6b',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginBottom: '24px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b4a6b'}
                            onClick={() => router.push('/tienda/categorias')}>
                                SEE MORE →
                            </button>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px'
                            }}>
                                <Image
                                    src="/viandas-clip.png"
                                    alt="Viandas Clip"
                                    width={250}
                                    height={180}
                                    style={{
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '250px',
                                height: '180px',
                                backgroundColor: '#e9ecef',
                                borderRadius: '8px',
                                color: '#6c757d'
                            }}>
                                🥡 Clip Food Containers
                            </div>
                            </div>
                        </div>

                        {/* Tarrinas Plomas */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            padding: '32px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                marginBottom: '16px'
                            }}>
                                Plastic Tubs
                            </h3>
                            <p style={{
                                fontSize: '16px',
                                color: '#666',
                                lineHeight: '1.6',
                                marginBottom: '24px'
                            }}>
                                We offer tubs for different uses and in various colors...
                            </p>
                            <button style={{
                                backgroundColor: '#3b4a6b',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginBottom: '24px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b4a6b'}
                            onClick={() => router.push('/tienda/categorias')}>
                                SEE MORE →
                            </button>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px'
                            }}>
                                <Image
                                    src="/tarrinas-plomas.png"
                                    alt="Tarrinas Plomas"
                                    width={250}
                                    height={180}
                                    style={{
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '250px',
                                    height: '180px',
                                    backgroundColor: '#e9ecef',
                                    borderRadius: '8px',
                                    color: '#6c757d'
                                }}>
                                    🥡 Plastic Tubs
                                </div>
                            </div>
                        </div>

                        {/* Envases Multiusos */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            padding: '32px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                marginBottom: '16px'
                            }}>
                                Multi-Use Containers
                            </h3>
                            <p style={{
                                fontSize: '16px',
                                color: '#666',
                                lineHeight: '1.6',
                                marginBottom: '24px'
                            }}>
                                2-3 division containers for delivery and many more uses...
                            </p>
                            <button style={{
                                backgroundColor: '#3b4a6b',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginBottom: '24px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b4a6b'}
                            onClick={() => router.push('/tienda/categorias')}>
                                SEE MORE →
                            </button>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px'
                            }}>
                                <Image
                                    src="/envases-multiusos.png"
                                    alt="Envases Multiusos"
                                    width={250}
                                    height={180}
                                    style={{
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '250px',
                                    height: '180px',
                                    backgroundColor: '#e9ecef',
                                    borderRadius: '8px',
                                    color: '#6c757d'
                                }}>
                                    📦 Multi-Use Containers
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission and Vision Section */}
            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '80px 40px',
                marginTop: '0'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                        gap: '60px',
                        alignItems: 'stretch'
                    }}>
                        {/* Misión */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '40px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                        }}>

                            <h3 style={{
                                fontSize: '28px',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '24px',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                letterSpacing: '-0.01em'
                            }}>
                                Mission
                            </h3>

                            <p style={{
                                fontSize: '16px',
                                lineHeight: '1.8',
                                color: '#666',
                                textAlign: 'left'
                            }}>
                                Our mission is to provide excellent quality plastic supplies, offering useful solutions for homes, businesses, and companies, accompanied by reliable and close service that generates trust in every purchase.
                            </p>
                        </div>

                        {/* Visión */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '40px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                        }}>

                            <h3 style={{
                                fontSize: '28px',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '24px',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                letterSpacing: '-0.01em'
                            }}>
                                Vision
                            </h3>

                            <p style={{
                                fontSize: '16px',
                                lineHeight: '1.8',
                                color: '#666',
                                textAlign: 'left'
                            }}>
                                Our vision is to become a reference in the distribution of plastic supplies, standing out for the quality of our products, customer satisfaction, and commitment to responsible consumption that contributes to a more sustainable future.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div style={{
                backgroundColor: 'white',
                padding: '80px 40px',
                marginTop: '0'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        textAlign: 'center',
                        marginBottom: '60px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        letterSpacing: '-0.01em'
                    }}>
                        Testimonials
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px'
                    }}>
                        {/* Testimonio 1 - María G. */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            borderLeft: '4px solid #4a5568'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}>
                            <p style={{
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#555',
                                marginBottom: '20px',
                                fontStyle: 'italic'
                            }}>
                                "With Plastics Supply L&S I found exactly what I was looking for: resistant, practical products at a good price. They also always deliver on time, something I value tremendously."
                            </p>
                            
                            <div style={{
                                borderTop: '1px solid #e9ecef',
                                paddingTop: '16px'
                            }}>
                                <h4 style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                    margin: '0 0 4px 0'
                                }}>
                                    María G.
                                </h4>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    margin: '0'
                                }}>
                                    Catering entrepreneur
                                </p>
                            </div>
                        </div>

                        {/* Testimonio 2 - Andrés P. */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            borderLeft: '4px solid #4a5568'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}>
                            <p style={{
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#555',
                                marginBottom: '20px',
                                fontStyle: 'italic'
                            }}>
                                "Before, it was hard for me to find a supplier who really delivered what they promised. Since working with them, I have the security that I will never run out of what I need."
                            </p>
                            
                            <div style={{
                                borderTop: '1px solid #e9ecef',
                                paddingTop: '16px'
                            }}>
                                <h4 style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                    margin: '0 0 4px 0'
                                }}>
                                    Andrés P.
                                </h4>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    margin: '0'
                                }}>
                                    Restaurant owner
                                </p>
                            </div>
                        </div>

                        {/* Testimonio 3 - Carolina V. */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            borderLeft: '4px solid #4a5568'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}>
                            <p style={{
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#555',
                                marginBottom: '20px',
                                fontStyle: 'italic'
                            }}>
                                "I ordered by recommendation and I was truly delighted. The service was very cordial and the products arrived quickly and in excellent condition. I will definitely buy again!"
                            </p>
                            
                            <div style={{
                                borderTop: '1px solid #e9ecef',
                                paddingTop: '16px'
                            }}>
                                <h4 style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                    margin: '0 0 4px 0'
                                }}>
                                    Carolina V.
                                </h4>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    margin: '0'
                                }}>
                                    Private customer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}