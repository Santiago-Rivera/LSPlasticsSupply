"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../styles/responsive.css';

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="page-container">
            {/* Banner Section */}
            <section className="banner-section">
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
            <section className="about-section">
                <div className="about-container">
                    {/* Left Content */}
                    <div className="about-content">
                        <div className="about-badge">
                            ABOUT US
                        </div>
                        <h2 className="about-title">
                            L&S Plastics Supply
                        </h2>
                        <p className="about-description">
                            Your trusted supplier of high-quality containers and plastic products.
                            We offer complete solutions for restaurants, food services, and businesses.
                        </p>
                        <button
                            onClick={() => router.push('/catalogo')}
                            className="view-products-btn"
                        >
                            📋 VIEW PRODUCTS
                        </button>
                    </div>

                    {/* Right Content - Logo */}
                    <div className="about-logo">
                        <Image
                            src="/L&S.jpg"
                            alt="L&S Plastics Supply Logo"
                            width={300}
                            height={200}
                            className="logo-image"
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="mission-vision-section">
                <div className="mission-vision-grid">
                    <div className="mission-card">
                        <div className="card-icon">🎯</div>
                        <h3>OUR MISSION</h3>
                        <p>
                            To provide the highest quality plastic products for the food industry,
                            ensuring our customers have access to reliable, safe, and efficient solutions
                            for their packaging and storage needs.
                        </p>
                        <div className="mission-details">
                            <h4>What We Do:</h4>
                            <ul>
                                <li>🥡 Premium food containers and packaging solutions</li>
                                <li>🛍️ Eco-friendly plastic bags and shopping solutions</li>
                                <li>🥤 Disposable cups, lids, and beverage accessories</li>
                                <li>🍴 Cutlery and dining accessories for food service</li>
                                <li>📦 Bulk packaging solutions for restaurants and retailers</li>
                            </ul>
                            <h4>Our Commitment:</h4>
                            <p>
                                We are dedicated to maintaining the highest standards of food safety,
                                ensuring all our products meet FDA regulations and industry best practices.
                                Our team works tirelessly to provide competitive pricing without
                                compromising on quality.
                            </p>
                        </div>
                    </div>
                    <div className="vision-card">
                        <div className="card-icon">🚀</div>
                        <h3>OUR VISION</h3>
                        <p>
                            To be the leading company in plastic supplies for the food industry,
                            recognized for our innovation, exceptional quality, and commitment to
                            customer satisfaction and environmental care.
                        </p>
                        <div className="vision-details">
                            <h4>Our Goals:</h4>
                            <ul>
                                <li>🌱 Sustainable packaging solutions for a greener future</li>
                                <li>⭐ Industry-leading customer service and support</li>
                                <li>🔬 Continuous innovation in product design and materials</li>
                                <li>🤝 Building long-term partnerships with our clients</li>
                                <li>🌍 Expanding our reach across North America</li>
                            </ul>
                            <h4>Why Choose L&S Plastics:</h4>
                            <p>
                                With over a decade of experience in the industry, we understand
                                the unique challenges facing food service businesses. Our extensive
                                inventory, competitive pricing, and reliable delivery make us the
                                trusted partner for restaurants, cafes, and food retailers nationwide.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section">
                <h2 className="section-title">OUR PRODUCTS</h2>
                <div className="products-grid">
                    <div className="product-card">
                        <Image
                            src="/1-6-plastic-shopping-bags-flower-400pcs-copia.png"
                            alt="1/6 Plastic Shopping Bags Flower 400pcs"
                            width={200}
                            height={200}
                            className="product-image"
                        />
                        <h3 className="product-title">1/6 Plastic Shopping Bags Flower 400pcs</h3>
                        <p className="product-description">
                            Plastic shopping bag with floral design and "Thank You" print, size 1/6, pack of 400
                        </p>
                    </div>

                    <div className="product-card">
                        <Image
                            src="/Half_size_shallow_copia.png"
                            alt="Half size shallow"
                            width={200}
                            height={200}
                            className="product-image"
                        />
                        <h3 className="product-title">Half Size Shallow Aluminum Tray</h3>
                        <p className="product-description">
                            Medium-sized aluminum tray, shallow depth, ideal for individual portions or side dishes.
                        </p>
                    </div>

                    <div className="product-card">
                        <Image
                            src="/full_size_heavy_knife_white_box_of_1000pcs-copia.png"
                            alt="Full size heavy knife white box of 1000pcs"
                            width={200}
                            height={200}
                            className="product-image"
                        />
                        <h3 className="product-title">Full Size Heavy Duty White Knife (1000pcs)</h3>
                        <p className="product-description">
                            Full-size disposable white knife with heavy-duty construction and high resistance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Customer Testimonials */}
            <section className="testimonials-section">
                <h2 className="section-title">⭐ CUSTOMER TESTIMONIALS</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "With L&S Plastics Supply I found exactly what I was looking for: durable and practical products at an
                            excellent price. They also always meet delivery times, something I value immensely for my
                            catering business."
                        </p>
                        <div>
                            <div className="testimonial-author">Maria González</div>
                            <div className="testimonial-role">Professional Catering Entrepreneur</div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "Before, I had trouble finding a supplier who really delivered what they promised. Since I've been
                            working with L&S Plastics, I have the security that I'll never run out of the quality supplies I
                            need for my restaurant."
                        </p>
                        <div>
                            <div className="testimonial-author">Andrés Pérez</div>
                            <div className="testimonial-role">Restaurant Owner & Chef</div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "I placed an order by recommendation and was really delighted. The customer service was very
                            cordial and professional, and the products arrived quickly and in excellent condition. I will definitely
                            continue being a loyal customer."
                        </p>
                        <div>
                            <div className="testimonial-author">Carolina Vásquez</div>
                            <div className="testimonial-role">Event Planning Specialist</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}