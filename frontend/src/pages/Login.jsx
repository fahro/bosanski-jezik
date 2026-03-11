import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, User, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Greška pri prijavi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex">

      {/* Left branding panel — visible on lg+ */}
      <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-xs text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Bosanski Jezik</h2>
          <p className="text-blue-100 leading-relaxed">
            Naučite bosanski kroz interaktivne lekcije, audio izgovor i kulturne sadržaje.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
            {[
              { n: '36', l: 'Lekcija' },
              { n: '3000+', l: 'Audio' },
              { n: '3', l: 'Nivoa' },
              { n: '3', l: 'Certifikata' },
            ].map(s => (
              <div key={s.l} className="bg-white/10 rounded-xl py-3 px-2">
                <div className="text-xl font-bold">{s.n}</div>
                <div className="text-blue-200 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Bosanski Jezik</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Dobrodošli nazad</h1>
          <p className="text-gray-500 mb-8">Prijavite se na vaš račun</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl mb-6 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Korisničko ime ili email</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" style={{width:18,height:18}} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="field-input-icon"
                  placeholder="Unesite korisničko ime"
                  autoComplete="username"
                  autoCapitalize="none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Lozinka</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{width:18,height:18}} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="field-input pl-11 pr-11"
                  placeholder="Unesite lozinku"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff style={{width:18,height:18}} /> : <Eye style={{width:18,height:18}} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading
                ? <span className="animate-pulse">Prijavljivanje...</span>
                : <><span>Prijavi se</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Nemate račun?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Registrujte se besplatno
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
