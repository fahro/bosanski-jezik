import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { progressApi, api } from '../api'
import { 
  Trophy, Star, Zap, BookOpen, CheckCircle, Lock, 
  ChevronRight, Award, Play, ArrowRight, Flame, Target
} from 'lucide-react'

const A1_LESSONS = [
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

const A2_LESSONS = [
  { id: 1, title: 'U restoranu', subtitle: 'At the Restaurant', emoji: '🍽️' },
  { id: 2, title: 'Kupovina', subtitle: 'Shopping', emoji: '🛒' },
  { id: 3, title: 'Opis ljudi', subtitle: 'Describing People', emoji: '👤' },
  { id: 4, title: 'Putovanje', subtitle: 'Travel', emoji: '✈️' },
  { id: 5, title: 'Zdravlje', subtitle: 'Health', emoji: '🏥' },
  { id: 6, title: 'Vrijeme', subtitle: 'Weather', emoji: '🌤️' },
  { id: 7, title: 'Posao', subtitle: 'Work', emoji: '💼' },
  { id: 8, title: 'Stanovanje', subtitle: 'Housing', emoji: '🏠' },
  { id: 9, title: 'Hobiji', subtitle: 'Hobbies', emoji: '🎨' },
  { id: 10, title: 'Telefon', subtitle: 'Phone', emoji: '📱' },
  { id: 11, title: 'Usluge', subtitle: 'Services', emoji: '🏦' },
  { id: 12, title: 'Planovi', subtitle: 'Plans', emoji: '📋' }
]

const B1_LESSONS = [
  { id: 1, title: 'Mišljenja', subtitle: 'Opinions', emoji: '💭' },
  { id: 2, title: 'Vijesti', subtitle: 'News & Media', emoji: '📰' },
  { id: 3, title: 'Obrazovanje', subtitle: 'Education', emoji: '🎓' },
  { id: 4, title: 'Okoliš', subtitle: 'Environment', emoji: '🌿' },
  { id: 5, title: 'Tradicija', subtitle: 'Traditions', emoji: '🎭' },
  { id: 6, title: 'Emocije', subtitle: 'Emotions', emoji: '❤️' },
  { id: 7, title: 'Umjetnost', subtitle: 'Art & Culture', emoji: '🎨' },
  { id: 8, title: 'Ekonomija', subtitle: 'Economy', emoji: '💰' },
  { id: 9, title: 'Politika', subtitle: 'Politics', emoji: '🏛️' },
  { id: 10, title: 'Tehnologija', subtitle: 'Technology', emoji: '💻' },
  { id: 11, title: 'Putovanja', subtitle: 'Travel Stories', emoji: '✈️' },
  { id: 12, title: 'Budućnost', subtitle: 'Future & Dreams', emoji: '🔮' }
]

const LEVEL_INFO = {
  a1: { name: 'A1 - Početnik', color: '#22c55e', lessons: A1_LESSONS, gradient: 'from-green-500 to-emerald-600' },
  a2: { name: 'A2 - Elementarni', color: '#3b82f6', lessons: A2_LESSONS, gradient: 'from-blue-500 to-blue-600' },
  b1: { name: 'B1 - Srednji', color: '#8b5cf6', lessons: B1_LESSONS, gradient: 'from-purple-500 to-purple-600' }
}

function FinalTestCard({ level, allProgress }) {
  const levelInfo = LEVEL_INFO[level]
  const completedLessons = allProgress.filter(p => p.completed).length
  const canTakeTest = completedLessons >= 12
  
  const levelColors = {
    a1: { bg: 'from-green-500 to-emerald-600', text: 'text-green-600', button: 'text-green-600 hover:bg-green-50' },
    a2: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', button: 'text-blue-600 hover:bg-blue-50' },
    b1: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', button: 'text-purple-600 hover:bg-purple-50' }
  }
  const colors = levelColors[level] || levelColors.a1

  return (
    <div className={`rounded-3xl p-6 ${
      canTakeTest 
        ? `bg-gradient-to-br ${colors.bg} text-white` 
        : 'bg-gray-50 border border-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            canTakeTest ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            <Award className={`w-7 h-7 ${canTakeTest ? 'text-white' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${canTakeTest ? 'text-white' : 'text-gray-900'}`}>
              {level.toUpperCase()} Završni Test
            </h3>
            <p className={`text-sm ${canTakeTest ? 'text-white/80' : 'text-gray-500'}`}>
              {canTakeTest 
                ? '120 pitanja • Testiraj svoje znanje' 
                : `Završi sve lekcije (${completedLessons}/12)`}
            </p>
          </div>
        </div>
        
        {canTakeTest ? (
          <Link
            to={`/final-test?level=${level}`}
            className={`bg-white ${colors.button} px-5 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2`}
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
  )
}

export default function Dashboard() {
  const { user, stats, refreshStats, isAuthenticated } = useAuth()
  const [lessonProgress, setLessonProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState('a1')
  const [availableLevels, setAvailableLevels] = useState(['a1'])
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    checkAvailableLevels()
    loadProgress(selectedLevel)
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      loadProgress(selectedLevel)
    }
  }, [selectedLevel])

  const checkAvailableLevels = async () => {
    try {
      const levels = ['a1']
      
      // Check access to A2
      const a2Access = await progressApi.checkLevelAccess('a2')
      if (a2Access.has_access) {
        levels.push('a2')
      }
      
      // Check access to B1
      const b1Access = await progressApi.checkLevelAccess('b1')
      if (b1Access.has_access) {
        levels.push('b1')
      }
      
      setAvailableLevels(levels)
      
      // Set default to highest available level
      const highestLevel = levels[levels.length - 1]
      setSelectedLevel(highestLevel)
    } catch (error) {
      console.error('Failed to check level access:', error)
    }
  }

  const loadProgress = async (level) => {
    try {
      setLoading(true)
      const progress = await progressApi.getAllProgress(level)
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

  const currentLevelInfo = LEVEL_INFO[selectedLevel]
  const LESSONS = currentLevelInfo?.lessons || A1_LESSONS
  
  // Calculate current lesson for selected level based on progress
  const getCurrentLessonForLevel = () => {
    if (!lessonProgress || lessonProgress.length === 0) return 1
    
    // Find the first incomplete lesson or the next one after all completed
    const completedLessons = lessonProgress.filter(p => p.completed).map(p => p.lesson_id)
    const maxCompleted = completedLessons.length > 0 ? Math.max(...completedLessons) : 0
    
    // Find first lesson that's started but not completed
    const inProgressLesson = lessonProgress.find(p => p.started && !p.completed)
    if (inProgressLesson) return inProgressLesson.lesson_id
    
    // Otherwise return next lesson after max completed
    return Math.min(maxCompleted + 1, 12)
  }
  
  const currentLessonIdForLevel = getCurrentLessonForLevel()
  const currentLessonInfo = LESSONS.find(l => l.id === currentLessonIdForLevel)

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

      {/* Level Switcher - only show if user has access to multiple levels */}
      {availableLevels.length > 1 && (
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-2">
          {availableLevels.map((level) => {
            const info = LEVEL_INFO[level]
            const isActive = selectedLevel === level
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition-all ${
                  isActive 
                    ? 'text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                style={isActive ? { backgroundColor: info.color } : {}}
              >
                <span className="font-bold text-lg">{level.toUpperCase()}</span>
                <span className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {info.name.split(' - ')[1]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Continue Learning Card - Works for both A1 and A2 */}
      {currentLessonIdForLevel <= 12 && currentLessonInfo && (
        <Link
          to={`/lesson/${currentLessonIdForLevel}?level=${selectedLevel}`}
          className={`block rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] group ${
            selectedLevel === 'a1' 
              ? 'bg-gradient-to-br from-green-500 to-green-600' 
              : selectedLevel === 'a2'
              ? 'bg-gradient-to-br from-bosnia-blue to-blue-600'
              : 'bg-gradient-to-br from-purple-500 to-purple-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                {currentLessonInfo.emoji}
              </div>
              <div>
                <p className="text-white/70 text-sm">Nastavi učiti</p>
                <h2 className="text-xl font-bold">
                  Lekcija {currentLessonIdForLevel}: {currentLessonInfo.title}
                </h2>
                <p className="text-white/70 text-sm">{currentLessonInfo.subtitle}</p>
              </div>
            </div>
            <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${
              selectedLevel === 'a1' ? 'bg-white text-green-600' : selectedLevel === 'a2' ? 'bg-white text-bosnia-blue' : 'bg-white text-purple-600'
            }`}>
              <Play className="w-6 h-6" />
            </div>
          </div>
        </Link>
      )}

      {/* Lessons Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentLevelInfo?.name || 'Lekcije'}
          </h2>
          <span className="text-sm text-gray-500">
            {lessonProgress.filter(p => p.completed).length}/{LESSONS.length} završeno
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {LESSONS.map((lesson) => {
            const progress = lessonProgress.find(p => p.lesson_id === lesson.id)
            // For A2, check progress differently - first lesson always available, others need previous completed
            const completedCount = lessonProgress.filter(p => p.completed).length
            const isLocked = lesson.id > 1 && !progress?.started && completedCount < lesson.id - 1
            const isCurrent = lesson.id === currentLessonIdForLevel
            const isCompleted = progress?.completed

            return (
              <Link
                key={lesson.id}
                to={isLocked ? '#' : `/lesson/${lesson.id}?level=${selectedLevel}`}
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

      {/* Final Test Card - For current level */}
      <FinalTestCard level={selectedLevel} allProgress={lessonProgress} />
    </div>
  )
}
