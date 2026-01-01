import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { finalTestApi } from '../api'
import { 
  Award, Clock, CheckCircle, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, Flag, Trophy, Star,
  RotateCcw, Home, BookOpen, PenTool
} from 'lucide-react'

const LEVEL_INFO = {
  a1: { name: 'A1 - Početnik', color: 'from-green-500 to-emerald-600', nextLevel: 'A2' },
  a2: { name: 'A2 - Elementarni', color: 'from-blue-500 to-blue-600', nextLevel: 'B1' },
  b1: { name: 'B1 - Srednji', color: 'from-purple-500 to-purple-600', nextLevel: 'B2' }
}

export default function FinalTest() {
  const { isAuthenticated, refreshStats } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const level = searchParams.get('level') || 'a1'
  const levelInfo = LEVEL_INFO[level] || LEVEL_INFO.a1
  
  const [stage, setStage] = useState('eligibility') // eligibility, test, result
  const [eligibility, setEligibility] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answerKey, setAnswerKey] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [writingAnswers, setWritingAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutes in seconds
  const [startTime, setStartTime] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    checkEligibility()
  }, [isAuthenticated])

  useEffect(() => {
    if (stage !== 'test' || !startTime) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [stage, startTime])

  const checkEligibility = async () => {
    try {
      const data = await finalTestApi.checkEligibility(level)
      setEligibility(data)
    } catch (error) {
      console.error('Failed to check eligibility:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTest = async () => {
    setLoading(true)
    try {
      const data = await finalTestApi.getQuestions(level)
      setQuestions(data.questions)
      setAnswerKey(data._answer_key)
      setStartTime(Date.now())
      setStage('test')
    } catch (error) {
      console.error('Failed to load questions:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleWritingAnswer = (questionId, text) => {
    setWritingAnswers(prev => ({ ...prev, [questionId]: text }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)

    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : null

    try {
      const data = await finalTestApi.submit(answers, writingAnswers, timeTaken, level)
      setResult(data)
      setStage('result')
      await refreshStats()
    } catch (error) {
      console.error('Failed to submit test:', error)
      alert('Greška pri slanju testa: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-bosnia-blue border-t-transparent"></div>
      </div>
    )
  }

  // Eligibility Check Screen
  if (stage === 'eligibility') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${levelInfo.color} p-8 text-white text-center`}>
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Završni Test</h1>
            <p className="mt-2 opacity-90">{levelInfo.name} - Bosanski Jezik</p>
          </div>

          <div className="p-8">
            {eligibility?.eligible ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3 text-green-700">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">Ispunjavate uslove za završni test!</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-800">O testu:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <BookOpen className="w-5 h-5 text-bosnia-blue mt-0.5" />
                      <span><strong>120 pitanja</strong> - 10 iz svake lekcije</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Clock className="w-5 h-5 text-bosnia-blue mt-0.5" />
                      <span><strong>60 minuta</strong> vremensko ograničenje</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Trophy className="w-5 h-5 text-bosnia-blue mt-0.5" />
                      <span><strong>70%</strong> potrebno za prolaz</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Star className="w-5 h-5 text-bosnia-blue mt-0.5" />
                      <span>Do <strong>450 XP</strong> za savršen rezultat</span>
                    </li>
                  </ul>
                </div>

                {eligibility.passed && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3 text-yellow-700">
                      <Trophy className="w-6 h-6" />
                      <div>
                        <span className="font-semibold">Već ste položili ovaj test!</span>
                        <p className="text-sm">Najbolji rezultat: {eligibility.best_score}%</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={startTest}
                  className="w-full bg-gradient-to-r from-bosnia-blue to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2"
                >
                  <Flag className="w-5 h-5" />
                  <span>{eligibility.passed ? 'Ponovi test' : 'Započni test'}</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3 text-red-700">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="font-semibold">Morate završiti sve lekcije</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Napredak</span>
                    <span>{eligibility?.lessons_completed || 0}/12 lekcija</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-bosnia-blue transition-all"
                      style={{ width: `${((eligibility?.lessons_completed || 0) / 12) * 100}%` }}
                    />
                  </div>
                </div>

                {eligibility?.missing_lessons?.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Nedostaju lekcije:</h4>
                    <div className="flex flex-wrap gap-2">
                      {eligibility.missing_lessons.map(id => (
                        <span key={id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                          Lekcija {id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/levels/${level}`)}
                  className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Nazad na lekcije
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Test Screen
  if (stage === 'test') {
    const question = questions[currentQuestion]
    const answeredCount = Object.keys(answers).length + Object.keys(writingAnswers).filter(k => writingAnswers[k]).length
    const isTimeWarning = timeLeft < 300 // Less than 5 minutes

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 sticky top-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-800">
                Pitanje {currentQuestion + 1}/{questions.length}
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {question?.lesson_title}
              </span>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isTimeWarning ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-bosnia-blue transition-all"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {answeredCount} od {questions.length} odgovoreno
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {question?.question}
          </h2>

          {question?.question_type === 'writing' ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-purple-600 mb-2">
                <PenTool className="w-5 h-5" />
                <span className="text-sm font-medium">Pitanje za pisanje</span>
              </div>
              <textarea
                value={writingAnswers[question.id] || ''}
                onChange={(e) => handleWritingAnswer(question.id, e.target.value)}
                placeholder="Unesite vaš odgovor..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-bosnia-blue focus:ring-2 focus:ring-bosnia-blue/20 transition-all min-h-[120px] resize-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {question?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, index)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    answers[question.id] === index
                      ? 'border-bosnia-blue bg-blue-50 text-bosnia-blue'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      answers[question.id] === index
                        ? 'bg-bosnia-blue text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Prethodno</span>
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-bosnia-blue text-white hover:bg-blue-700 transition-all"
            >
              <span>Sljedeće</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
            >
              <Flag className="w-5 h-5" />
              <span>{submitting ? 'Slanje...' : 'Završi test'}</span>
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Brza navigacija:</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                  index === currentQuestion
                    ? 'bg-bosnia-blue text-white'
                    : (answers[q.id] !== undefined || writingAnswers[q.id])
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Result Screen
  if (stage === 'result' && result) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`p-8 text-white text-center ${
            result.passed 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-red-500 to-rose-600'
          }`}>
            {result.passed ? (
              <Trophy className="w-20 h-20 mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold">
              {result.passed ? 'Čestitamo!' : 'Pokušajte ponovo'}
            </h1>
            <p className="mt-2 opacity-90">
              {result.passed 
                ? 'Uspješno ste položili završni test!' 
                : 'Niste položili, ali ne odustajte!'}
            </p>
          </div>

          <div className="p-8">
            {/* Score Display */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-800">{result.score}</div>
                <div className="text-sm text-blue-600">Tačnih</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-800">{result.percentage.toFixed(1)}%</div>
                <div className="text-sm text-purple-600">Rezultat</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-yellow-800">+{result.xp_earned}</div>
                <div className="text-sm text-yellow-600">XP</div>
              </div>
            </div>

            {/* Lesson Breakdown */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Rezultati po lekcijama:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.lesson_results?.map(lesson => (
                  <div key={lesson.lesson_id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-700">{lesson.lesson_title}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {lesson.correct}/{lesson.total}
                      </span>
                      <span className={`font-semibold ${
                        lesson.percentage >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {lesson.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time */}
            {result.time_taken_seconds && (
              <div className="text-center text-gray-600 mb-6">
                <Clock className="w-5 h-5 inline mr-2" />
                Vrijeme: {Math.floor(result.time_taken_seconds / 60)} min {result.time_taken_seconds % 60} sek
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              {!result.passed && (
                <button
                  onClick={() => {
                    setStage('eligibility')
                    setAnswers({})
                    setCurrentQuestion(0)
                    setResult(null)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-bosnia-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Pokušaj ponovo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
