import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Clock, ChevronRight, ArrowLeft } from 'lucide-react'

function LessonList() {
  const { levelId } = useParams()
  const [lessons, setLessons] = useState([])
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/levels/${levelId}`).then(res => res.json()),
      fetch(`/api/levels/${levelId}/lessons`).then(res => res.json())
    ])
      .then(([levelData, lessonsData]) => {
        setLevel(levelData)
        setLessons(lessonsData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching data:', err)
        setLoading(false)
      })
  }, [levelId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-bosnia-blue border-t-transparent"></div>
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
            {moduleLessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={`/lesson/${lesson.id}`}
                className="block bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-700 font-bold">
                      {lesson.id}
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
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default LessonList
