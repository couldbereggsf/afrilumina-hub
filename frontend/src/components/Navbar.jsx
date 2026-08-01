import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

import { useDarkMode } from '../context/DarkModeContext';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { darkMode, toggleDarkMode } = useDarkMode();


  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? 'show' : ''}`}
        onClick={closeMobileMenu}
      />

      <nav className="navbar">
        <div className="nav-container">
          {/* Brand/Logo */}
          <Link to="/" className="brand" onClick={closeMobileMenu}>
            <span className="brand-light">Afri</span>
            <span className="brand-bold">Lumina</span>
            <span className="brand-accent"> Hub</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
            <Link to="/programs" className={`nav-link ${isActive('/programs') ? 'active' : ''}`}>Programs</Link>
            <Link to="/get-involved" className={`nav-link ${isActive('/get-involved') ? 'active' : ''}`}>Get Involved</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>

            {/* Admin Section - Desktop */}
            {admin ? (
              <>
                <Link to="/admin/dashboard" className="nav-link admin-link">Dashboard</Link>
                <span className="admin-name">Hi, {admin.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" className="nav-link admin-login">Admin</Link>
            )}

            <button onClick={toggleDarkMode} className="dark-toggle">
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Scroll Progress Bar - INSIDE the navbar */}
        <div className="scroll-progress-container">
          <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>Home</Link>
          <Link to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>About</Link>
          <Link to="/programs" className="mobile-nav-link" onClick={closeMobileMenu}>Programs</Link>
          <Link to="/get-involved" className="mobile-nav-link" onClick={closeMobileMenu}>Get Involved</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>

          <hr className="mobile-divider" />

          {admin ? (
            <>
              <Link to="/admin/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>Dashboard</Link>
              <span className="mobile-admin-name">Hi, {admin.name}</span>
              <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/admin/login" className="mobile-nav-link admin-login" onClick={closeMobileMenu}>Admin</Link>
          )}

          <div className="mobile-cta">
            <Link to="/programs" className="btn primary-btn mobile-join-btn" onClick={closeMobileMenu}>
              Join as a Student
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}