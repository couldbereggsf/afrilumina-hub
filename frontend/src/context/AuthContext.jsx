import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('afrilumina_token')
    const name = localStorage.getItem('afrilumina_name')
    if (token && name) setAdmin({ token, name })
  }, [])

  const login = (token, fullName) => {
    localStorage.setItem('afrilumina_token', token)
    localStorage.setItem('afrilumina_name', fullName)
    setAdmin({ token, name: fullName })
  }

  const logout = () => {
    localStorage.removeItem('afrilumina_token')
    localStorage.removeItem('afrilumina_name')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
