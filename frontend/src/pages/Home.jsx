import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerInterest } from '../services/api'

const CATEGORIES = [
  { value: 'VOLUNTEER', label: 'Volunteer' },
  { value: 'MENTOR', label: 'Mentor' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'PROGRAM_APPLICANT', label: 'Program Applicant' },
  { value: 'DONOR', label: 'Donor' },
]

export default function Home() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', country: '', category: '', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [registrantId, setRegistrantId] = useState(null)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await registerInterest(form)
      setRegistrantId(res.data.id)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = () => {
    navigate('/payment', { state: { registrantId, category: form.category } })
  }

  if (success) {
    return (
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.successTitle}>You're registered!</h2>
        <p style={styles.successText}>
          Thank you for joining AfriLumina Hub as a <strong>{form.category.toLowerCase().replace('_', ' ')}</strong>.
          We'll be in touch shortly.
        </p>
        {(form.category === 'DONOR' || form.category === 'PROGRAM_APPLICANT') && (
          <button onClick={handlePayment} style={styles.payBtn}>
            Proceed to Payment →
          </button>
        )}
        <button onClick={() => { setSuccess(false); setForm({ fullName: '', email: '', phone: '', country: '', category: '', message: '' }) }}
          style={styles.resetBtn}>
          Register another person
        </button>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTagline}>Empowering Africa's Next Generation</p>
          <h1 style={styles.heroTitle}>AfriLumina Hub</h1>
          <p style={styles.heroSub}>
            Join a growing community of mentors, volunteers, partners, and changemakers
            transforming lives across Africa.
          </p>
          <a href="#register" style={styles.heroCta}>Get Involved →</a>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.stats}>
        {[['500+', 'Youth Reached'], ['50+', 'Mentors'], ['20+', 'Partners'], ['10+', 'Countries']].map(([num, label]) => (
          <div key={label} style={styles.statItem}>
            <span style={styles.statNum}>{num}</span>
            <span style={styles.statLabel}>{label}</span>
          </div>
        ))}
      </section>

      {/* Registration Form */}
      <section id="register" style={styles.formSection}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Join AfriLumina Hub</h2>
          <p style={styles.formSub}>Fill in your details and we'll get back to you.</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange}
                  required style={styles.input} placeholder="Jane Doe" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  required style={styles.input} placeholder="jane@example.com" />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  style={styles.input} placeholder="+254 700 000 000" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Country</label>
                <input name="country" value={form.country} onChange={handleChange}
                  style={styles.input} placeholder="Kenya" />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>I want to join as a *</label>
              <select name="category" value={form.category} onChange={handleChange}
                required style={styles.select}>
                <option value="">Select a role...</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Message (optional)</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                style={styles.textarea} rows={4}
                placeholder="Tell us why you want to join AfriLumina Hub..." />
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Submitting...' : 'Register Now'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f9f6f0' },
  hero: {
    background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a1e 50%, #1a2e1a 100%)',
    padding: '5rem 2rem',
    textAlign: 'center',
  },
  heroContent: { maxWidth: '700px', margin: '0 auto' },
  heroTagline: { color: '#f0a500', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem' },
  heroTitle: { color: '#ffffff', fontSize: '3.5rem', fontFamily: "'Playfair Display', serif", margin: '0 0 1.5rem' },
  heroSub: { color: '#c8d5b9', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' },
  heroCta: {
    display: 'inline-block', backgroundColor: '#f0a500', color: '#1a2e1a',
    padding: '0.85rem 2rem', borderRadius: '6px', textDecoration: 'none',
    fontWeight: 700, fontSize: '1rem', transition: 'background 0.2s',
  },
  stats: {
    display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap',
    padding: '2.5rem 2rem', backgroundColor: '#2d4a1e',
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { color: '#f0a500', fontSize: '2rem', fontWeight: 700 },
  statLabel: { color: '#c8d5b9', fontSize: '0.9rem', marginTop: '0.25rem' },
  formSection: { padding: '4rem 2rem' },
  formContainer: {
    maxWidth: '680px', margin: '0 auto', backgroundColor: '#ffffff',
    borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  formTitle: { color: '#1a2e1a', fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' },
  formSub: { color: '#666', marginBottom: '2rem' },
  errorBox: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#374151' },
  input: { padding: '0.65rem 0.85rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' },
  select: { padding: '0.65rem 0.85rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem', backgroundColor: '#fff' },
  textarea: { padding: '0.65rem 0.85rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' },
  submitBtn: {
    backgroundColor: '#1a2e1a', color: '#ffffff', padding: '0.85rem',
    border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', marginTop: '0.5rem',
  },
  successCard: {
    maxWidth: '500px', margin: '5rem auto', padding: '3rem 2rem',
    textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  successIcon: { fontSize: '3rem', color: '#16a34a', marginBottom: '1rem' },
  successTitle: { color: '#1a2e1a', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '1rem' },
  successText: { color: '#555', lineHeight: 1.7, marginBottom: '2rem' },
  payBtn: {
    display: 'block', width: '100%', backgroundColor: '#f0a500', color: '#1a2e1a',
    border: 'none', padding: '0.85rem', borderRadius: '6px', fontWeight: 700,
    fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem',
  },
  resetBtn: {
    background: 'transparent', border: '1px solid #d1d5db', color: '#666',
    padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
  },
}
