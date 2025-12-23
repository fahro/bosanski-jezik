import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { progressApi } from '../api'
import { 
  Trophy, Star, Zap, BookOpen, CheckCircle, Lock, 
  ChevronRight, Award, Target, TrendingUp, Clock,
  Play, RotateCcw
} from 'lucide-react'

const LEVEL_COLORS = {
  1: 'from-gray-400 to-gray-500',
  2: 'from-green-400 to-green-600',
  3: 'from-blue-400 to-blue-600',
  4: 'from-purple-400 to-purple-600',
  5: 'from-yellow-400 to-yellow-600',
  6: 'from-orange-400 to-orange-600',
  7: 'from-red-400 to-red-600',
  8: 'from-pink-400 to-pink-600',
  9: 'from-indigo-400 to-indigo-600',
  10: 'from-yellow-300 via-yellow-500 to-amber-600'
}

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-bosnia-blue border-t-transparent"></div>
      </div>
    )
  }

  const levelColor = LEVEL_COLORS[stats?.current_level] || LEVEL_COLORS[1]
  const xpProgress = stats ? ((stats.total_xp - (stats.xp_for_next_level - stats.xp_needed_for_next)) / stats.xp_needed_for_next) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header with User Info */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${levelColor} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Dobrodošli, {user?.full_name || user?.username}! 👋
              </h1>
              <p className="opacity-90 mt-1">
                Nastavite gdje ste stali
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold flex items-center justify-end space-x-2">
                <Star className="w-8 h-8 fill-current" />
                <span>Nivo {stats?.current_level}</span>
              </div>
              <p className="opacity-90">{stats?.level_name}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{stats?.total_xp || 0}</div>
            <div className="text-sm text-blue-600">Ukupno XP</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats?.lessons_completed || 0}/12</div>
            <div className="text-sm text-green-600">Završene lekcije</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{stats?.quizzes_completed || 0}</div>
            <div className="text-sm text-purple-600">Položeni kvizovi</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-800">{stats?.average_quiz_score?.toFixed(0) || 0}%</div>
            <div className="text-sm text-yellow-600">Prosječan rezultat</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Napredak do nivoa {(stats?.current_level || 1) + 1}</span>
            <span>{stats?.xp_needed_for_next || 0} XP preostalo</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${levelColor} transition-all duration-500`}
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      {stats?.current_lesson_id <= 12 && (
        <div className="bg-gradient-to-r from-bosnia-blue to-blue-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Nastavite učenje</h2>
              <p className="opacity-90">
                Lekcija {stats.current_lesson_id} vas čeka
              </p>
            </div>
            <Link
              to={`/lesson/${stats.current_lesson_id}`}
              className="bg-white text-bosnia-blue px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Nastavi</span>
            </Link>
          </div>
        </div>
      )}

      {/* Lesson Progress Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <BookOpen className="w-6 h-6" />
          <span>Vaš napredak po lekcijama</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessonProgress.map((lesson) => {
            const isLocked = lesson.lesson_id > (stats?.current_lesson_id || 1) && !lesson.started
            const progressPercent = lesson.completed ? 100 : 
              ((lesson.vocabulary_viewed ? 20 : 0) +
               (lesson.grammar_viewed ? 20 : 0) +
               (lesson.dialogue_viewed ? 20 : 0) +
               (lesson.culture_viewed ? 20 : 0) +
               (lesson.quiz_completed ? 20 : 0))

            return (
              <Link
                key={lesson.lesson_id}
                to={isLocked ? '#' : `/lesson/${lesson.lesson_id}`}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                  isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                <div className={`h-2 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-bosnia-blue transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Lekcija {lesson.lesson_id}</span>
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : lesson.started ? (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ) : null}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {lesson.completed ? 'Završeno' : lesson.started ? 'U toku' : isLocked ? 'Zaključano' : 'Započni'}
                      </div>
                      {lesson.best_quiz_percentage > 0 && (
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span>Kviz: {lesson.best_quiz_percentage.toFixed(0)}%</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-bosnia-blue">
                      +{lesson.xp_earned} XP
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Final Test Section */}
      <div className={`rounded-2xl shadow-lg overflow-hidden ${
        stats?.can_take_final_test 
          ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
          : 'bg-gray-100'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className={stats?.can_take_final_test ? 'text-white' : 'text-gray-600'}>
              <div className="flex items-center space-x-3 mb-2">
                <Award className="w-8 h-8" />
                <h2 className="text-xl font-bold">Završni Test</h2>
              </div>
              <p className="opacity-90">
                {stats?.can_take_final_test 
                  ? '120 pitanja iz svih lekcija - Jeste li spremni?' 
                  : `Završite sve lekcije da otključate (${stats?.lessons_completed || 0}/12)`}
              </p>
              {stats?.final_test_passed && (
                <div className="mt-2 flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Položeno! Najbolji rezultat: {stats.best_final_score}%</span>
                </div>
              )}
            </div>
            
            {stats?.can_take_final_test ? (
              <Link
                to="/final-test"
                className="bg-white text-amber-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                {stats?.final_test_passed ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{stats?.final_test_passed ? 'Ponovi' : 'Započni'}</span>
              </Link>
            ) : (
              <div className="bg-gray-200 text-gray-500 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Zaključano</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
