import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { progressApi } from '../api'
import {
  Trophy, Zap, BookOpen, CheckCircle, Lock,
  Award, Play, ArrowRight, Flame, Target
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

const B2_LESSONS = [
  { id: 1, title: 'Na aerodromu', subtitle: 'At the Airport', emoji: '✈️' },
  { id: 2, title: 'U supermarketu', subtitle: 'At the Supermarket', emoji: '🛒' },
  { id: 3, title: 'Na benzinskoj pumpi', subtitle: 'At the Gas Station', emoji: '⛽' },
  { id: 4, title: 'U banci', subtitle: 'At the Bank', emoji: '🏦' },
  { id: 5, title: 'Kod automehaničara', subtitle: 'At the Mechanic', emoji: '🔧' },
  { id: 6, title: 'U hotelu', subtitle: 'At the Hotel', emoji: '🏨' },
  { id: 7, title: 'Na pošti', subtitle: 'At the Post Office', emoji: '📮' },
  { id: 8, title: 'U frizerskom salonu', subtitle: 'At the Hair Salon', emoji: '💇' },
  { id: 9, title: 'U ambasadi', subtitle: 'At the Embassy', emoji: '🏛️' },
  { id: 10, title: 'Kod agenta za nekretnine', subtitle: 'Real Estate', emoji: '🏠' },
  { id: 11, title: 'Na autobuskoj stanici', subtitle: 'At the Bus Station', emoji: '🚌' },
  { id: 12, title: 'U turističkoj agenciji', subtitle: 'Travel Agency', emoji: '🌍' }
]

const LEVEL_INFO = {
  a1: { name: 'A1 - Početnik', color: '#22c55e', lessons: A1_LESSONS, gradient: 'from-green-500 to-emerald-600' },
  a2: { name: 'A2 - Elementarni', color: '#3b82f6', lessons: A2_LESSONS, gradient: 'from-blue-500 to-blue-600' },
  b1: { name: 'B1 - Srednji', color: '#8b5cf6', lessons: B1_LESSONS, gradient: 'from-purple-500 to-purple-600' },
  b2: { name: 'B2 - Viši srednji', color: '#f59e0b', lessons: B2_LESSONS, gradient: 'from-amber-500 to-orange-600' }
}

function FinalTestCard({ level, allProgress }) {
  const levelInfo = LEVEL_INFO[level]
  const completedLessons = allProgress.filter(p => p.quiz_passed).length
  const canTakeTest = completedLessons >= 12

  const levelColors = {
    a1: { text: 'text-green-600', button: 'text-green-700 hover:bg-green-50' },
    a2: { text: 'text-blue-600', button: 'text-blue-700 hover:bg-blue-50' },
    b1: { text: 'text-purple-600', button: 'text-purple-700 hover:bg-purple-50' },
    b2: { text: 'text-amber-600', button: 'text-amber-700 hover:bg-amber-50' }
  }
  const colors = levelColors[level] || levelColors.a1

  return (
    <div
      className={`rounded-3xl p-6 transition-all ${
        canTakeTest
          ? 'text-white shadow-lg'
          : 'bg-white border border-gray-100 shadow-sm'
      }`}
      style={canTakeTest ? {
        background: `linear-gradient(135deg, ${levelInfo.color}, ${LEVEL_INFO[level]?.color}cc)`
      } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            canTakeTest ? 'bg-white/20' : 'bg-gray-100'
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
          <div className="bg-gray-100 text-gray-400 px-5 py-3 rounded-xl font-medium flex items-center gap-2">
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
      const a2Access = await progressApi.checkLevelAccess('a2')
      if (a2Access.has_access) levels.push('a2')
      const b1Access = await progressApi.checkLevelAccess('b1')
      if (b1Access.has_access) levels.push('b1')
      const b2Access = await progressApi.checkLevelAccess('b2')
      if (b2Access.has_access) levels.push('b2')
      setAvailableLevels(levels)
      setSelectedLevel(levels[levels.length - 1])
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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  const xpProgress = stats?.xp_needed_for_next
    ? ((stats.xp_for_next_level - stats.xp_needed_for_next) / stats.xp_for_next_level) * 100
    : 0

  const currentLevelInfo = LEVEL_INFO[selectedLevel]
  const LESSONS = currentLevelInfo?.lessons || A1_LESSONS

  const getCurrentLessonForLevel = () => {
    if (!lessonProgress || lessonProgress.length === 0) return 1
    const completedLessons = lessonProgress.filter(p => p.completed).map(p => p.lesson_id)
    const maxCompleted = completedLessons.length > 0 ? Math.max(...completedLessons) : 0
    const inProgressLesson = lessonProgress.find(p => p.started && !p.completed)
    if (inProgressLesson) return inProgressLesson.lesson_id
    return Math.min(maxCompleted + 1, 12)
  }

  const currentLessonIdForLevel = getCurrentLessonForLevel()
  const currentLessonInfo = LESSONS.find(l => l.id === currentLessonIdForLevel)

  const levelGradientMap = {
    a1: 'linear-gradient(135deg, #22c55e, #16a34a)',
    a2: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    b1: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    b2: 'linear-gradient(135deg, #f59e0b, #d97706)'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      {/* Welcome & Stats Header */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        {/* Accent bar */}
        <div
          className="h-1.5"
          style={{ background: 'linear-gradient(90deg, #002395 0%, #3b82f6 50%, #FECB00 100%)' }}
        />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Zdravo, {user?.full_name?.split(' ')[0] || user?.username}! 👋
              </h1>
              <p className="text-gray-500 mt-1 text-sm">Nastavi učiti bosanski jezik</p>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-extrabold text-gray-900">{stats?.current_level || 1}</span>
                </div>
                <span className="text-xs text-gray-500">Nivo</span>
              </div>
              <div className="w-px h-10 bg-gray-100" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-extrabold text-gray-900">{stats?.total_xp || 0}</span>
                </div>
                <span className="text-xs text-gray-500">XP</span>
              </div>
              <div className="w-px h-10 bg-gray-100" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-2xl font-extrabold text-gray-900">{stats?.lessons_completed || 0}</span>
                </div>
                <span className="text-xs text-gray-500">Završeno</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">Nivo {stats?.current_level || 1}</span>
              <span>{stats?.xp_needed_for_next || 0} XP do Nivoa {(stats?.current_level || 1) + 1}</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(xpProgress, 100)}%`,
                  background: 'linear-gradient(90deg, #002395, #3b82f6 60%, #FECB00)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Level Switcher */}
      {availableLevels.length > 1 && (
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-2">
          {availableLevels.map((level) => {
            const info = LEVEL_INFO[level]
            const isActive = selectedLevel === level
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all text-sm font-bold ${
                  isActive ? 'text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
                style={isActive ? { backgroundColor: info.color } : {}}
              >
                <span>{level.toUpperCase()}</span>
                <span className={`hidden sm:block text-xs font-medium ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                  {info.name.split(' - ')[1]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Continue Learning Card */}
      {currentLessonIdForLevel <= 12 && currentLessonInfo && (
        <Link
          to={`/lesson/${currentLessonIdForLevel}?level=${selectedLevel}`}
          className="group block rounded-3xl p-6 text-white transition-all hover:-translate-y-0.5 hover:shadow-xl shadow-lg"
          style={{ background: levelGradientMap[selectedLevel] }}
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
            <div className="bg-white/20 group-hover:bg-white/30 p-4 rounded-2xl transition-all group-hover:scale-110">
              <Play className="w-6 h-6" />
            </div>
          </div>
        </Link>
      )}

      {/* Lessons Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">
            {currentLevelInfo?.name || 'Lekcije'}
          </h2>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
            {lessonProgress.filter(p => p.completed).length}/{LESSONS.length} završeno
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {LESSONS.map((lesson) => {
            const progress = lessonProgress.find(p => p.lesson_id === lesson.id)
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
                  ${isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 hover:shadow-md'
                    : isCurrent
                    ? 'border-blue-300 shadow-md hover:shadow-lg'
                    : isLocked
                    ? 'border-gray-100 opacity-50 cursor-not-allowed'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5'}
                `}
              >
                {/* Status badge */}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full p-1">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
                {isCurrent && !isCompleted && (
                  <div
                    className="absolute -top-2 -right-2 text-white rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm"
                    style={{ backgroundColor: currentLevelInfo?.color || '#3b82f6' }}
                  >
                    Trenutna
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl mb-2">{lesson.emoji}</div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{lesson.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{lesson.subtitle}</p>

                  {/* Mini progress dots */}
                  {progress && !isLocked && (
                    <div className="mt-3 flex justify-center gap-1">
                      {['vocabulary_viewed', 'grammar_viewed', 'dialogue_viewed', 'culture_viewed', 'quiz_passed'].map((key) => (
                        <div
                          key={key}
                          className={`w-1.5 h-1.5 rounded-full ${progress[key] ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  )}

                  {progress?.xp_earned > 0 && (
                    <p className="text-xs text-emerald-600 font-semibold mt-2">+{progress.xp_earned} XP</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Final Test Card */}
      <FinalTestCard level={selectedLevel} allProgress={lessonProgress} />
    </div>
  )
}
