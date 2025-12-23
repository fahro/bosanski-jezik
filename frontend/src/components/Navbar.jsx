import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Home, GraduationCap, User, LogIn, LogOut, LayoutDashboard, Zap, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, stats, isAuthenticated, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    setShowMenu(false)
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b-4 border-bosnia-yellow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-bosnia-blue to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-bosnia-blue">Bosanski</span>
              <span className="font-bold text-xl text-bosnia-yellow ml-1">Jezik</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-bosnia-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Početna</span>
            </Link>
            
            <Link
              to="/levels"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/levels')
                  ? 'bg-bosnia-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="hidden sm:inline">Nivoi</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/dashboard')
                      ? 'bg-bosnia-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-bosnia-blue to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-semibold">{stats?.current_level || 1}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-semibold">{stats?.total_xp || 0}</span>
                      </div>
                    </div>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{user?.full_name || user?.username}</p>
                        <p className="text-sm text-gray-500">Nivo {stats?.current_level} • {stats?.total_xp} XP</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Odjavi se</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/login')
                      ? 'bg-bosnia-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline">Prijava</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-bosnia-yellow text-gray-800 hover:bg-yellow-400 transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Registracija</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
