import axios from 'axios'

//  AXIOs INSTANCE
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('afrilumina_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
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

//  PUBLIC ENDPOINTS

// Registration
export const registerInterest = (data) => api.post('/registrations', data)

// Alternative registration
export const createRegistration = (data) => api.post('/registrations', data)

// Resume Upload (multipart/form-data)
export const uploadResume = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// Payment
export const initiatePayment = (data) => api.post('/payments/initiate', data)

//  AUTH ENDPOINTS

export const adminLogin = (email, password) =>
  api.post('/auth/login', { email, password })

//  ADMIN ENDPOINTS (Protected)

export const getRegistrants = (params) =>
  api.get('/admin/registrants', { params })

export const exportRegistrants = (params) =>
  api.get('/admin/registrants/export', {
    params,
    responseType: 'blob', // important: we're downloading a file
  })

//  FULL REGISTRATION WITH RESUME UPLOAD
//  (Combines upload + registration in one call)

export const submitRegistrationWithResume = async (registrationData, resumeFile) => {
  try {
    let resumeFileName = ''

    // Step 1: Upload resume if provided
    if (resumeFile) {
      const formData = new FormData()
      formData.append('file', resumeFile)

      const uploadRes = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      resumeFileName = uploadRes.data.fileName
    }

    // Step 2: Create registration with resume filename
    const regData = {
      ...registrationData,
      resumeFileName: resumeFileName,
    }

    const regRes = await api.post('/registrations', regData)
    return regRes.data

  } catch (error) {
    console.error('Registration with resume failed:', error)
    throw error
  }
}

export default api