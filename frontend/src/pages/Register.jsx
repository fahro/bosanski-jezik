import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, User, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', fullName: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('Lozinke se ne podudaraju')
    if (form.password.length < 6) return setError('Lozinka mora imati najmanje 6 karaktera')
    setLoading(true)
    try {
      await register(form.username, form.email, form.password, form.fullName)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Greška pri registraciji')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-6 bg-white">
        <div className="card p-10 max-w-sm w-full text-center animate-scaleIn">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Uspješna registracija!</h2>
          <p className="text-gray-500 text-sm">Preusmjeravamo vas na prijavu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex">

      {/* Left branding panel */}
      <div className="hidden lg:flex w-2/5 mesh-bg flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(254,203,0,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)' }}
        />

        <div className="max-w-xs text-center relative z-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Počnite učiti danas</h2>
          <p className="text-blue-200/90 leading-relaxed text-sm">
            Besplatna platforma za učenje bosanskog. Interaktivne lekcije, audio izgovor, certifikati.
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm">
            {['Potpuno besplatno', '36 interaktivnih lekcija', 'Audio izgovor izvornih govornika', 'Certifikat po završetku nivoa'].map(t => (
              <li key={t} className="flex items-center gap-2.5 text-blue-200/90">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
            {[
              { n: '36', l: 'Lekcija' },
              { n: '3000+', l: 'Audio' },
              { n: '3', l: 'Nivoa' },
              { n: '3', l: 'Certifikata' },
            ].map(s => (
              <div
                key={s.l}
                className="py-3 px-2 text-center rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <div className="text-xl font-extrabold text-white">{s.n}</div>
                <div className="text-blue-300 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-10 overflow-y-auto bg-white">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #002395, #1d4ed8)' }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Bosanski Jezik</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Kreirajte račun</h1>
          <p className="text-gray-500 mb-8 text-sm">Pridružite se i počnite učiti besplatno</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl mb-5 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="field-label">Ime i prezime <span className="font-normal text-gray-400">(opcionalno)</span></label>
              <div className="relative">
                <User style={{ width: 18, height: 18 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" value={form.fullName} onChange={set('fullName')} className="field-input-icon" placeholder="Vaše ime i prezime" autoComplete="name" />
              </div>
            </div>

            <div>
              <label className="field-label">Korisničko ime <span className="text-red-400">*</span></label>
              <div className="relative">
                <User style={{ width: 18, height: 18 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" value={form.username} onChange={set('username')} className="field-input-icon" placeholder="Izaberite korisničko ime" autoComplete="username" autoCapitalize="none" required />
              </div>
            </div>

            <div>
              <label className="field-label">Email adresa <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail style={{ width: 18, height: 18 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="email" value={form.email} onChange={set('email')} className="field-input-icon" placeholder="vas@email.com" autoComplete="email" inputMode="email" required />
              </div>
            </div>

            <div>
              <label className="field-label">Lozinka <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock style={{ width: 18, height: 18 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} className="field-input pl-11 pr-11" placeholder="Najmanje 6 karaktera" autoComplete="new-password" required />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showPass ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label">Potvrdite lozinku <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock style={{ width: 18, height: 18 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} className="field-input pl-11 pr-11" placeholder="Ponovite lozinku" autoComplete="new-password" required />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showConfirm ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading
                ? <span className="animate-pulse">Registracija...</span>
                : <><span>Registruj se</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Već imate račun?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
