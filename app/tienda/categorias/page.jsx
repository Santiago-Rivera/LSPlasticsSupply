"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const categories = [
        { name: "Aluminum Containers", href: "/tienda/categorias/aluminum-containers" },
        { name: "Disposable Containers", href: "/tienda/categorias/disposable-containers" },
        { name: "Soup Containers", href: "/tienda/categorias/soup-containers" },
        { name: "Plastic Containers", href: "/tienda/categorias/plastic-containers" },
        { name: "Paper Bags", href: "/tienda/categorias/paper-bags" },
        { name: "Napkins and Paper Towels", href: "/tienda/categorias/napkins-paper-towels" },
        { name: "Accessories", href: "/tienda/categorias/accessories" },
        { name: "Plastic", href: "/tienda/categorias/plastic" }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            padding: '60px 40px'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '60px'
                }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        textAlign: 'center',
                        marginBottom: '40px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        letterSpacing: '-0.01em'
                    }}>
                        Categories
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Explore our complete range of plastic supply solutions organized by product lines
                    </p>
                </div>

                {/* Categories List */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    {categories.map((category, index) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            style={{ textDecoration: 'none' }}
                        >
                            <div style={{
                                padding: '24px 32px',
                                borderBottom: index < categories.length - 1 ? '1px solid #e9ecef' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.transform = 'translateX(8px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        fontSize: '18px',
                                        marginRight: '16px',
                                        color: '#4a5568'
                                    }}>
                                        ▶
                                    </span>
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#2c3e50'
                                    }}>
                                        {category.name}
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: '20px',
                                    color: '#666',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Back Navigation */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px'
                }}>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#4a5568',
                            padding: '12px 24px',
                            border: '2px solid #4a5568',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#4a5568';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#4a5568';
                        }}>
                        ← BACK TO HOME
                    </button>
                </div>
            </div>
        </div>
    );
}