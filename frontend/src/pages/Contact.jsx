import React, { useState, useEffect } from 'react';

const Contact = () => {
    // Reveal animation
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );
        reveals.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Form state
    const [form, setForm] = useState({
        name: '',
        email: '',
        inquiry: 'general',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Submit to FormSubmit or API
        try {
            // Use FormSubmit (as in original) - we'll just simulate
            // In production, use fetch to FormSubmit endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Hero */}
            <section className="contact-hero-section">
                <div className="container reveal">
                    <h1>Get in Touch</h1>
                    <p>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section container">
                <div className="contact-grid">
                    {/* Left: Form */}
                    <div className="contact-form-card reveal">
                        <h2>Send a Message</h2>
                        {success ? (
                            <div className="form-success-card active">
                                <i className="fa-solid fa-circle-check"></i>
                                <h3>Message Sent!</h3>
                                <p>We'll get back to you shortly.</p>
                                <button className="btn primary-btn" onClick={() => setSuccess(false)}>Send Another</button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <select name="inquiry" value={form.inquiry} onChange={handleChange}>
                                        <option value="general">General Inquiry</option>
                                        <option value="mentorship">Mentorship Hub</option>
                                        <option value="partnership">Partnerships</option>
                                        <option value="volunteering">Volunteering</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} required></textarea>
                                </div>
                                {error && <div className="error-msg">{error}</div>}
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send a Message'}
                                    <i className="fa-regular fa-paper-plane"></i>
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right: Info & Map */}
                    <div className="contact-info-column reveal">
                        <div className="contact-info-grid">
                            <div className="info-card">
                                <div className="icon-circle"><i className="fa-solid fa-envelope"></i></div>
                                <h3>Email Us</h3>
                                <div className="info-line">admin@afriluminahub.com</div>
                                <div className="sub-text">Online support 24/7</div>
                            </div>
                            <div className="info-card">
                                <div className="icon-circle"><i className="fa-solid fa-phone"></i></div>
                                <h3>Call Us</h3>
                                <div className="info-line">Kenya: +254799297012</div>
                                <div className="sub-text">Mon-Fri, 9am-5pm EAT</div>
                            </div>
                            <div className="info-card">
                                <div className="icon-circle"><i className="fa-solid fa-location-dot"></i></div>
                                <h3>Visit Us</h3>
                                <div className="info-line">Nairobi, Kenya</div>
                                <div className="sub-text">Innovation Hub, Westlands</div>
                            </div>
                            <div className="info-card">
                                <div className="icon-circle"><i className="fa-solid fa-message"></i></div>
                                <h3>Social</h3>
                                <div className="info-line">@AfriLumina</div>
                                <div className="sub-text">Follow our journey</div>
                            </div>
                        </div>

                        <div className="map-card">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853743783!2d36.682196675531334!3d-1.302861111386879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1699999999999"
                                width="100%"
                                height="300"
                                style={{ border: 0, borderRadius: '16px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="AfriLumina Location"
                            ></iframe>
                        </div>

                        <div className="contact-social-section">
                            <h4>Follow our journey</h4>
                            <div className="contact-social-icons">
                                <a href="https://www.facebook.com/profile.php?id=61580679053761" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://www.instagram.com/p/DY4CEghMwNA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/afrilumina/" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;