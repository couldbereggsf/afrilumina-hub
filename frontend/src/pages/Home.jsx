import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerInterest } from '../services/api';
import './legacy/css/style.css';
import './legacy/css/animations.css';
import './legacy/css/responsive.css';

import Typewriter from '../components/Typewriter';


const CATEGORIES = [
  { value: 'VOLUNTEER', label: 'Volunteer' },
  { value: 'MENTOR', label: 'Mentor' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'PROGRAM_APPLICANT', label: 'Program Applicant' },
  { value: 'DONOR', label: 'Donor' },
];

export default function Home() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const statsRef = useRef(null);

  // --- Form state ---
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    category: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [registrantId, setRegistrantId] = useState(null);

  // --- Counter animation state ---
  const [countersAnimated, setCountersAnimated] = useState(false);


  //  REVEAL ANIMATION (IntersectionObserver)
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

  //  COUNTER ANIMATION
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stats .counter');

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

  // Trigger counters when stats section becomes visible
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
  

  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: x * 6, y: y * -6 });
  };

  // --- Form handlers ---
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await registerInterest(form);
      setRegistrantId(res.data.id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    navigate('/payment', { state: { registrantId, category: form.category } });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
//
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // --- Success state ---
  if (success) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: '#16a34a', marginBottom: '1rem' }}></i>
          <h2 style={{ color: '#1a2e1a', fontSize: '1.8rem', marginBottom: '1rem' }}>You're registered!</h2>
          <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '2rem' }}>
            Thank you for joining AfriLumina Hub as a <strong>{form.category.toLowerCase().replace('_', ' ')}</strong>.
            We'll be in touch shortly.
          </p>
          {(form.category === 'DONOR' || form.category === 'PROGRAM_APPLICANT') && (
            <button onClick={handlePayment} className="btn primary-btn" style={{ width: '100%', marginBottom: '1rem' }}>
              Proceed to Payment →
            </button>
          )}
          <button
            onClick={() => {
              setSuccess(false);
              setForm({ fullName: '', email: '', phone: '', country: '', category: '', message: '' });
            }}
            className="btn secondary-btn"
          >
            Register another person
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text reveal">
            <span className="hero-tag">
              <Typewriter words={['EMPOWERING AFRICA\'S FUTURE', 'BUILDING GLOBAL LEADERS', 'CONNECTING TALENT TO OPPORTUNITY']} delay={3000} />
            </span>
            <h1>
              Your Journey to
              <span>Greatness</span>
              Starts Here.
            </h1>
            <p>
              AfriLumina connects ambitious African students
              with mentorship, resources, and opportunities
              needed to succeed globally.
            </p>
            <div className="hero-buttons">
              <Link to="/programs" className="btn primary-btn">Join as a Student</Link>
              <Link to="/get-involved" className="btn secondary-btn">Become a Mentor</Link>
              <button onClick={scrollToForm} className="btn secondary-btn" style={{ borderColor: '#eebe58', color: '#74674b' }}>
                Get Involved
              </button>
            </div>
          </div>
          <div className="hero-image reveal">
            <img src="/assets/images/hero.jpg" alt="Students" />
            <div className="hero-card">
              <i className="fa-solid fa-award"></i>
              <div>
                <h3>400+</h3>
                <p>Students Impacted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats" ref={statsRef}>
        <div className="container stats-grid">
          <div className="stat-card">
            <h2 className="counter" data-target="60" data-suffix="+">0</h2>
            <span>Mentors</span>
          </div>
          <div className="stat-card">
            <h2 className="counter" data-target="1.5" data-suffix="+">0</h2>
            <span>Years</span>
          </div>
          <div className="stat-card">
            <h2 className="counter" data-target="96" data-suffix="%">0</h2>
            <span>Satisfaction Rate</span>
          </div>
          <div className="stat-card">
            <h2 className="counter" data-target="3" data-suffix="+">0</h2>
            <span>Countries</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features section-padding">
        <div className="container">
          <div className="section-header reveal">
            <h2>Built for Your Growth</h2>
            <p>We provide the ecosystem you need to transition from student to professional leader</p>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal" onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: hoveredIndex === 0 ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}>
              <div className="icon-container"><i className="fa-solid fa-user-group"></i></div>
              <h3>Mentorship</h3>
              <p>One-on-one guidance from industry professionals who have walked the path.</p>
            </div>
            <div className="feature-card reveal" onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: hoveredIndex === 0 ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}>
              <div className="icon-container"><i className="fa-solid fa-graduation-cap"></i></div>
              <h3>Skills Accelerator</h3>
              <p>Practical, market-ready skills in tech, business, and creative industries.</p>
            </div>
            <div className="feature-card reveal" onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: hoveredIndex === 0 ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}>
              <div className="icon-container"><i className="fa-solid fa-globe"></i></div>
              <h3>Global Exposure</h3>
              <p>Access to international internships, workshops, and networking events.</p>
            </div>
            <div className="feature-card reveal" onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: hoveredIndex === 0 ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}>
              <div className="icon-container"><i className="fa-solid fa-bolt"></i></div>
              <h3>Inspiration and Visibility</h3>
              <p>Inspiration from fellow Africans who have successfully walked similar paths.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS ===== */}
      <section className="programs section-padding">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Core Programs</h2>
            <p>Discover the programs designed to shape your future.</p>
          </div>
          <div className="program-grid">
            <Link to="/programs#lumina-mentorship" className="program-card reveal">
              <span className="program-badge">6 Months</span>
              <img src="/assets/images/program1.jpg" alt="Mentorship" />
              <div className="program-content">
                <h3>Lumina Mentorship</h3>
                <p>One-on-one guidance from industry professionals.</p>
              </div>
            </Link>
            <Link to="/programs#skills-accelerator" className="program-card reveal">
              <span className="program-badge">12 Weeks</span>
              <img src="/assets/images/program2.jpg" alt="Skills" />
              <div className="program-content">
                <h3>Skills Accelerator</h3>
                <p>Intensive bootcamps for high-demand skills.</p>
              </div>
            </Link>
            <Link to="/programs#career-exposure" className="program-card reveal">
              <span className="program-badge">Ongoing</span>
              <img src="/assets/images/program3.jpg" alt="Exposure" />
              <div className="program-content">
                <h3>Global & Local Career Exposure</h3>
                <p>Career fairs, talks, and webinars.</p>
              </div>
            </Link>
            <Link to="/programs#financial-literacy" className="program-card reveal">
              <span className="program-badge">8 Weeks</span>
              <img src="/assets/images/program4.jpg" alt="Finance" />
              <div className="program-content">
                <h3>Financial Literacy</h3>
                <p>Mastering money management and investing.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BELONG ===== */}
      <section className="belong section-padding">
        <div className="container belong-box reveal">
          <div className="belong-left">
            <h2>There's a place for <span>you</span> here.</h2>
            <p>Whether you're a student, professional, or partner.</p>
          </div>
          <div className="belong-right">
            <Link to="/programs" className="belong-item">I am a Student</Link>
            <Link to="/get-involved#mentors" className="belong-item">I am a Professional</Link>
            <Link to="/get-involved#partners" className="belong-item">I represent an Organization</Link>
          </div>
        </div>
      </section>

      {/* ===== IMPACT ===== */}
      <section className="impact section-padding">
        <div className="container impact-grid">
          <div className="impact-image reveal">
            <div className="impact-image-wrapper">
              <img src="/assets/images/impact.jpg" alt="Changing Lives at AfriLumina" />
              <div className="impact-badge">
                <h3>98%</h3>
                <p>Of our students land their first professional role within 6 months of graduation.</p>
              </div>
            </div>
          </div>
          <div className="impact-content reveal">
            <h2>Changing Lives, One Student at a Time</h2>
            <p>
              Our impact goes beyond metrics. We are building a community of resilient, skilled, and connected leaders who are ready to take on the world's toughest challenges.
            </p>
            <ul>
              <li><i className="fa-regular fa-circle-check"></i><span>Personalized Mentorship</span></li>
              <li><i className="fa-regular fa-circle-check"></i><span>Job-Ready Skills</span></li>
              <li><i className="fa-regular fa-circle-check"></i><span>Global Opportunities</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== IMPACT IN ACTION ===== */}
      <section className="impact-action section-padding">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Impact in Action</h2>
            <p>A glimpse into how AfriLumina is empowering young people through real programs and meaningful experiences.</p>
          </div>
          <div className="impact-action-wrapper reveal">
            <div className="impact-action-image">
              <img src="/assets/images/impact.jpg" alt="Uthiru Girls Pilot Program" />
            </div>
            <div className="impact-action-caption">
              <p className="caption-title">“Uthiru Girls Pilot Program - Our first step in empowering young African students.”</p>
              <p className="caption-subtitle">One-on-one mentorship moments that spark growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WEBINARS ===== */}
      <section className="webinars section-padding">
        <div className="container">
          <div className="section-header reveal">
            <h2>A Glimpse Into Our Webinars</h2>
            <p>Experience how AfriLumina brings learning, mentorship, and community to life through interactive sessions.</p>
          </div>
          <div className="webinar-wrapper reveal">
            <div className="webinar-thumbnail">
              <img src="/assets/images/webinar_glimpse.jpg" alt="AfriLumina Webinar Session" />
            </div>
            <div className="webinar-caption">
              <p>“Highlights from AfriLumina sessions and engagements.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials section-padding">
        <div className="container">
          <div className="section-header reveal">
            <h2>Voices of Impact</h2>
            <p>Hear from the students whose lives have been transformed.</p>
          </div>
          <div className="testimonial-grid reveal">
            <div className="testimonial-card">
              <div className="quote-icon">
                <svg width="48" height="44" viewBox="0 0 48 44" fill="none">
                  <path d="M14 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H12V32C12 35.3137 9.31371 38 6 38H4M38 4H28C26.8954 4 26 4.89543 26 6V20C26 21.1046 26.8954 22 28 22H36V32C36 35.3137 33.3137 38 30 38H28" stroke="#462814" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="quote-text">"AfriLumina gave me the confidence to apply for international roles I thought were out of reach."</p>
              <div className="author-profile">
                <div className="author-avatar">A</div>
                <div className="author-details">
                  <span className="author-name">Amara Okafor</span>
                  <span className="author-role">Software Engineer</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">
                <svg width="48" height="44" viewBox="0 0 48 44" fill="none">
                  <path d="M14 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H12V32C12 35.3137 9.31371 38 6 38H4M38 4H28C26.8954 4 26 4.89543 26 6V20C26 21.1046 26.8954 22 28 22H36V32C36 35.3137 33.3137 38 30 38H28" stroke="#462814" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="quote-text">"The mentorship program was a game-changer. My mentor helped me navigate my first corporate role with ease."</p>
              <div className="author-profile">
                <div className="author-avatar">K</div>
                <div className="author-details">
                  <span className="author-name">Kofi Mensah</span>
                  <span className="author-role">Business Analyst</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">
                <svg width="48" height="44" viewBox="0 0 48 44" fill="none">
                  <path d="M14 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H12V32C12 35.3137 9.31371 38 6 38H4M38 4H28C26.8954 4 26 4.89543 26 6V20C26 21.1046 26.8954 22 28 22H36V32C36 35.3137 33.3137 38 30 38H28" stroke="#462814" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="quote-text">"I found a community of like-minded creatives who push me to be better every single day."</p>
              <div className="author-profile">
                <div className="author-avatar">F</div>
                <div className="author-details">
                  <span className="author-name">Fatima Zahra</span>
                  <span className="author-role">Creative Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTNERS ===== */}
      <section className="partners section-padding">
        <div className="container">
          <div className="partners-banner-wrapper reveal">
            <img src="/assets/images/partners_banner.png" alt="Our Partners: Rotaract Jabali-IF UNITE FOR GOOD and Morgridge Center for Public Service UNIVERSITY OF WISCONSIN–MADISON" className="partners-banner-img" />
          </div>
        </div>
      </section>

      {/* ===== REGISTRATION FORM ===== */}
      <section className="newsletter" ref={formRef} style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="newsletter-box reveal" style={{
            background: 'linear-gradient(135deg, #ffb13b 0%, #faa01e 100%)',
            borderRadius: '24px',
            padding: '50px 60px',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            {/* Header - Centered */}
            <div style={{
              textAlign: 'center',
              width: '100%'
            }}>
              <h2 style={{
                color: '#fff',
                fontSize: '2.2rem',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                Join AfriLumina Hub
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.05rem',
                margin: 0
              }}>
                Fill in your details and we'll get back to you.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
              width: '100%',
              maxWidth: '580px',
              margin: '0 auto'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                width: '100%'
              }}>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  required
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#333',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email *"
                  required
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#333',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#333',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#333',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  style={{
                    gridColumn: '1 / -1',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#333',
                    appearance: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">I want to join as a...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message (optional)"
                  rows="2"
                  style={{
                    gridColumn: '1 / -1',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: '#333',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {error && <div style={{
                color: '#fff',
                background: '#b91c1c',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="btn primary-btn"
                style={{
                  width: '100%',
                  background: '#462814',
                  color: '#fff',
                  fontWeight: 700,
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#361e0d';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(70, 40, 20, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#462814';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {loading ? 'Submitting...' : 'Register Now'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}