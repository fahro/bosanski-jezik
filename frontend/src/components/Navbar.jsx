import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Home, GraduationCap } from 'lucide-react'

function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
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
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
