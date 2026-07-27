import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('afrilumina_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('afrilumina_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// --- Public endpoints ---
export const registerInterest = (data) => api.post('/registrations', data)
export const initiatePayment = (data) => api.post('/payments/initiate', data)

// --- Auth ---
export const adminLogin = (email, password) =>
  api.post('/auth/login', { email, password })

// --- Admin endpoints ---
export const getRegistrants = (params) => api.get('/admin/registrants', { params })
export const exportRegistrants = (params) =>
  api.get('/admin/registrants/export', {
    params,
    responseType: 'blob', // important: we're downloading a file
  })

export default api
