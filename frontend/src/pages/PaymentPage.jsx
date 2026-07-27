import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { initiatePayment } from '../services/api'

export default function PaymentPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!state?.registrantId) {
    return (
      <div style={styles.center}>
        <p>No registration found. <a href="/" style={styles.link}>Go back home</a></p>
      </div>
    )
  }

  const handlePay = async () => {
    if (!amount || !provider) {
      setError('Please enter an amount and choose a payment method.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await initiatePayment({
        registrantId: state.registrantId,
        provider,
        amount: parseFloat(amount),
        currency: 'USD',
        purpose: state.category === 'DONOR' ? 'DONATION' : 'PROGRAM_FEE',
      })
      // Redirect to the provider's checkout page
      window.location.href = res.data.checkoutUrl
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initiation failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Complete Your Payment</h2>
        <p style={styles.sub}>
          {state.category === 'DONOR' ? 'Your generous donation supports AfriLumina Hub.' : 'Program participation fee.'}
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Amount (USD) *</label>
          <input
            type="number" min="1" step="0.01" value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input} placeholder="e.g. 25.00"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Choose payment method *</label>
          <div style={styles.providerRow}>
            {['STRIPE', 'PAYPAL'].map((p) => (
              <button key={p} onClick={() => setProvider(p)}
                style={{ ...styles.providerBtn, ...(provider === p ? styles.providerSelected : {}) }}>
                {p === 'STRIPE' ? '💳 Pay with Card (Stripe)' : '🔵 Pay with PayPal'}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handlePay} disabled={loading} style={styles.payBtn}>
          {loading ? 'Redirecting...' : `Pay $${amount || '0.00'} →`}
        </button>

        <button onClick={() => navigate('/')} style={styles.backBtn}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: '#f9f6f0' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '2.5rem', maxWidth: '480px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  title: { color: '#1a2e1a', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '0.5rem' },
  sub: { color: '#666', marginBottom: '2rem', lineHeight: 1.6 },
  errorBox: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#374151' },
  input: { padding: '0.65rem 0.85rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' },
  providerRow: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  providerBtn: { padding: '0.85rem', border: '2px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.95rem', textAlign: 'left', transition: 'all 0.2s' },
  providerSelected: { borderColor: '#1a2e1a', backgroundColor: '#f0fdf4' },
  payBtn: { width: '100%', backgroundColor: '#f0a500', color: '#1a2e1a', border: 'none', padding: '0.9rem', borderRadius: '6px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem' },
  backBtn: { width: '100%', background: 'transparent', border: '1px solid #d1d5db', color: '#666', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  center: { textAlign: 'center', padding: '4rem' },
  link: { color: '#1a2e1a' },
}
