import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Programs = () => {
    // Scroll reveal animation
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

    return (
        <div className="programs-page">
            {/* Hero */}
            <section className="programs-hero-section">
                <div className="container reveal">
                    <h1>Our Programs</h1>
                    <p>
                        Discover the programs designed to shape your future and unlock your potential.
                    </p>
                </div>
            </section>

            {/* Programs List */}
            <section className="programs-list-section">
                <div className="container">
                    {/* Program Row 1: Mentorship */}
                    <div className="program-row" id="lumina-mentorship">
                        <div className="program-image-col reveal">
                            <img src="/assets/images/program1.jpg" alt="Mentorship" />
                        </div>
                        <div className="program-text-col reveal">
                            <h2>Lumina Mentorship</h2>
                            <p className="program-desc">
                                One-on-one guidance from industry professionals who have walked the path.
                            </p>
                            <div className="program-meta">
                                <span className="program-meta-item"><i className="fa-regular fa-clock"></i> 6 Months</span>
                                <span className="program-meta-item"><i className="fa-regular fa-user"></i> 1-on-1</span>
                            </div>
                            <h3 className="outcomes-title">What you'll gain</h3>
                            <ul className="program-outcomes">
                                <li><i className="fa-regular fa-circle-check"></i> Personal career roadmap</li>
                                <li><i className="fa-regular fa-circle-check"></i> Portfolio reviews</li>
                                <li><i className="fa-regular fa-circle-check"></i> Industry insider knowledge</li>
                            </ul>
                            <div className="program-buttons">
                                <Link to="/get-involved" className="btn apply-btn">Apply Now</Link>
                                <a href="#" className="btn learn-btn">Learn More</a>
                            </div>
                        </div>
                    </div>

                    {/* Program Row 2: Skills Accelerator */}
                    <div className="program-row" id="skills-accelerator">
                        <div className="program-image-col reveal">
                            <img src="/assets/images/program2.jpg" alt="Skills Accelerator" />
                        </div>
                        <div className="program-text-col reveal">
                            <h2>Skills Accelerator</h2>
                            <p className="program-desc">
                                Intensive bootcamps for high-demand skills in tech, business, and creative fields.
                            </p>
                            <div className="program-meta">
                                <span className="program-meta-item"><i className="fa-regular fa-clock"></i> 12 Weeks</span>
                                <span className="program-meta-item"><i className="fa-regular fa-user"></i> Cohort-based</span>
                            </div>
                            <h3 className="outcomes-title">What you'll gain</h3>
                            <ul className="program-outcomes">
                                <li><i className="fa-regular fa-circle-check"></i> Market-ready skills</li>
                                <li><i className="fa-regular fa-circle-check"></i> Hands-on projects</li>
                                <li><i className="fa-regular fa-circle-check"></i> Peer learning</li>
                            </ul>
                            <div className="program-buttons">
                                <Link to="/get-involved" className="btn apply-btn">Apply Now</Link>
                                <a href="#" className="btn learn-btn">Learn More</a>
                            </div>
                        </div>
                    </div>

                    {/* Program Row 3: Career Exposure */}
                    <div className="program-row" id="career-exposure">
                        <div className="program-image-col reveal">
                            <img src="/assets/images/program3.jpg" alt="Career Exposure" />
                        </div>
                        <div className="program-text-col reveal">
                            <h2>Global & Local Career Exposure</h2>
                            <p className="program-desc">
                                Career fairs, talks, and webinars that connect you to international opportunities.
                            </p>
                            <div className="program-meta">
                                <span className="program-meta-item"><i className="fa-regular fa-clock"></i> Ongoing</span>
                                <span className="program-meta-item"><i className="fa-regular fa-globe"></i> Global</span>
                            </div>
                            <h3 className="outcomes-title">What you'll gain</h3>
                            <ul className="program-outcomes">
                                <li><i className="fa-regular fa-circle-check"></i> Network with employers</li>
                                <li><i className="fa-regular fa-circle-check"></i> Internship pipelines</li>
                                <li><i className="fa-regular fa-circle-check"></i> Career readiness</li>
                            </ul>
                            <div className="program-buttons">
                                <Link to="/get-involved" className="btn apply-btn">Apply Now</Link>
                                <a href="#" className="btn learn-btn">Learn More</a>
                            </div>
                        </div>
                    </div>

                    {/* Program Row 4: Financial Literacy */}
                    <div className="program-row" id="financial-literacy">
                        <div className="program-image-col reveal">
                            <img src="/assets/images/program4.jpg" alt="Financial Literacy" />
                        </div>
                        <div className="program-text-col reveal">
                            <h2>Financial Literacy</h2>
                            <p className="program-desc">
                                Mastering money management, investing, and financial independence.
                            </p>
                            <div className="program-meta">
                                <span className="program-meta-item"><i className="fa-regular fa-clock"></i> 8 Weeks</span>
                                <span className="program-meta-item"><i className="fa-regular fa-user"></i> Self-paced</span>
                            </div>
                            <h3 className="outcomes-title">What you'll gain</h3>
                            <ul className="program-outcomes">
                                <li><i className="fa-regular fa-circle-check"></i> Budgeting & saving</li>
                                <li><i className="fa-regular fa-circle-check"></i> Investment basics</li>
                                <li><i className="fa-regular fa-circle-check"></i> Financial confidence</li>
                            </ul>
                            <div className="program-buttons">
                                <Link to="/get-involved" className="btn apply-btn">Apply Now</Link>
                                <a href="#" className="btn learn-btn">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header reveal">
                        <h2>How It Works</h2>
                        <p>Your path to success starts with four simple steps.</p>
                    </div>
                    <div className="how-grid">
                        <div className="how-card reveal">
                            <div className="step-num">01</div>
                            <h3>Apply</h3>
                            <p>Submit your application and tell us about your goals.</p>
                        </div>
                        <div className="how-card reveal">
                            <div className="step-num">02</div>
                            <h3>Match</h3>
                            <p>We match you with the right mentors and resources.</p>
                        </div>
                        <div className="how-card reveal">
                            <div className="step-num">03</div>
                            <h3>Grow</h3>
                            <p>Participate in programs, workshops, and networking.</p>
                        </div>
                        <div className="how-card reveal">
                            <div className="step-num">04</div>
                            <h3>Succeed</h3>
                            <p>Launch your career and become a leader in your field.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Start Journey CTA */}
            <section className="start-journey-section">
                <div className="container reveal">
                    <h2>Ready to Start Your <span>Journey</span>?</h2>
                    <p>Join AfriLumina today and unlock your potential.</p>
                    <Link to="/get-involved" className="apply-program-btn">Get Started Now</Link>
                </div>
            </section>
        </div>
    );
};

export default Programs;