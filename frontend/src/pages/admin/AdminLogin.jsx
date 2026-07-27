import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await adminLogin(email, password)
      login(res.data.token, res.data.fullName)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.sub}>AfriLumina Hub — Staff Access</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required style={styles.input} placeholder="admin@afriluminahub.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required style={styles.input} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f6f0' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '2.5rem', maxWidth: '400px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  title: { color: '#1a2e1a', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '0.25rem' },
  sub: { color: '#888', fontSize: '0.9rem', marginBottom: '2rem' },
  errorBox: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.875rem', fontWeight: 600, color: '#374151' },
  input: { padding: '0.65rem 0.85rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem' },
  btn: { backgroundColor: '#1a2e1a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
}
