import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { User, Lock, CheckCircle, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Profile() {
  const { user, isAuthenticated, refreshUser } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const nameParts = (user?.full_name || '').trim().split(/\s+/)
  const [firstName, setFirstName] = useState(nameParts[0] || '')
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [nameStatus, setNameStatus] = useState(null)
  const [nameMessage, setNameMessage] = useState('')
  const [nameLoading, setNameLoading] = useState(false)

  const [passStatus, setPassStatus] = useState(null)
  const [passMessage, setPassMessage] = useState('')
  const [passLoading, setPassLoading] = useState(false)

  const handleSaveName = async (e) => {
    e.preventDefault()
    const full_name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
    if (!full_name) {
      setNameStatus('error')
      setNameMessage('Ime ne može biti prazno.')
      return
    }
    setNameLoading(true)
    setNameStatus(null)
    try {
      await authApi.updateProfile({ full_name })
      await refreshUser()
      setNameStatus('success')
      setNameMessage('Ime je uspješno ažurirano.')
    } catch (err) {
      setNameStatus('error')
      setNameMessage(err.message || 'Greška pri ažuriranju.')
    } finally {
      setNameLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPassStatus('error')
      setPassMessage('Nove lozinke se ne podudaraju.')
      return
    }
    if (newPassword.length < 6) {
      setPassStatus('error')
      setPassMessage('Nova lozinka mora imati najmanje 6 karaktera.')
      return
    }
    setPassLoading(true)
    setPassStatus(null)
    try {
      await authApi.updateProfile({ current_password: currentPassword, new_password: newPassword })
      setPassStatus('success')
      setPassMessage('Lozinka je uspješno promijenjena.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPassStatus('error')
      setPassMessage(err.message || 'Greška pri promjeni lozinke.')
    } finally {
      setPassLoading(false)
    }
  }

  const StatusBanner = ({ status, message }) => status ? (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
      status === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      {status === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  ) : null

  const PasswordField = ({ label, value, setter, show, toggle, autoComplete }) => (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 18, height: 18 }} />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => setter(e.target.value)}
          className="field-input pl-11 pr-11"
          placeholder="••••••••"
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          {show ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Moj profil</h1>

      {/* Account overview */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {(user?.full_name || user?.username || '?').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{user?.full_name || user?.username}</p>
          <p className="text-sm text-gray-500">@{user?.username}</p>
          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Edit name */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Ime i prezime</h2>
        </div>
        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Ime</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="field-input"
                placeholder="Vaše ime"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="field-label">Prezime</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="field-input"
                placeholder="Vaše prezime"
                autoComplete="family-name"
              />
            </div>
          </div>
          <StatusBanner status={nameStatus} message={nameMessage} />
          <button type="submit" disabled={nameLoading} className="btn-primary w-full">
            {nameLoading ? <span className="animate-pulse">Čuvanje...</span> : <><span>Sačuvaj ime</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Promjena lozinke</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordField
            label="Trenutna lozinka"
            value={currentPassword}
            setter={setCurrentPassword}
            show={showCurrent}
            toggle={() => setShowCurrent(v => !v)}
            autoComplete="current-password"
          />
          <PasswordField
            label="Nova lozinka"
            value={newPassword}
            setter={setNewPassword}
            show={showNew}
            toggle={() => setShowNew(v => !v)}
            autoComplete="new-password"
          />
          <PasswordField
            label="Potvrdi novu lozinku"
            value={confirmPassword}
            setter={setConfirmPassword}
            show={showConfirm}
            toggle={() => setShowConfirm(v => !v)}
            autoComplete="new-password"
          />
          <StatusBanner status={passStatus} message={passMessage} />
          <button type="submit" disabled={passLoading} className="btn-primary w-full">
            {passLoading ? <span className="animate-pulse">Mijenjanje...</span> : <><span>Promijeni lozinku</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  )
}
