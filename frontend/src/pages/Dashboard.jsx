import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { progressApi } from '../api'
import { 
  Trophy, Star, Zap, BookOpen, CheckCircle, Lock, 
  ChevronRight, Award, Play, ArrowRight, Flame, Target
} from 'lucide-react'

const LESSONS = [
  { id: 1, title: 'Pozdravi', subtitle: 'Greetings', emoji: '👋' },
  { id: 2, title: 'Brojevi', subtitle: 'Numbers', emoji: '🔢' },
  { id: 3, title: 'Boje', subtitle: 'Colors', emoji: '🎨' },
  { id: 4, title: 'Porodica', subtitle: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 5, title: 'Dani', subtitle: 'Days', emoji: '📅' },
  { id: 6, title: 'Mjeseci', subtitle: 'Months', emoji: '🗓️' },
  { id: 7, title: 'Hrana', subtitle: 'Food', emoji: '🍽️' },
  { id: 8, title: 'Kuća', subtitle: 'Home', emoji: '🏠' },
  { id: 9, title: 'Tijelo', subtitle: 'Body', emoji: '🧍' },
  { id: 10, title: 'Zanimanja', subtitle: 'Jobs', emoji: '💼' },
  { id: 11, title: 'Vrijeme', subtitle: 'Time', emoji: '⏰' },
  { id: 12, title: 'Fraze', subtitle: 'Phrases', emoji: '💬' }
]

export default function Dashboard() {
  const { user, stats, refreshStats, isAuthenticated } = useAuth()
  const [lessonProgress, setLessonProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadProgress()
  }, [isAuthenticated])

  const loadProgress = async () => {
    try {
      const progress = await progressApi.getAllProgress()
      setLessonProgress(progress)
      await refreshStats()
    } catch (error) {
      console.error('Failed to load progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-bosnia-blue border-t-transparent"></div>
      </div>
    )
  }

  const xpProgress = stats?.xp_needed_for_next ? 
    ((stats.xp_for_next_level - stats.xp_needed_for_next) / stats.xp_for_next_level) * 100 : 0

  const currentLessonInfo = LESSONS.find(l => l.id === stats?.current_lesson_id)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Welcome & Stats Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left - Welcome */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Zdravo, {user?.full_name?.split(' ')[0] || user?.username}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Nastavi učiti bosanski jezik</p>
          </div>
          
          {/* Right - Level & XP */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-bosnia-yellow">
                <Flame className="w-5 h-5" />
                <span className="text-2xl font-bold text-gray-900">{stats?.current_level || 1}</span>
              </div>
              <span className="text-xs text-gray-500">Nivo</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-bosnia-blue">
                <Zap className="w-5 h-5" />
                <span className="text-2xl font-bold text-gray-900">{stats?.total_xp || 0}</span>
              </div>
              <span className="text-xs text-gray-500">XP</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span className="text-2xl font-bold text-gray-900">{stats?.lessons_completed || 0}</span>
              </div>
              <span className="text-xs text-gray-500">Završeno</span>
            </div>
          </div>
        </div>
        
        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Nivo {stats?.current_level || 1}</span>
            <span>Nivo {(stats?.current_level || 1) + 1}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-bosnia-blue to-bosnia-yellow transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {stats?.xp_needed_for_next || 0} XP do sljedećeg nivoa
          </p>
        </div>
      </div>

      {/* Continue Learning Card */}
      {stats?.current_lesson_id <= 12 && currentLessonInfo && (
        <Link
          to={`/lesson/${stats.current_lesson_id}`}
          className="block bg-gradient-to-br from-bosnia-blue to-blue-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                {currentLessonInfo.emoji}
              </div>
              <div>
                <p className="text-white/70 text-sm">Nastavi učiti</p>
                <h2 className="text-xl font-bold">
                  Lekcija {stats.current_lesson_id}: {currentLessonInfo.title}
                </h2>
                <p className="text-white/70 text-sm">{currentLessonInfo.subtitle}</p>
              </div>
            </div>
            <div className="bg-white text-bosnia-blue p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6" />
            </div>
          </div>
        </Link>
      )}

      {/* Lessons Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sve lekcije</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {LESSONS.map((lesson) => {
            const progress = lessonProgress.find(p => p.lesson_id === lesson.id)
            const isLocked = lesson.id > (stats?.current_lesson_id || 1) && !progress?.started
            const isCurrent = lesson.id === stats?.current_lesson_id
            const isCompleted = progress?.completed

            return (
              <Link
                key={lesson.id}
                to={isLocked ? '#' : `/lesson/${lesson.id}`}
                onClick={(e) => isLocked && e.preventDefault()}
                className={`
                  relative bg-white rounded-2xl p-4 border-2 transition-all
                  ${isCompleted ? 'border-green-200 bg-green-50/50' : 
                    isCurrent ? 'border-bosnia-blue shadow-md' : 
                    isLocked ? 'border-gray-100 opacity-50 cursor-not-allowed' : 
                    'border-gray-100 hover:border-gray-200 hover:shadow-sm'}
                `}
              >
                {/* Status badge */}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full p-1">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                {isCurrent && !isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-bosnia-blue text-white rounded-full px-2 py-0.5 text-xs font-medium">
                    Trenutna
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl mb-2">{lesson.emoji}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{lesson.title}</h3>
                  <p className="text-xs text-gray-500">{lesson.subtitle}</p>
                  
                  {/* Mini progress */}
                  {progress && !isLocked && (
                    <div className="mt-3 flex justify-center gap-1">
                      {['vocabulary_viewed', 'grammar_viewed', 'dialogue_viewed', 'culture_viewed', 'quiz_passed'].map((key, idx) => (
                        <div 
                          key={key}
                          className={`w-2 h-2 rounded-full ${progress[key] ? 'bg-green-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {progress?.xp_earned > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-2">+{progress.xp_earned} XP</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Final Test Card */}
      <div className={`rounded-3xl p-6 ${
        stats?.can_take_final_test 
          ? 'bg-gradient-to-br from-bosnia-yellow to-amber-500 text-white' 
          : 'bg-gray-50 border border-gray-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              stats?.can_take_final_test ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              <Award className={`w-7 h-7 ${stats?.can_take_final_test ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${stats?.can_take_final_test ? 'text-white' : 'text-gray-900'}`}>
                Završni Test
              </h3>
              <p className={`text-sm ${stats?.can_take_final_test ? 'text-white/80' : 'text-gray-500'}`}>
                {stats?.can_take_final_test 
                  ? '120 pitanja • Testiraj svoje znanje' 
                  : `Završi sve lekcije (${stats?.lessons_completed || 0}/12)`}
              </p>
              {stats?.final_test_passed && (
                <p className="text-sm text-white/90 flex items-center gap-1 mt-1">
                  <Trophy className="w-4 h-4" /> Najbolji: {stats.best_final_score}%
                </p>
              )}
            </div>
          </div>
          
          {stats?.can_take_final_test ? (
            <Link
              to="/final-test"
              className="bg-white text-amber-600 px-5 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              <span>Započni</span>
            </Link>
          ) : (
            <div className="bg-gray-200 text-gray-400 px-5 py-3 rounded-xl font-medium flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>Zaključano</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
