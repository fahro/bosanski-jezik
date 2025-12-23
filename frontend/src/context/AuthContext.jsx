import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData = await authApi.getMe()
        setUser(userData)
        const userStats = await authApi.getStats()
        setStats(userStats)
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  const login = async (username, password) => {
    const response = await authApi.login(username, password)
    localStorage.setItem('token', response.access_token)
    setUser(response.user)
    const userStats = await authApi.getStats()
    setStats(userStats)
    return response
  }

  const register = async (username, email, password, fullName) => {
    const response = await authApi.register(username, email, password, fullName)
    return response
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setStats(null)
  }

  const refreshStats = async () => {
    if (user) {
      try {
        const userStats = await authApi.getStats()
        setStats(userStats)
      } catch (error) {
        console.error('Failed to refresh stats:', error)
      }
    }
  }

  const refreshUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const userData = await authApi.getMe()
        setUser(userData)
      } catch (error) {
        console.error('Failed to refresh user:', error)
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      stats,
      loading,
      login,
      register,
      logout,
      refreshStats,
      refreshUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
