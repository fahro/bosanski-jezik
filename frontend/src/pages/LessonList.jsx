import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Clock, ChevronRight, ArrowLeft, Lock, CheckCircle } from 'lucide-react'
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

        // Fetch progress if authenticated
        if (isAuthenticated) {
          try {
            const progress = await progressApi.getAllProgress()
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

  // Check if a lesson is unlocked
  const isLessonUnlocked = (lessonId) => {
    if (!isAuthenticated) return true // Allow all if not logged in (guest mode)
    return lessonId <= (stats?.current_lesson_id || 1)
  }

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId) => {
    const progress = lessonProgress.find(p => p.lesson_id === lessonId)
    return progress?.completed || false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-bosnia-blue border-t-transparent"></div>
      </div>
    )
  }

  // Require authentication to view lessons
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registracija potrebna</h2>
          <p className="text-gray-600 mb-6">
            Da biste pristupili lekcijama, potrebno je da se registrujete ili prijavite. Registracija je besplatna!
          </p>
          <div className="space-y-3">
            <Link
              to="/register"
              className="block w-full bg-bosnia-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Registruj se besplatno
            </Link>
            <Link
              to="/login"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Već imam račun - Prijava
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const modules = lessons.reduce((acc, lesson) => {
    const moduleNum = lesson.module
    if (!acc[moduleNum]) acc[moduleNum] = []
    acc[moduleNum].push(lesson)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/levels"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-bosnia-blue mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Nazad na nivoe</span>
      </Link>

      {level && (
        <div
          className="bg-white rounded-xl p-6 shadow-md mb-8 border-l-4 animate-fadeIn"
          style={{ borderLeftColor: level.color }}
        >
          <div className="flex items-center space-x-4">
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: level.color }}
            >
              {level.id.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{level.name}</h1>
              <p className="text-gray-600">{level.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{level.total_lessons} lekcija</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {Object.entries(modules).map(([moduleNum, moduleLessons]) => (
        <div key={moduleNum} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <span className="w-8 h-8 bg-bosnia-blue text-white rounded-lg flex items-center justify-center text-sm">
              M{moduleNum}
            </span>
            <span>Modul {moduleNum}</span>
          </h2>
          
          <div className="grid gap-4">
            {moduleLessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(lesson.id)
              const completed = isLessonCompleted(lesson.id)

              if (!unlocked) {
                // Locked lesson - not clickable
                return (
                  <div
                    key={lesson.id}
                    className="block bg-gray-100 rounded-xl p-5 shadow-md opacity-60 cursor-not-allowed animate-slideIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center text-gray-500 font-bold">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-500">{lesson.title}</h3>
                          <p className="text-sm text-gray-400">{lesson.description}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                              🔒 Završite prethodnu lekciju
                            </span>
                          </div>
                        </div>
                      </div>
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )
              }

              // Unlocked lesson - clickable
              return (
                <Link
                  key={lesson.id}
                  to={`/lesson/${lesson.id}`}
                  className={`block bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 animate-slideIn ${
                    completed ? 'border-l-4 border-green-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700'
                      }`}>
                        {completed ? <CheckCircle className="w-6 h-6" /> : lesson.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {lesson.vocabulary?.length || 0} riječi
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {lesson.quiz?.length || 0} pitanja
                          </span>
                          {completed && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              ✓ Završeno
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
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
