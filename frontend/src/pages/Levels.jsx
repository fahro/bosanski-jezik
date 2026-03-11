import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Lock } from 'lucide-react'
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

      const accessPromises = levelsData.map(async (level) => {
        try {
          const access = await progressApi.checkLevelAccess(level.id)
          return { id: level.id, ...access }
        } catch {
          return { id: level.id, has_access: level.id === 'a1' }
        }
      })

      const accessResults = await Promise.all(accessPromises)
      const accessMap = {}
      accessResults.forEach(r => { accessMap[r.id] = r })
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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Nivoi učenja</h1>
        <p className="text-gray-500">Odaberite nivo koji odgovara vašem znanju bosanskog jezika</p>
      </div>

      <div className="space-y-3">
        {levels.map((level, index) => {
          const access = levelAccess[level.id] || { has_access: false }
          const isAvailable = access.has_access
          const isComingSoon = access.coming_soon

          const badge = (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: isComingSoon ? '#9ca3af' : level.color }}
            >
              {level.id.toUpperCase()}
            </div>
          )

          const body = (
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {badge}
              <div className="flex-1 min-w-0">
                <h2 className={`font-semibold text-base ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                  {level.name}
                </h2>
                <p className={`text-sm truncate ${isAvailable ? 'text-gray-500' : 'text-gray-400'}`}>
                  {level.description}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                  {isAvailable ? (
                    <><BookOpen className="w-3.5 h-3.5" /><span>{level.total_lessons} lekcija</span></>
                  ) : isComingSoon ? (
                    <span className="text-gray-400">Uskoro dostupno</span>
                  ) : (
                    <><Lock className="w-3.5 h-3.5" /><span>{access.requirement || 'Položite prethodni završni test'}</span></>
                  )}
                </div>
              </div>
            </div>
          )

          const sharedClass = `flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all animate-slideIn`

          if (isAvailable) {
            return (
              <Link
                key={level.id}
                to={`/levels/${level.id}`}
                className={`${sharedClass} bg-white border-gray-100 hover:border-gray-200 hover:shadow-md`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {body}
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </Link>
            )
          }

          return (
            <div
              key={level.id}
              className={`${sharedClass} ${
                isComingSoon
                  ? 'bg-gray-50 border-gray-100 opacity-60'
                  : 'bg-gray-50 border-gray-100 opacity-70'
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {body}
              <Lock className="w-5 h-5 text-gray-300 shrink-0" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Levels
