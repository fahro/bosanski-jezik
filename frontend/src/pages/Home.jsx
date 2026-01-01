import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  BookOpen, ArrowRight, Volume2, PenTool, CheckCircle, Play, Brain, Sparkles,
  Lock, Award, Users, Globe, Trophy, Target, Zap, Star
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { progressApi } from '../api'

const LEVELS_DATA = [
  { id: 'a1', name: 'Početnik', color: '#22c55e', lessons: 12, description: 'Osnovni pozdravi, brojevi, porodica' },
  { id: 'a2', name: 'Elementarni', color: '#3b82f6', lessons: 12, description: 'Restoran, putovanje, zdravlje' },
  { id: 'b1', name: 'Srednji', color: '#8b5cf6', lessons: 12, description: 'Mišljenja, vijesti, ekonomija' },
  { id: 'b2', name: 'Viši srednji', color: '#f59e0b', lessons: 0, description: 'Uskoro dostupno' },
  { id: 'c1', name: 'Napredni', color: '#ef4444', lessons: 0, description: 'Uskoro dostupno' },
  { id: 'c2', name: 'Profesionalni', color: '#6366f1', lessons: 0, description: 'Uskoro dostupno' }
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
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const isLevelAvailable = (levelId) => {
    if (!isAuthenticated) return levelId === 'a1'
    if (levelId === 'a1') return true
    return levelAccess[levelId]?.has_access || false
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width Gradient */}
      <div className="bg-gradient-to-br from-bosnia-blue via-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Besplatna platforma za učenje</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Naučite <br />
                <span className="text-bosnia-yellow">Bosanski Jezik</span>
              </h1>
              
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Od početnika do naprednog nivoa. Interaktivne lekcije, 
                audio izgovor i završni testovi za certifikat.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartLearning}
                  className="group inline-flex items-center justify-center gap-3 bg-white text-bosnia-blue px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  <span>{isAuthenticated ? 'Moj Dashboard' : 'Započni besplatno'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 text-white border-2 border-white/30 px-6 py-4 rounded-2xl font-medium hover:bg-white/10 transition-all"
                  >
                    Prijava
                  </Link>
                )}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <BookOpen />, value: '36', label: 'Lekcija', color: 'bg-green-500' },
                { icon: <Volume2 />, value: '3000+', label: 'Audio fajlova', color: 'bg-purple-500' },
                { icon: <Trophy />, value: '3', label: 'Nivoa dostupno', color: 'bg-yellow-500' },
                { icon: <Award />, value: '3', label: 'Certifikata', color: 'bg-pink-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                  <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Levels Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nivoi učenja</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Napredujte kroz 6 nivoa - od početnika do profesionalnog govornika. 
            Svaki nivo ima 12 lekcija i završni test za certifikat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {LEVELS_DATA.slice(0, 3).map((level) => {
            const available = isLevelAvailable(level.id)
            const comingSoon = level.lessons === 0
            
            return (
              <div
                key={level.id}
                className={`relative rounded-2xl border-2 overflow-hidden transition-all ${
                  available && !comingSoon
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg cursor-pointer'
                    : 'border-gray-100 opacity-70'
                }`}
                onClick={() => available && !comingSoon && navigate(`/levels/${level.id}`)}
              >
                {/* Header */}
                <div 
                  className="p-6 text-white"
                  style={{ backgroundColor: level.color }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold">{level.id.toUpperCase()}</span>
                    {available && !comingSoon ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6 opacity-70" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{level.name}</h3>
                </div>
                
                {/* Body */}
                <div className="p-6 bg-white">
                  <p className="text-gray-600 mb-4">{level.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      <BookOpen className="w-4 h-4 inline mr-1" />
                      {level.lessons} lekcija
                    </span>
                    {available && !comingSoon ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Dostupno
                      </span>
                    ) : !comingSoon ? (
                      <span className="text-orange-600 font-medium">Zaključano</span>
                    ) : (
                      <span className="text-gray-400">Uskoro</span>
                    )}
                  </div>
                </div>
                
                {/* Locked overlay */}
                {!available && !comingSoon && (
                  <div className="absolute inset-0 bg-gray-900/5 flex items-center justify-center">
                    <div className="bg-white rounded-xl px-4 py-2 shadow-lg text-sm text-gray-600">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Položite {level.id === 'a2' ? 'A1' : 'A2'} završni test
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Coming Soon Levels */}
        <div className="grid grid-cols-3 gap-4">
          {LEVELS_DATA.slice(3).map((level) => (
            <div
              key={level.id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center opacity-60"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 text-white font-bold"
                style={{ backgroundColor: level.color }}
              >
                {level.id.toUpperCase()}
              </div>
              <div className="font-medium text-gray-600">{level.name}</div>
              <div className="text-xs text-gray-400">Uskoro</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kako učimo?</h2>
            <p className="text-gray-600">Svaka lekcija je strukturirana za maksimalno učenje</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <BookOpen />, title: 'Vokabular', desc: '12 novih riječi po lekciji', color: 'bg-blue-500' },
              { icon: <Brain />, title: 'Gramatika', desc: 'Jasna objašnjenja pravila', color: 'bg-purple-500' },
              { icon: <Users />, title: 'Dijalozi', desc: 'Realne konverzacije', color: 'bg-green-500' },
              { icon: <Globe />, title: 'Kultura', desc: 'Bosanska tradicija', color: 'bg-amber-500' }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-6">
            {[
              { icon: <PenTool />, title: 'Vježbe', desc: '5 tipova vježbi', color: 'bg-pink-500' },
              { icon: <Volume2 />, title: 'Audio', desc: 'Izvorni izgovor', color: 'bg-teal-500' },
              { icon: <Target />, title: 'Kvizovi', desc: 'Testiranje znanja', color: 'bg-orange-500' },
              { icon: <Award />, title: 'Certifikat', desc: 'Završni test', color: 'bg-indigo-500' }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-bosnia-yellow to-amber-500 rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Star className="w-12 h-12 mx-auto mb-4 text-white" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {isAuthenticated ? 'Nastavi učenje!' : 'Počni učiti danas!'}
            </h2>
            <p className="text-amber-100 mb-8">
              {isAuthenticated 
                ? 'Tvoj napredak te čeka. Nastavi gdje si stao i osvoji novi certifikat.' 
                : 'Pridruži se hiljadama koji uče bosanski jezik. Potpuno besplatno, bez skrivenih troškova.'}
            </p>
            <button
              onClick={handleStartLearning}
              className="inline-flex items-center gap-3 bg-white text-amber-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-amber-50 transition-all shadow-lg"
            >
              <Play className="w-5 h-5" />
              <span>{isAuthenticated ? 'Nastavi učenje' : 'Započni besplatno'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
