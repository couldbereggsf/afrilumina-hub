import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Modal component (internal)
const InvolvementModal = ({ isOpen, onClose, preSelectedRole, onSubmit }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        role: preSelectedRole || '',
        organization: '',
        website: '',
        resume: null,
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'resume') {
            setForm({ ...form, resume: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Simulate form submission (FormSubmit or API)
        // For now, we'll just save to localStorage and show success
        try {
            // Save to localStorage (mock)
            const registrations = JSON.parse(localStorage.getItem('afrilumina_registrations')) || [];
            const newReg = {
                id: 'reg_' + Date.now(),
                name: form.name,
                email: form.email,
                phone: form.phone,
                role: form.role,
                date: new Date().toISOString().slice(0, 10),
                status: 'pending',
                details: {
                    organization: form.organization,
                    website: form.website,
                    resume: form.resume ? form.resume.name : null,
                    message: form.message,
                },
            };
            registrations.push(newReg);
            localStorage.setItem('afrilumina_registrations', JSON.stringify(registrations));
            setSuccess(true);
            // Optionally submit to FormSubmit if needed
            // ...
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal active">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-card">
                <button className="close-modal-btn" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="modal-header">
                    <h2>Get Involved</h2>
                    <p>Tell us how you'd like to collaborate with AfriLumina.</p>
                </div>
                {success ? (
                    <div className="form-success-card active">
                        <i className="fa-solid fa-circle-check"></i>
                        <h3>Thank You!</h3>
                        <p>Your application has been submitted successfully. We'll be in touch soon.</p>
                        <button className="btn primary-btn" onClick={onClose}>Done</button>
                    </div>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name / Org Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Involvement Type</label>
                                <select name="role" value={form.role} onChange={handleChange} required>
                                    <option value="">Select how to get involved</option>
                                    <option value="mentor">Become a Mentor</option>
                                    <option value="partner">Partner with Us</option>
                                    <option value="volunteer">Volunteer</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Company / Organization <span className="optional">(Optional)</span></label>
                                <input type="text" name="organization" value={form.organization} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn / Website <span className="optional">(Optional)</span></label>
                                <input type="url" name="website" value={form.website} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Upload Resume / Profile <span className="required">* (.pdf, .doc, .docx - Max 5MB)</span></label>
                            <div className="file-dropzone">
                                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required />
                                <div className="file-dropzone-content">
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                    <span className="dropzone-title">Click to upload or drag and drop</span>
                                    <span className="dropzone-sub">PDF, DOC, or DOCX (Max 5MB)</span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>How can you support or why are you interested?</label>
                            <textarea name="message" value={form.message} onChange={handleChange} required></textarea>
                        </div>
                        {error && <div className="error-msg">{error}</div>}
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Inquiry'}
                            <i className="fa-regular fa-paper-plane"></i>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

// Main GetInvolved Component
const GetInvolved = () => {
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

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');

    const openModal = (role) => {
        setSelectedRole(role);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedRole('');
    };

    return (
        <div className="get-involved-page">
            {/* Hero */}
            <section className="get-involved-hero-section">
                <div className="container reveal">
                    <h1>Get Involved</h1>
                    <p>
                        Be part of shaping Africa's future. Join our community of mentors, partners, and volunteers.
                    </p>
                </div>
            </section>

            {/* Roles */}
            <section className="roles-section">
                <div className="container">
                    <div className="roles-grid reveal">
                        {/* Mentor */}
                        <div className="role-card" id="mentors">
                            <div className="icon-container"><i className="fa-solid fa-graduation-cap"></i></div>
                            <h3>Mentors</h3>
                            <p className="role-desc">Guide the next generation and share your professional experience.</p>
                            <ul className="role-bullets">
                                <li><i className="fa-solid fa-circle-check"></i> Flexible commitment</li>
                                <li><i className="fa-solid fa-circle-check"></i> Global network</li>
                                <li><i className="fa-solid fa-circle-check"></i> Direct impact</li>
                            </ul>
                            <button className="role-btn orange-role-btn" onClick={() => openModal('mentor')}>Become a Mentor</button>
                        </div>

                        {/* Partner */}
                        <div className="role-card" id="partners">
                            <div className="icon-container"><i className="fa-solid fa-handshake"></i></div>
                            <h3>Partners</h3>
                            <p className="role-desc">Collaborate with us to create customized sponsorship programs.</p>
                            <ul className="role-bullets">
                                <li><i className="fa-solid fa-circle-check"></i> Corporate sponsorship</li>
                                <li><i className="fa-solid fa-circle-check"></i> Talent pipeline</li>
                                <li><i className="fa-solid fa-circle-check"></i> Brand alignment</li>
                            </ul>
                            <button className="role-btn brown-role-btn" onClick={() => openModal('partner')}>Partner with Us</button>
                        </div>

                        {/* Volunteer */}
                        <div className="role-card" id="volunteers">
                            <div className="icon-container"><i className="fa-solid fa-heart"></i></div>
                            <h3>Volunteers</h3>
                            <p className="role-desc">Support our operations and help us run programs and events.</p>
                            <ul className="role-bullets">
                                <li><i className="fa-solid fa-circle-check"></i> Skill-based volunteering</li>
                                <li><i className="fa-solid fa-circle-check"></i> Community building</li>
                                <li><i className="fa-solid fa-circle-check"></i> Event support</li>
                            </ul>
                            <button className="role-btn orange-role-btn" onClick={() => openModal('volunteer')}>Join as a Volunteer</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ways to Contribute */}
            <section className="contribute-section">
                <div className="container">
                    <div className="section-header reveal">
                        <h2>Ways to Contribute</h2>
                        <p>Learn how you can help us empower African youth.</p>
                    </div>
                    <div className="contribute-grid reveal">
                        <div className="contribute-card"><h3>Host Workshops</h3><p>Run programs in design, coding, product development, or career preparation.</p></div>
                        <div className="contribute-card"><h3>Sponsor Programs</h3><p>Fund scholarships, technical bootcamps, and career hackathons.</p></div>
                        <div className="contribute-card"><h3>Provide Opportunities</h3><p>Connect our high-potential students with internships and entry-level listings.</p></div>
                        <div className="contribute-card"><h3>Donate Equipment</h3><p>Help supply laptops, tablets, and learning materials to students in need.</p></div>
                        <div className="contribute-card"><h3>Spread the Word</h3><p>Recommend AfriLumina to your professional network and share our story.</p></div>
                        <div className="contribute-card"><h3>Advisory Support</h3><p>Join our advisory board to help guide strategic growth and operations.</p></div>
                    </div>
                </div>
            </section>

            {/* Sponsorship Tiers */}
            <section className="sponsorship-section">
                <div className="container">
                    <div className="section-header reveal">
                        <h2>Sponsorship Tiers</h2>
                        <p>Support our mission at a scale that works for you.</p>
                    </div>
                    <div className="sponsorship-grid reveal">
                        {/* Bronze */}
                        <div className="sponsor-card">
                            <div className="icon-circle"><i className="fa-regular fa-star"></i></div>
                            <h3>Bronze Partner</h3>
                            <div className="price">$1,000 <span>/ annually</span></div>
                            <h4 className="benefits-title">Benefits</h4>
                            <ul className="sponsor-bullets">
                                <li><i className="fa-solid fa-circle-check"></i> Logo on website</li>
                                <li><i className="fa-solid fa-circle-check"></i> Social media recognition</li>
                                <li><i className="fa-solid fa-circle-check"></i> Quarterly impact report</li>
                            </ul>
                            <div className="impact-box"><p>Impact: Support 5 students with scholarships.</p></div>
                            <button className="sponsor-btn" onClick={() => alert('Sponsorship modal coming soon!')}>Support Bronze Tier</button>
                        </div>

                        {/* Silver */}
                        <div className="sponsor-card highlighted-sponsor">
                            <div className="icon-circle"><i className="fa-solid fa-trophy"></i></div>
                            <h3>Silver Partner</h3>
                            <div className="price">$5,000 <span>/ annually</span></div>
                            <h4 className="benefits-title">Benefits</h4>
                            <ul className="sponsor-bullets">
                                <li><i className="fa-solid fa-circle-check"></i> Logo on website</li>
                                <li><i className="fa-solid fa-circle-check"></i> Social media recognition</li>
                                <li><i className="fa-solid fa-circle-check"></i> Quarterly impact report</li>
                                <li><i className="fa-solid fa-circle-check"></i> Access to talent pool</li>
                            </ul>
                            <div className="impact-box"><p>Impact: Sponsor a local cohort of 25 students.</p></div>
                            <button className="sponsor-btn" onClick={() => alert('Sponsorship modal coming soon!')}>Support Silver Tier</button>
                        </div>

                        {/* Gold */}
                        <div className="sponsor-card">
                            <div className="icon-circle"><i className="fa-solid fa-shield-halved"></i></div>
                            <h3>Gold Partner</h3>
                            <div className="price">$10,000 <span>/ annually</span></div>
                            <h4 className="benefits-title">Benefits</h4>
                            <ul className="sponsor-bullets">
                                <li><i className="fa-solid fa-circle-check"></i> All Silver benefits</li>
                                <li><i className="fa-solid fa-circle-check"></i> Keynote speaking slot</li>
                                <li><i className="fa-solid fa-circle-check"></i> Customized cohort naming</li>
                                <li><i className="fa-solid fa-circle-check"></i> Recruitment partner status</li>
                            </ul>
                            <div className="impact-box"><p>Impact: Transform an entire community center.</p></div>
                            <button className="sponsor-btn" onClick={() => alert('Sponsorship modal coming soon!')}>Support Gold Tier</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Banner */}
            <section className="testimonial-banner-section">
                <div className="container testimonial-banner-grid reveal">
                    <div className="testimonial-banner-content">
                        <blockquote>"Mentoring at AfriLumina has been one of the most rewarding experiences of my career."</blockquote>
                        <div className="testimonial-banner-author">
                            <div className="author-avatar">JD</div>
                            <div className="author-info">
                                <h4>John Doe</h4>
                                <p>Senior Software Engineer, Google</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-banner-stat-box">
                        <h3>98%</h3>
                        <p>of our mentors say they would recommend the program to their colleagues.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="impact-cta-section">
                <div className="container reveal">
                    <h2>Ready to make an <span>impact</span>?</h2>
                    <p>Join our growing community of changemakers and help us shape the future of African talent.</p>
                    <button className="get-started-btn" onClick={() => openModal('')}>Get Started Now</button>
                </div>
            </section>

            {/* Involvement Modal */}
            <InvolvementModal
                isOpen={modalOpen}
                onClose={closeModal}
                preSelectedRole={selectedRole}
            />
        </div>
    );
};

export default GetInvolved;