import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, ChevronRight, ArrowLeft, Lock, CheckCircle } from 'lucide-react'
import { api, progressApi } from '../api'
import { useAuth } from '../context/AuthContext'

function LessonList() {
  const { levelId } = useParams()
  const [lessons, setLessons] = useState([])
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lessonProgress, setLessonProgress] = useState([])
  const { isAuthenticated, stats } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelData, lessonsData] = await Promise.all([
          api.get(`/api/levels/${levelId}`),
          api.get(`/api/levels/${levelId}/lessons`)
        ])
        setLevel(levelData)
        setLessons(lessonsData)

        if (isAuthenticated) {
          try {
            const progress = await progressApi.getAllProgress(levelId)
            setLessonProgress(progress)
          } catch (err) {
            console.error('Error fetching progress:', err)
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [levelId, isAuthenticated])

  const isLessonUnlocked = (lessonId) => {
    if (!isAuthenticated) return true
    if (lessonId === 1) return true
    if (lessonId <= (stats?.current_lesson_id || 1)) return true
    const prev = lessonProgress.find(p => p.lesson_id === lessonId - 1)
    return prev?.quiz_passed || false
  }

  const isLessonCompleted = (lessonId) => {
    const progress = lessonProgress.find(p => p.lesson_id === lessonId)
    return progress?.completed || false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto px-4 py-12 text-center">
        <div className="card p-8">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Registracija potrebna</h2>
          <p className="text-gray-500 text-sm mb-6">
            Da biste pristupili lekcijama, registrujte se — besplatno!
          </p>
          <div className="space-y-3">
            <Link to="/register" className="btn-primary w-full block text-center">
              Registruj se besplatno
            </Link>
            <Link to="/login" className="btn-secondary w-full block text-center">
              Prijava
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const modules = lessons.reduce((acc, lesson) => {
    const m = lesson.module
    if (!acc[m]) acc[m] = []
    acc[m].push(lesson)
    return acc
  }, {})

  const completedCount = lessonProgress.filter(p => p.completed).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        to="/levels"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Nazad na nivoe
      </Link>

      {/* Level header */}
      {level && (
        <div className="card p-5 mb-6 animate-fadeIn flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: level.color }}
          >
            {level.id.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{level.name}</h1>
            <p className="text-sm text-gray-500">{level.description}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{completedCount}/{level.total_lessons} završeno</span>
            </div>
          </div>
        </div>
      )}

      {/* Modules */}
      {Object.entries(modules).map(([moduleNum, moduleLessons]) => (
        <div key={moduleNum} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
              {moduleNum}
            </div>
            <h2 className="font-semibold text-gray-700 text-sm">Modul {moduleNum}</h2>
          </div>

          <div className="space-y-2">
            {moduleLessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(lesson.id)
              const completed = isLessonCompleted(lesson.id)

              if (!unlocked) {
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-60 animate-slideIn"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-500 text-sm">{lesson.title}</p>
                      <p className="text-xs text-gray-400 truncate">{lesson.description}</p>
                    </div>
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                  </div>
                )
              }

              return (
                <Link
                  key={lesson.id}
                  to={`/lesson/${lesson.id}?level=${levelId}`}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md animate-slideIn ${
                    completed
                      ? 'bg-green-50 border-green-100 hover:border-green-200'
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                    completed ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {completed ? <CheckCircle className="w-5 h-5" /> : lesson.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{lesson.title}</p>
                    <p className="text-xs text-gray-500 truncate">{lesson.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {lesson.vocabulary?.length > 0 && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {lesson.vocabulary.length} riječi
                        </span>
                      )}
                      {lesson.quiz?.length > 0 && (
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                          {lesson.quiz.length} pitanja
                        </span>
                      )}
                      {completed && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                          Završeno
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default LessonList
