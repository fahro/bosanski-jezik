import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, ArrowRight, Volume2, PenTool, CheckCircle, Play, Brain, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { isAuthenticated, stats } = useAuth()
  const navigate = useNavigate()

  const handleStartLearning = (e) => {
    e.preventDefault()
    if (isAuthenticated && stats?.current_lesson_id) {
      navigate(`/lesson/${stats.current_lesson_id}`)
    } else {
      navigate('/levels/a1')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Hero Section - Clean & Modern */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-bosnia-blue/10 text-bosnia-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Besplatna platforma za učenje</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Naučite{' '}
          <span className="text-bosnia-blue">Bosanski</span>
          <br />
          <span className="text-bosnia-yellow">Jezik</span>
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Interaktivne lekcije, audio izgovor i vježbe pisanja. 
          Počnite od nule i napredujte do fluentnosti.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartLearning}
            className="group inline-flex items-center gap-3 bg-bosnia-blue text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-bosnia-blue/90 transition-all shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5" />
            <span>{isAuthenticated ? 'Nastavi učenje' : 'Započni učenje'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-gray-600 px-6 py-4 rounded-2xl font-medium hover:bg-gray-100 transition-all"
          >
            <span>Kreiraj račun</span>
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap justify-center gap-8 mb-16 py-6 border-y border-gray-100">
        {[
          { value: '12', label: 'Lekcija' },
          { value: '200+', label: 'Riječi' },
          { value: '100+', label: 'Vježbi' },
          { value: '1000+', label: 'Audio' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid - Clean Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-16">
        {[
          {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Strukturirane lekcije",
            desc: "Vokabular, gramatika, dijalozi i kultura",
            color: "bg-blue-500"
          },
          {
            icon: <Volume2 className="w-6 h-6" />,
            title: "Audio izgovor",
            desc: "Slušajte izvorne govornike",
            color: "bg-green-500"
          },
          {
            icon: <PenTool className="w-6 h-6" />,
            title: "Vježbe pisanja",
            desc: "5 tipova interaktivnih vježbi",
            color: "bg-purple-500"
          },
          {
            icon: <Brain className="w-6 h-6" />,
            title: "Kvizovi",
            desc: "Testirajte svoje znanje",
            color: "bg-amber-500"
          }
        ].map((feature, i) => (
          <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
            <div className={`${feature.color} text-white p-3 rounded-xl`}>
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Levels Preview */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Nivoi učenja</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'A1', name: 'Početnik', available: true },
            { id: 'A2', name: 'Elementarni', available: false },
            { id: 'B1', name: 'Srednji', available: false },
            { id: 'B2', name: 'Viši', available: false },
            { id: 'C1', name: 'Napredni', available: false },
            { id: 'C2', name: 'Profesionalni', available: false }
          ].map((level) => (
            <Link
              key={level.id}
              to={level.available ? `/levels/${level.id.toLowerCase()}` : '#'}
              className={`
                relative text-center p-4 rounded-2xl border-2 transition-all
                ${level.available 
                  ? 'border-bosnia-blue bg-bosnia-blue/5 hover:bg-bosnia-blue/10' 
                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'}
              `}
            >
              {level.available && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`text-2xl font-bold mb-1 ${level.available ? 'text-bosnia-blue' : 'text-gray-400'}`}>
                {level.id}
              </div>
              <div className="text-xs text-gray-500">{level.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-bosnia-blue to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {isAuthenticated ? 'Nastavi gdje si stao?' : 'Spremni za početak?'}
        </h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">
          {isAuthenticated 
            ? 'Nastavi učenje i napreduj kroz lekcije.' 
            : 'Počnite besplatno sa A1 nivoom i napredujte kroz 12 strukturiranih lekcija.'}
        </p>
        <button
          onClick={handleStartLearning}
          className="inline-flex items-center gap-3 bg-white text-bosnia-blue px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all"
        >
          <Play className="w-5 h-5" />
          <span>{isAuthenticated ? 'Nastavi učenje' : 'Počni sa A1 nivoom'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default Home
