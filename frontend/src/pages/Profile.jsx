import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { User, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Profile() {
  const { user, isAuthenticated, refreshUser } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  // Split full_name into first/last for display
  const nameParts = (user?.full_name || '').trim().split(/\s+/)
  const [firstName, setFirstName] = useState(nameParts[0] || '')
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [nameStatus, setNameStatus] = useState(null) // null | 'success' | 'error'
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

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Moj profil</h1>

      {/* Account info (read-only) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
            {(user?.full_name || user?.username || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.full_name || user?.username}</p>
            <p className="text-sm text-gray-500">@{user?.username}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Email: <span className="text-gray-700">{user?.email}</span></p>
        </div>
      </div>

      {/* Edit name */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Ime i prezime</h2>
        </div>
        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="Ime"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="Prezime"
              />
            </div>
          </div>

          {nameStatus && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
              nameStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {nameStatus === 'success'
                ? <CheckCircle className="w-4 h-4" />
                : <AlertCircle className="w-4 h-4" />}
              {nameMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={nameLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            {nameLoading ? 'Čuvanje...' : 'Sačuvaj ime'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Promjena lozinke</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { label: 'Trenutna lozinka', value: currentPassword, setter: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: 'Nova lozinka', value: newPassword, setter: setNewPassword, show: showNew, toggle: () => setShowNew(v => !v) },
            { label: 'Potvrdi novu lozinku', value: confirmPassword, setter: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
          ].map(({ label, value, setter, show, toggle }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {passStatus && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
              passStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {passStatus === 'success'
                ? <CheckCircle className="w-4 h-4" />
                : <AlertCircle className="w-4 h-4" />}
              {passMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={passLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            {passLoading ? 'Mijenjanje...' : 'Promijeni lozinku'}
          </button>
        </form>
      </div>
    </div>
  )
}
