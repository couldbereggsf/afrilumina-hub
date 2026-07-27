import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✓</div>
        <h2 style={styles.title}>Payment Received!</h2>
        <p style={styles.text}>
          Thank you for your contribution to AfriLumina Hub. Your payment has been
          processed successfully. Check your email for a receipt.
        </p>
        <Link to="/" style={styles.btn}>Back to Home</Link>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f6f0' },
  card: { textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', padding: '3rem 2rem', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  icon: { fontSize: '3.5rem', color: '#16a34a', marginBottom: '1rem' },
  title: { color: '#1a2e1a', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '1rem' },
  text: { color: '#555', lineHeight: 1.7, marginBottom: '2rem' },
  btn: { display: 'inline-block', backgroundColor: '#1a2e1a', color: '#fff', padding: '0.8rem 2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 },
}
