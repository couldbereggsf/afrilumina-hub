import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <span style={styles.brandLight}>Afri</span>
        <span style={styles.brandBold}>Lumina</span>
        <span style={styles.brandAccent}> Hub</span>
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {admin ? (
          <>
            <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
            <span style={styles.adminName}>Hi, {admin.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/admin/login" style={styles.adminLink}>Admin</Link>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a2e1a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    textDecoration: 'none',
    fontSize: '1.5rem',
    letterSpacing: '0.02em',
  },
  brandLight: { color: '#c8d5b9', fontWeight: 400 },
  brandBold: { color: '#ffffff', fontWeight: 700 },
  brandAccent: { color: '#f0a500', fontWeight: 600 },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#c8d5b9',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },
  adminLink: {
    color: '#f0a500',
    textDecoration: 'none',
    fontSize: '0.9rem',
    border: '1px solid #f0a500',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
  },
  adminName: {
    color: '#c8d5b9',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #c8d5b9',
    color: '#c8d5b9',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
}
