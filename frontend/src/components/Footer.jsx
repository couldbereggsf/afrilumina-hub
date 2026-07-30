import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="container footer-grid">
                {/* Brand & Social */}
                <div>
                    <Link to="/" className="footer-logo">
                        <img src="/assets/images/footer-logo.png" alt="AfriLumina Logo" className="footer-logo-img" />
                    </Link>
                    <p>Empowering the next generation of African leaders.</p>
                    <div className="social-icons">
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

                {/* Quick Links */}
                <div>
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/programs">Programs</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/admin/login">Admin</Link>
                </div>

                {/* Programs */}
                <div>
                    <h4>Programs</h4>
                    <Link to="/programs#lumina-mentorship">Mentorship Hub</Link>
                    <Link to="/programs#skills-accelerator">Skills Accelerator</Link>
                    <Link to="/programs#career-exposure">Career Exposure</Link>
                    <Link to="/programs#financial-literacy">Financial Literacy</Link>
                </div>

                {/* Contact */}
                <div>
                    <h4>Contact</h4>
                    <p>admin@afriluminahub.com</p>
                    <p>Nairobi, Kenya</p>
                </div>
            </div>

            <div className="copyright">
                <p>© 2026 Afrilumina Hub. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;