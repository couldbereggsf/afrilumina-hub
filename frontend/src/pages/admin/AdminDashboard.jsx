import { useState, useEffect } from 'react'
import { getRegistrants, exportRegistrants } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = ['', 'VOLUNTEER', 'MENTOR', 'PARTNER', 'PROGRAM_APPLICANT', 'DONOR']

const STATUS_COLORS = {
  NEW: '#1a2e1a',
  CONTACTED: '#1d4ed8',
  CONFIRMED: '#16a34a',
  ARCHIVED: '#6b7280',
}

export default function AdminDashboard() {
  const { admin } = useAuth()
  const [registrants, setRegistrants] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, size: 10 }
      if (category) params.category = category
      const res = await getRegistrants(params)
      setRegistrants(res.data.content)
      setTotal(res.data.totalElements)
    } catch (err) {
      setError('Failed to load registrants.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [page, category])

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = {}
      if (category) params.category = category
      const res = await exportRegistrants(params)
      // Trigger file download in the browser
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `afrilumina-registrants-${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.sub}>Welcome back, {admin?.name} — {total} registrant{total !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={handleExport} disabled={exporting} style={styles.exportBtn}>
          {exporting ? 'Exporting...' : '⬇ Export to Excel'}
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <label style={styles.filterLabel}>Filter by category:</label>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(0) }} style={styles.select}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c || 'All categories'}</option>
          ))}
        </select>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {['ID', 'Full Name', 'Email', 'Phone', 'Country', 'Category', 'Status', 'Registered'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={styles.empty}>Loading...</td></tr>
            ) : registrants.length === 0 ? (
              <tr><td colSpan={8} style={styles.empty}>No registrants found.</td></tr>
            ) : (
              registrants.map((r) => (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{r.id}</td>
                  <td style={styles.td}>{r.fullName}</td>
                  <td style={styles.td}>{r.email}</td>
                  <td style={styles.td}>{r.phone || '—'}</td>
                  <td style={styles.td}>{r.country || '—'}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: '#e8f5e9', color: '#1a2e1a' }}>
                      {r.category}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, color: STATUS_COLORS[r.status] || '#333', border: `1px solid ${STATUS_COLORS[r.status] || '#ccc'}` }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={styles.pageBtn}>← Prev</button>
          <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={styles.pageBtn}>Next →</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { color: '#1a2e1a', fontFamily: "'Playfair Display', serif", fontSize: '2rem', margin: 0 },
  sub: { color: '#666', marginTop: '0.25rem' },
  exportBtn: {
    backgroundColor: '#f0a500', color: '#1a2e1a', border: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 700,
    fontSize: '0.95rem', cursor: 'pointer',
  },
  filters: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  filterLabel: { fontWeight: 600, color: '#374151', fontSize: '0.9rem' },
  select: { padding: '0.5rem 0.85rem', border: '1.5px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  errorBox: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem' },
  tableWrap: { overflowX: 'auto', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' },
  thead: { backgroundColor: '#1a2e1a' },
  th: { padding: '0.85rem 1rem', textAlign: 'left', color: '#c8d5b9', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' },
  td: { padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#374151', whiteSpace: 'nowrap' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 },
  empty: { textAlign: 'center', padding: '3rem', color: '#888' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' },
  pageBtn: { padding: '0.5rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff' },
  pageInfo: { color: '#555', fontSize: '0.9rem' },
}
