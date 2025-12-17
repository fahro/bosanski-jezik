import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Lock } from 'lucide-react'

function Levels() {
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/levels')
      .then(res => res.json())
      .then(data => {
        setLevels(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching levels:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-bosnia-blue border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Izaberite Nivo</h1>
        <p className="text-gray-600">Odaberite nivo koji odgovara vašem znanju bosanskog jezika</p>
      </div>

      <div className="space-y-4">
        {levels.map((level, index) => {
          const isAvailable = level.id === 'a1'
          
          return (
            <div
              key={level.id}
              className="animate-slideIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isAvailable ? (
                <Link
                  to={`/levels/${level.id}`}
                  className="block bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border-l-4"
                  style={{ borderLeftColor: level.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: level.color }}
                      >
                        {level.id.toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{level.name}</h2>
                        <p className="text-gray-600">{level.description}</p>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          <span>{level.total_lessons} lekcija</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </Link>
              ) : (
                <div
                  className="block bg-gray-100 rounded-xl p-6 border-l-4 border-gray-300 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gray-300 text-white font-bold text-xl">
                        {level.id.toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-500">{level.name}</h2>
                        <p className="text-gray-400">{level.description}</p>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                          <Lock className="w-4 h-4" />
                          <span>Uskoro dostupno</span>
                        </div>
                      </div>
                    </div>
                    <Lock className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Levels
