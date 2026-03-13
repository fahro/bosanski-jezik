import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, User, LogOut, Zap, Menu, X, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, stats, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className="sticky top-0 z-50 border-b border-gray-200/50"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #002395 0%, #1d4ed8 100%)', boxShadow: '0 2px 8px rgba(0,35,149,0.3)' }}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg hidden xs:block">
              <span className="text-gray-900">Bosanski </span>
              <span className="text-blue-700">Jezik</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* XP badge */}
                <div
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-700">{stats?.total_xp || 0} XP</span>
                </div>

                <Link
                  to="/profile"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="Moj profil"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #002395, #1d4ed8)' }}
                  >
                    {(user?.full_name || user?.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user?.full_name?.split(' ')[0] || user?.username}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
                  title="Odjavi se"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Prijava
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-md"
                  style={{ background: 'linear-gradient(135deg, #002395, #1d4ed8)', boxShadow: '0 2px 8px rgba(0,35,149,0.25)' }}
                >
                  Registracija
                </Link>
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-amber-700">{stats?.total_xp || 0}</span>
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden py-2 border-t border-gray-100 animate-fadeIn">
            {isAuthenticated ? (
              <div className="space-y-0.5">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #002395, #1d4ed8)' }}
                  >
                    {(user?.full_name || user?.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{user?.full_name || user?.username}</p>
                    <p className="text-xs text-gray-500">@{user?.username}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-1 ${
                    isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-1 ${
                    isActive('/profile') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Moj profil
                </Link>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg mx-1 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Odjavi se
                </button>
              </div>
            ) : (
              <div className="px-4 py-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 px-4 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Prijava
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 px-4 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg, #002395, #1d4ed8)' }}
                >
                  Registracija
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
