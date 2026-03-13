import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen, ArrowRight, Volume2, PenTool, CheckCircle, Play, Brain, Sparkles,
  Lock, Award, Users, Globe, Trophy, Target, Star
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { progressApi } from '../api'

const LEVELS_DATA = [
  { id: 'a1', name: 'Početnik', color: '#22c55e', colorDark: '#16a34a', lessons: 12, description: 'Osnovni pozdravi, brojevi, porodica i svakodnevni razgovor.' },
  { id: 'a2', name: 'Elementarni', color: '#3b82f6', colorDark: '#2563eb', lessons: 12, description: 'Restoran, putovanje, zdravlje i opisivanje okoline.' },
  { id: 'b1', name: 'Srednji', color: '#8b5cf6', colorDark: '#7c3aed', lessons: 12, description: 'Mišljenja, vijesti, ekonomija i složenije teme.' },
  { id: 'b2', name: 'Viši srednji', color: '#f59e0b', colorDark: '#d97706', lessons: 0, description: 'Uskoro dostupno' },
  { id: 'c1', name: 'Napredni', color: '#ef4444', colorDark: '#dc2626', lessons: 0, description: 'Uskoro dostupno' },
  { id: 'c2', name: 'Profesionalni', color: '#6366f1', colorDark: '#4f46e5', lessons: 0, description: 'Uskoro dostupno' }
]

function Home() {
  const { isAuthenticated, stats } = useAuth()
  const navigate = useNavigate()
  const [levelAccess, setLevelAccess] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLevelAccess()
  }, [isAuthenticated])

  const loadLevelAccess = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    try {
      const accessPromises = ['a1', 'a2', 'b1'].map(async (level) => {
        try {
          const access = await progressApi.checkLevelAccess(level)
          return { id: level, ...access }
        } catch {
          return { id: level, has_access: level === 'a1' }
        }
      })
      const results = await Promise.all(accessPromises)
      const accessMap = {}
      results.forEach(r => { accessMap[r.id] = r })
      setLevelAccess(accessMap)
    } catch (err) {
      console.error('Error loading level access:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartLearning = (e) => {
    e.preventDefault()
    navigate(isAuthenticated ? '/dashboard' : '/register')
  }

  const isLevelAvailable = (levelId) => {
    if (!isAuthenticated) return levelId === 'a1'
    if (levelId === 'a1') return true
    return levelAccess[levelId]?.has_access || false
  }

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="mesh-bg text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div
          className="absolute -top-40 -right-32 w-[28rem] h-[28rem] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(254,203,0,0.07) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -left-16 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — copy */}
            <div className="animate-fadeIn">
              <div className="glass-card-sm inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-200 mb-7">
                <Sparkles className="w-3.5 h-3.5 text-bosnia-yellow" />
                <span>Besplatna platforma za učenje</span>
              </div>

              <h1 className="font-extrabold leading-none tracking-tight mb-7">
                <span className="block text-[3.25rem] md:text-[4rem] lg:text-[5rem] text-white">Naučite</span>
                <span className="block text-[3.25rem] md:text-[4rem] lg:text-[5rem] text-gradient-hero">Bosanski</span>
                <span className="block text-[3.25rem] md:text-[4rem] lg:text-[5rem] text-gradient-hero">Jezik</span>
              </h1>

              <p className="text-base md:text-lg text-blue-200/85 mb-10 max-w-md leading-relaxed">
                Od početnika do naprednog nivoa. Interaktivne lekcije,
                audio izgovor i završni testovi za certifikat.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleStartLearning} className="btn-gold group">
                  <Play className="w-5 h-5" />
                  <span>{isAuthenticated ? 'Moj Dashboard' : 'Započni besplatno'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="glass-card inline-flex items-center justify-center gap-2 text-white/80 hover:text-white px-6 py-4 font-medium transition-all min-h-[48px]"
                  >
                    Prijava
                  </Link>
                )}
              </div>
            </div>

            {/* Right — stats cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: <BookOpen className="w-5 h-5" />, value: '36', label: 'Lekcija', iconColor: '#34d399', iconBg: 'rgba(52,211,153,0.15)' },
                { icon: <Volume2 className="w-5 h-5" />, value: '3000+', label: 'Audio fajlova', iconColor: '#a78bfa', iconBg: 'rgba(167,139,250,0.15)' },
                { icon: <Trophy className="w-5 h-5" />, value: '3', label: 'Nivoa dostupno', iconColor: '#FECB00', iconBg: 'rgba(254,203,0,0.15)' },
                { icon: <Award className="w-5 h-5" />, value: '3', label: 'Certifikata', iconColor: '#f472b6', iconBg: 'rgba(244,114,182,0.15)' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-5 text-center">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: stat.iconBg, color: stat.iconColor }}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-300 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Levels ── */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <BookOpen className="w-4 h-4" />
              Struktura kursa
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Nivoi učenja</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Napredujte kroz 6 nivoa — od početnika do profesionalnog govornika.
              Svaki nivo ima 12 lekcija i završni test za certifikat.
            </p>
          </div>

          {/* Active levels */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {LEVELS_DATA.slice(0, 3).map((level) => {
              const available = isLevelAvailable(level.id)
              const comingSoon = level.lessons === 0

              return (
                <div
                  key={level.id}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
                    available && !comingSoon
                      ? 'cursor-pointer hover:-translate-y-1.5 shadow-md hover:shadow-2xl'
                      : 'opacity-65 shadow-sm'
                  }`}
                  onClick={() => available && !comingSoon && navigate(`/levels/${level.id}`)}
                >
                  {/* Gradient header */}
                  <div
                    className="px-6 py-7 text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${level.color}, ${level.colorDark})` }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{ backgroundImage: 'radial-gradient(circle at 85% 40%, white 0%, transparent 60%)' }}
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl font-black tracking-tight">{level.id.toUpperCase()}</span>
                        <div className="bg-white/20 rounded-full p-1.5">
                          {available && !comingSoon
                            ? <CheckCircle className="w-5 h-5" />
                            : <Lock className="w-5 h-5 opacity-70" />
                          }
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white/95">{level.name}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 bg-white">
                    <p className="text-gray-500 mb-5 text-sm leading-relaxed">{level.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        {level.lessons} lekcija
                      </span>
                      {available && !comingSoon ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-50">Dostupno</span>
                      ) : !comingSoon ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-amber-700 bg-amber-50">Zaključano</span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-gray-500 bg-gray-100">Uskoro</span>
                      )}
                    </div>
                  </div>

                  {/* Locked overlay */}
                  {!available && !comingSoon && (
                    <div className="absolute inset-0 bg-gray-900/5 flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Položite {level.id === 'a2' ? 'A1' : 'A2'} završni test
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Coming soon levels */}
          <div className="grid grid-cols-3 gap-4">
            {LEVELS_DATA.slice(3).map((level) => (
              <div key={level.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center opacity-50">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm"
                  style={{ backgroundColor: level.color }}
                >
                  {level.id.toUpperCase()}
                </div>
                <div className="font-semibold text-gray-600 text-sm">{level.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">Uskoro</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="py-20 border-y border-gray-100" style={{ backgroundColor: '#f8f9ff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Metod učenja
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Kako učimo?</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Svaka lekcija je strukturirana za maksimalno učenje i dugotrajno zadržavanje znanja
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <BookOpen className="w-6 h-6" />, title: 'Vokabular', desc: '12 novih riječi po lekciji', c: '#3b82f6', bg: '#eff6ff' },
              { icon: <Brain className="w-6 h-6" />, title: 'Gramatika', desc: 'Jasna objašnjenja pravila', c: '#8b5cf6', bg: '#f5f3ff' },
              { icon: <Users className="w-6 h-6" />, title: 'Dijalozi', desc: 'Realne konverzacije', c: '#10b981', bg: '#ecfdf5' },
              { icon: <Globe className="w-6 h-6" />, title: 'Kultura', desc: 'Bosanska tradicija', c: '#f59e0b', bg: '#fffbeb' },
              { icon: <PenTool className="w-6 h-6" />, title: 'Vježbe', desc: '5 tipova vježbi', c: '#ec4899', bg: '#fdf2f8' },
              { icon: <Volume2 className="w-6 h-6" />, title: 'Audio', desc: 'Izvorni izgovor', c: '#0d9488', bg: '#f0fdfa' },
              { icon: <Target className="w-6 h-6" />, title: 'Kvizovi', desc: 'Testiranje znanja', c: '#f97316', bg: '#fff7ed' },
              { icon: <Award className="w-6 h-6" />, title: 'Certifikat', desc: 'Završni test', c: '#6366f1', bg: '#eef2ff' }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: feature.bg, color: feature.c }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-3xl px-8 md:px-16 py-14 md:py-16 text-center"
            style={{ background: 'linear-gradient(135deg, #080d2a 0%, #002395 55%, #0a1260 100%)' }}
          >
            {/* Glow orbs */}
            <div
              className="absolute top-0 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(254,203,0,0.09) 0%, transparent 70%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 translate-y-1/2 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
            />

            <div className="relative z-10 max-w-xl mx-auto">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'rgba(254, 203, 0, 0.18)' }}
              >
                <Star className="w-7 h-7 text-bosnia-yellow" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                {isAuthenticated ? 'Nastavi učenje!' : 'Počni učiti danas!'}
              </h2>
              <p className="text-blue-200/85 mb-10 text-base leading-relaxed">
                {isAuthenticated
                  ? 'Tvoj napredak te čeka. Nastavi gdje si stao i osvoji novi certifikat.'
                  : 'Pridruži se hiljadama koji uče bosanski jezik. Potpuno besplatno, bez skrivenih troškova.'}
              </p>
              <button onClick={handleStartLearning} className="btn-gold inline-flex items-center gap-3 px-8 py-4 text-base">
                <Play className="w-5 h-5" />
                <span>{isAuthenticated ? 'Nastavi učenje' : 'Započni besplatno'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
