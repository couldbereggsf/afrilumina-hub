import React, { useEffect, useRef, useState } from 'react';

// ============================================
// IMPORT LEGACY CSS FOR THIS PAGE
// ============================================
import './legacy/css/style.css';
import './legacy/css/animations.css';
import './legacy/css/responsive.css';

const About = () => {
    // --- Reveal animation ---
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

    // --- Accordion state ---
    const [openPillars, setOpenPillars] = useState([false, false, false, false]);

    const togglePillar = (index) => {
        setOpenPillars((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    // --- Counter animation ---
    const statsRef = useRef(null);
    const [countersAnimated, setCountersAnimated] = useState(false);

    const animateCounters = () => {
        const counters = document.querySelectorAll('.about-stats-grid .counter');

        counters.forEach((counter) => {
            const targetStr = counter.getAttribute('data-target');
            const target = parseFloat(targetStr);
            const isFloat = target % 1 !== 0 || targetStr.includes('.');
            const decimals = isFloat ? targetStr.split('.')[1]?.length || 1 : 0;
            const duration = 2000;
            const startTime = performance.now();

            let suffix = '';
            if (counter.hasAttribute('data-suffix')) {
                suffix = counter.getAttribute('data-suffix');
            } else {
                if (target >= 1000) suffix = 'k+';
                else if (target === 96 || target === 90 || target === 98) suffix = '%';
                else if (target >= 50) suffix = '+';
            }

            let prefix = counter.hasAttribute('data-prefix')
                ? counter.getAttribute('data-prefix')
                : '';

            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);

                if (progress < 1) {
                    const current = easedProgress * target;
                    let displayVal;
                    if (counter.hasAttribute('data-suffix') || isFloat || target < 1000) {
                        displayVal = isFloat ? current.toFixed(decimals) : Math.floor(current).toLocaleString();
                    } else {
                        const kVal = (current / 1000).toFixed(current >= 1000 && current % 1000 !== 0 ? 1 : 0);
                        displayVal = kVal;
                    }
                    counter.textContent = prefix + displayVal + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    // Final value
                    let finalVal;
                    if (counter.hasAttribute('data-suffix') || isFloat) {
                        finalVal = isFloat ? target.toFixed(decimals) : target.toLocaleString();
                    } else if (target >= 1000) {
                        finalVal = (target / 1000).toFixed(target % 1000 !== 0 ? 1 : 0) + 'k+';
                    } else {
                        finalVal = target.toLocaleString() + suffix;
                    }
                    if (!finalVal.includes(suffix) && suffix && !finalVal.endsWith('%')) {
                        finalVal = finalVal + suffix;
                    }
                    counter.textContent = prefix + finalVal;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    };

    useEffect(() => {
        if (!statsRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !countersAnimated) {
                        setCountersAnimated(true);
                        animateCounters();
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(statsRef.current);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countersAnimated]);

    return (
        <div className="about-page">
            {/* ABOUT HERO */}
            <section className="about-hero-section">
                <div className="container reveal">
                    <h1>About AfriLumina</h1>
                    <p>
                        We are a mission-driven platform dedicated to bridging the gap
                        between talent and opportunity for African youth.
                    </p>
                </div>
            </section>

            {/* WHY AFRILUMINA WAS CREATED */}
            <section className="story-section">
                <div className="container story-grid">
                    <div className="story-image-container reveal">
                        <img
                            src="/assets/images/about_classroom.jpg"
                            alt="A classroom of African high school students in blue uniforms listening and learning"
                        />
                    </div>
                    <div className="story-content reveal">
                        <h2>Why AfriLumina was created</h2>
                        <p>
                            Young Africans are some of the most talented and ambitious in the
                            world, yet they face significant barriers entering the global
                            professional landscape due to a shortage of structured guidance and
                            mentorship.
                        </p>
                        <p>
                            AfriLumina was born out of the belief that talent is universal but
                            opportunity is not. We build bridge programs that connect African
                            talent with elite global professionals, ensuring that skills
                            development translates to visible, international careers.
                        </p>
                        <p>
                            Our ultimate vision is a world where every young African student has
                            access to the guidance, resources, and opportunities required to
                            excel on the global stage.
                        </p>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="mission-vision-section container">
                <div className="mission-vision-grid reveal">
                    {/* Mission Card */}
                    <div className="mission-card">
                        <div className="icon-container">
                            <i className="fa-solid fa-bullseye"></i>
                        </div>
                        <h3>Our Mission</h3>
                        <p>
                            To equip African students with the skills, mentorship and
                            opportunities required to thrive in the modern global economy.
                        </p>
                    </div>
                    {/* Vision Card */}
                    <div className="vision-card">
                        <div className="icon-container">
                            <i className="fa-solid fa-eye"></i>
                        </div>
                        <h3>Our Vision</h3>
                        <p>
                            An Africa empowered by a generation of leaders who are globally
                            competitive, locally impactful and deeply connected.
                        </p>
                    </div>
                </div>
            </section>

            {/* OUR CORE PILLARS */}
            <section className="pillars-section">
                <div className="container">
                    <div className="section-header reveal">
                        <h2>Our Core Pillars</h2>
                        <p>Professional connections, skills development, digital literacy</p>
                    </div>
                    <div className="pillars-grid">
                        {/* Pillar 1: Mentorship */}
                        <div className="pillar-accordion reveal">
                            <button
                                className="accordion-toggle"
                                type="button"
                                onClick={() => togglePillar(0)}
                            >
                                <div className="check-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="toggle-text">
                                    <h3>Mentorship</h3>
                                    <p>
                                        Connecting students with experienced professionals for
                                        career guidance and personal growth.
                                    </p>
                                </div>
                                <i
                                    className={`fa-solid fa-chevron-down accordion-icon ${openPillars[0] ? 'active' : ''
                                        }`}
                                ></i>
                            </button>
                            <div
                                className={`accordion-content ${openPillars[0] ? 'open' : ''}`}
                            >
                                <p>
                                    Our mentorship program pairs ambitious African students with
                                    seasoned leaders across technology, finance, business, and
                                    creative industries globally. Through structured 1-on-1
                                    sessions, mentees gain invaluable industry insights,
                                    portfolio reviews, and personalized career roadmaps that
                                    accelerate their professional development.
                                </p>
                            </div>
                        </div>

                        {/* Pillar 2: Learning */}
                        <div className="pillar-accordion reveal">
                            <button
                                className="accordion-toggle"
                                type="button"
                                onClick={() => togglePillar(1)}
                            >
                                <div className="check-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="toggle-text">
                                    <h3>Learning</h3>
                                    <p>
                                        Providing access to curated courses and workshops focused
                                        on high-demand skills.
                                    </p>
                                </div>
                                <i
                                    className={`fa-solid fa-chevron-down accordion-icon ${openPillars[1] ? 'active' : ''
                                        }`}
                                ></i>
                            </button>
                            <div
                                className={`accordion-content ${openPillars[1] ? 'open' : ''}`}
                            >
                                <p>
                                    We deliver hands-on, high-impact curriculum designed
                                    alongside top global universities and tech employers. From
                                    full-stack software engineering and data analytics to digital
                                    marketing and leadership communication, our courses equip
                                    students with practical competencies tailored for immediate
                                    market readiness.
                                </p>
                            </div>
                        </div>

                        {/* Pillar 3: Exposure */}
                        <div className="pillar-accordion reveal">
                            <button
                                className="accordion-toggle"
                                type="button"
                                onClick={() => togglePillar(2)}
                            >
                                <div className="check-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="toggle-text">
                                    <h3>Exposure</h3>
                                    <p>
                                        Opening doors to internship and career networking
                                        opportunities.
                                    </p>
                                </div>
                                <i
                                    className={`fa-solid fa-chevron-down accordion-icon ${openPillars[2] ? 'active' : ''
                                        }`}
                                ></i>
                            </button>
                            <div
                                className={`accordion-content ${openPillars[2] ? 'open' : ''}`}
                            >
                                <p>
                                    Through our extensive partner network and talent showcases,
                                    we connect top-performing students directly with recruiters
                                    and hiring managers. We facilitate remote internships,
                                    fellowship placements, and exclusive networking mixers that
                                    break down geographical barriers.
                                </p>
                            </div>
                        </div>

                        {/* Pillar 4: Inspiration */}
                        <div className="pillar-accordion reveal">
                            <button
                                className="accordion-toggle"
                                type="button"
                                onClick={() => togglePillar(3)}
                            >
                                <div className="check-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="toggle-text">
                                    <h3>Inspiration</h3>
                                    <p>
                                        Sharing stories of success and building a community that
                                        breeds achievement.
                                    </p>
                                </div>
                                <i
                                    className={`fa-solid fa-chevron-down accordion-icon ${openPillars[3] ? 'active' : ''
                                        }`}
                                ></i>
                            </button>
                            <div
                                className={`accordion-content ${openPillars[3] ? 'open' : ''}`}
                            >
                                <p>
                                    We foster a vibrant, peer-driven community where African
                                    youth inspire one another. Through keynote speaker series,
                                    alumni spotlights, and collaborative innovation challenges,
                                    we cultivate a mindset of resilience, leadership, and
                                    limitless aspiration.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* IMPACT STATS */}
            <section
                className="about-stats-section stats"
                ref={statsRef}
            >
                <div className="container about-stats-grid">
                    <div className="about-stat-item">
                        <h2 className="counter" data-target="400" data-suffix="+">
                            0
                        </h2>
                        <span>Students Impacted</span>
                    </div>
                    <div className="about-stat-item">
                        <h2 className="counter" data-target="60" data-suffix="+">
                            0
                        </h2>
                        <span>Mentors</span>
                    </div>
                    <div className="about-stat-item">
                        <h2 className="counter" data-target="6" data-suffix="+">
                            0
                        </h2>
                        <span>Programs</span>
                    </div>
                    <div className="about-stat-item">
                        <h2 className="counter" data-target="1500" data-suffix="+">
                            0
                        </h2>
                        <span>Mentorship Hours</span>
                    </div>
                </div>
            </section>

            {/* JOIN THE MOVEMENT */}
            <section className="join-movement-section container">
                <div className="movement-box reveal">
                    <h2>Join the Movement</h2>
                    <p>
                        Be part of the generation shaping Africa's future. Join us as a
                        student or mentor today.
                    </p>
                    <div className="movement-buttons">
                        <a href="/programs" className="btn student-btn">
                            Join as a Student
                        </a>
                        <a href="/get-involved" className="btn mentor-btn">
                            Become a Mentor
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;