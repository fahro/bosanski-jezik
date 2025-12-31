import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Lock, CheckCircle } from 'lucide-react'
import { api, progressApi } from '../api'

function Levels() {
  const [levels, setLevels] = useState([])
  const [levelAccess, setLevelAccess] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLevels()
  }, [])

  const loadLevels = async () => {
    try {
      const levelsData = await api.get('/api/levels')
      setLevels(levelsData)
      
      // Check access for each level
      const accessPromises = levelsData.map(async (level) => {
        try {
          const access = await progressApi.checkLevelAccess(level.id)
          return { id: level.id, ...access }
        } catch (err) {
          return { id: level.id, has_access: level.id === 'a1' }
        }
      })
      
      const accessResults = await Promise.all(accessPromises)
      const accessMap = {}
      accessResults.forEach(result => {
        accessMap[result.id] = result
      })
      setLevelAccess(accessMap)
    } catch (err) {
      console.error('Error fetching levels:', err)
    } finally {
      setLoading(false)
    }
  }

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
          const access = levelAccess[level.id] || { has_access: false }
          const isAvailable = access.has_access
          const isComingSoon = access.coming_soon
          
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
                  className={`block rounded-xl p-6 border-l-4 ${
                    isComingSoon 
                      ? 'bg-gray-100 border-gray-300 opacity-60' 
                      : 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100'
                  }`}
                  onClick={() => !isComingSoon && alert(access.reason || 'Nivo zaključan')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: isComingSoon ? '#9ca3af' : level.color, opacity: isComingSoon ? 1 : 0.7 }}
                      >
                        {level.id.toUpperCase()}
                      </div>
                      <div>
                        <h2 className={`text-xl font-semibold ${isComingSoon ? 'text-gray-500' : 'text-gray-700'}`}>
                          {level.name}
                        </h2>
                        <p className={isComingSoon ? 'text-gray-400' : 'text-gray-500'}>{level.description}</p>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                          <Lock className="w-4 h-4" />
                          <span>{isComingSoon ? 'Uskoro dostupno' : access.requirement || 'Zaključano'}</span>
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
