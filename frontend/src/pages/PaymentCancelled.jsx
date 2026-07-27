import { Link, useNavigate } from 'react-router-dom'

export default function PaymentCancelled() {
  const navigate = useNavigate()
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✕</div>
        <h2 style={styles.title}>Payment Cancelled</h2>
        <p style={styles.text}>
          Your payment was cancelled. No charges have been made. You can try again
          or come back later.
        </p>
        <button onClick={() => navigate(-1)} style={styles.retryBtn}>Try Again</button>
        <Link to="/" style={styles.homeLink}>Back to Home</Link>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f6f0' },
  card: { textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', padding: '3rem 2rem', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  icon: { fontSize: '3.5rem', color: '#dc2626', marginBottom: '1rem' },
  title: { color: '#1a2e1a', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '1rem' },
  text: { color: '#555', lineHeight: 1.7, marginBottom: '2rem' },
  retryBtn: { display: 'block', width: '100%', backgroundColor: '#f0a500', color: '#1a2e1a', border: 'none', padding: '0.85rem', borderRadius: '6px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem' },
  homeLink: { display: 'inline-block', color: '#1a2e1a', textDecoration: 'underline', fontSize: '0.9rem' },
}
