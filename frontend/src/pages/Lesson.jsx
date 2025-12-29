import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  ArrowLeft, BookOpen, MessageSquare, PenTool, HelpCircle, 
  Volume2, ChevronRight, ChevronLeft, CheckCircle, XCircle,
  Lightbulb, Globe, RefreshCw, Dumbbell, Shuffle, GripVertical,
  Star, Trophy, Zap, Award
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { useSpeech } from '../hooks/useSpeech'
import { useAuth } from '../context/AuthContext'
import { api, progressApi } from '../api'

function Lesson() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const { progress, saveQuizScore, getStars, getAchievementInfo } = useProgress()
  const { speak, isSpeaking } = useSpeech()
  const { isAuthenticated, refreshStats, stats } = useAuth()
  const navigate = useNavigate()
  const [accessDenied, setAccessDenied] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [lessonProgress, setLessonProgress] = useState(null)
  const [exerciseResult, setExerciseResult] = useState(null)
  const [allExercisesCompleted, setAllExercisesCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState('vocabulary')
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    answers: {},  // Changed to object: {questionIndex: {selected, correct, ...}}
    showResult: false,
    score: 0
  })
  const [quizWritingInput, setQuizWritingInput] = useState('')
  const [flippedCards, setFlippedCards] = useState({})
  const [showCultureTranslation, setShowCultureTranslation] = useState(false)
  const [showQuizTranslation, setShowQuizTranslation] = useState(false)
  const [grammarExercises, setGrammarExercises] = useState({
    answers: {},
    showResults: false,
    draggedItem: null
  })
  const [sentenceExercises, setSentenceExercises] = useState({
    answers: {},
    showResults: false
  })
  const [activeExerciseType, setActiveExerciseType] = useState('fillBlank')
  const [matchingExercises, setMatchingExercises] = useState({
    answers: {},
    showResults: false
  })
  const [translationExercises, setTranslationExercises] = useState({
    answers: {},
    showResults: false
  })
  const [writingExercises, setWritingExercises] = useState({
    answers: {},
    showResults: false,
    isPlayingAudio: false,
    currentAudioIndex: -1,
    checked: {}
  })
  const [showFillBlankTranslation, setShowFillBlankTranslation] = useState(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [savedPosition, setSavedPosition] = useState(null)

  // Track previous lessonId to only reset state when lesson actually changes
  const prevLessonIdRef = useRef(null)
  
  useEffect(() => {
    // Check if lesson is accessible for authenticated users
    const lessonNum = parseInt(lessonId)
    
    // First lesson is always accessible
    if (lessonNum === 1) {
      setAccessDenied(false)
    } else if (isAuthenticated && stats?.current_lesson_id) {
      // Check if stats allow access
      if (lessonNum <= stats.current_lesson_id) {
        setAccessDenied(false)
      } else {
        // Will check again after loading previous lesson progress
        setAccessDenied(true)
      }
    } else if (isAuthenticated) {
      // Stats not loaded yet, will check via lessonProgress
      setAccessDenied(lessonNum > 1)
    } else {
      setAccessDenied(false)
    }

    // Only reset state when lesson ID actually changes (not when stats update)
    const lessonChanged = prevLessonIdRef.current !== lessonId
    prevLessonIdRef.current = lessonId
    
    if (!lessonChanged) return // Don't reset if just stats changed
    
    // Reset all state when lesson changes
    setActiveTab('vocabulary')
    setQuizState({ currentQuestion: 0, answers: {}, showResult: false, score: 0 })
    setQuizResult(null)
    setFlippedCards({})
    setShowCultureTranslation(false)
    setShowQuizTranslation(false)
    setGrammarExercises({ answers: {}, showResults: false, draggedItem: null })
    setSentenceExercises({ answers: {}, showResults: false })
    setMatchingExercises({ answers: {}, showResults: false })
    setTranslationExercises({ answers: {}, showResults: false })
    setWritingExercises({ answers: {}, showResults: false, isPlayingAudio: false, currentAudioIndex: -1, checked: {} })
    setActiveExerciseType('fillBlank')
    setTranslationInputs({})
    setMatchedPairs({})
    setSelectedBosnian(null)
    setWordPositions({})
    setShowFillBlankTranslation(false)
    
    api.get(`/api/lessons/${lessonId}`)
      .then(data => {
        setLesson(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })

    // Fetch lesson progress if authenticated
    if (isAuthenticated) {
      const lessonNum = parseInt(lessonId)
      
      // If this is not lesson 1, check previous lesson's progress for access
      if (lessonNum > 1 && accessDenied) {
        progressApi.getLessonProgress(lessonNum - 1)
          .then(prevData => {
            if (prevData.quiz_passed) {
              setAccessDenied(false)
            }
          })
          .catch(err => console.error('Error checking previous lesson:', err))
      }
      
      progressApi.getLessonProgress(lessonId)
        .then(data => {
          setLessonProgress(data)
          // If quiz is already passed, show the result
          if (data.quiz_passed) {
            const bestScore = data.best_quiz_score || 0
            const totalQuestions = lesson?.quiz?.length || 15
            setQuizState({
              currentQuestion: totalQuestions,
              answers: {},
              showResult: true,
              score: bestScore
            })
            setQuizResult({
              pointsEarned: 0,
              isNewHighScore: false,
              lessonCompleted: data.quiz_passed,
              alreadyPassed: true,
              bestPercentage: data.best_quiz_percentage
            })
          }
          // Restore saved quiz progress if not passed yet
          else if (data.saved_quiz_answers) {
            // savedAnswers is already an object with question indices as keys
            const savedAnswers = data.saved_quiz_answers
            const savedScore = Object.values(savedAnswers).filter(a => a?.correct).length
            const answeredCount = Object.keys(savedAnswers).length
            setQuizState({
              currentQuestion: data.saved_quiz_position || answeredCount,
              answers: savedAnswers,
              showResult: false,
              score: savedScore
            })
          }
          // Restore saved exercise progress
          if (data.saved_exercise_answers && !data.exercises_passed) {
            const saved = data.saved_exercise_answers
            if (saved.grammar) {
              setGrammarExercises(prev => ({ ...prev, answers: saved.grammar }))
            }
            if (saved.sentence) {
              setSentenceExercises(prev => ({ ...prev, answers: saved.sentence }))
            }
            if (saved.matching) {
              setMatchedPairs(saved.matching)
            }
            if (saved.translation) {
              setTranslationInputs(saved.translation)
            }
          }
          // Check if there's a saved position to resume from
          if (!data.quiz_passed && (data.saved_tab || data.saved_exercise_type)) {
            const position = {
              tab: data.saved_tab,
              exerciseType: data.saved_exercise_type
            }
            // Only show resume dialog if not on vocabulary (starting position)
            if (data.saved_tab && data.saved_tab !== 'vocabulary') {
              setSavedPosition(position)
              setShowResumeDialog(true)
            }
          }
        })
        .catch(err => {
          console.error('Error fetching lesson progress:', err)
        })
    }
  }, [lessonId, isAuthenticated, stats?.current_lesson_id])

  const toggleCard = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }))
  }

  // Save progress to backend
  const saveProgressToBackend = async (quizAnswers, quizPosition, exerciseAnswers, currentTab = null, currentExerciseType = null) => {
    if (!isAuthenticated) return
    try {
      await progressApi.saveProgress(lessonId, {
        quiz_answers: quizAnswers,
        quiz_position: quizPosition,
        exercise_answers: exerciseAnswers,
        current_tab: currentTab || activeTab,
        current_exercise_type: currentExerciseType || activeExerciseType
      })
    } catch (err) {
      console.error('Error saving progress:', err)
    }
  }

  // Save current position when changing tabs or exercise types
  const saveCurrentPosition = () => {
    if (!isAuthenticated) return
    saveProgressToBackend(null, null, null, activeTab, activeExerciseType)
  }

  // Navigate to specific quiz question
  const goToQuizQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < lesson.quiz.length) {
      setQuizState(prev => ({ ...prev, currentQuestion: questionIndex }))
      setQuizWritingInput('')
    }
  }

  // Go to next quiz question manually
  const goToNextQuestion = () => {
    if (quizState.currentQuestion < lesson.quiz.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
      setQuizWritingInput('')
    }
  }

  // Go to previous quiz question
  const goToPrevQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))
      setQuizWritingInput('')
    }
  }

  // Resume from saved position
  const resumeFromSavedPosition = () => {
    if (savedPosition) {
      if (savedPosition.tab) setActiveTab(savedPosition.tab)
      if (savedPosition.exerciseType) setActiveExerciseType(savedPosition.exerciseType)
    }
    setShowResumeDialog(false)
  }

  // Start from beginning
  const startFromBeginning = () => {
    setShowResumeDialog(false)
  }

  // Save all current exercise answers
  const saveExerciseProgress = (newGrammar, newSentence, newMatching, newTranslation) => {
    const exerciseAnswers = {
      grammar: newGrammar || grammarExercises.answers,
      sentence: newSentence || sentenceExercises.answers,
      matching: newMatching || matchedPairs,
      translation: newTranslation || translationInputs
    }
    saveProgressToBackend(null, null, exerciseAnswers)
  }

  // Handler for grammar exercise answer
  const handleGrammarAnswer = (exerciseId, option) => {
    const newAnswers = { ...grammarExercises.answers, [exerciseId]: option }
    setGrammarExercises(prev => ({ ...prev, answers: newAnswers }))
    saveExerciseProgress(newAnswers, null, null, null)
  }

  // Handler for matching exercise
  const handleMatchingAnswer = (bosnianId, englishValue) => {
    const newPairs = { ...matchedPairs, [bosnianId]: englishValue }
    setMatchedPairs(newPairs)
    saveExerciseProgress(null, null, newPairs, null)
  }

  // Handler for translation exercise
  const handleTranslationInput = (itemId, value) => {
    const newInputs = { ...translationInputs, [itemId]: value }
    setTranslationInputs(newInputs)
    // Debounce saving for text input (save after 500ms of no typing)
  }

  const handleQuizAnswer = async (answerIndex) => {
    const currentQ = lesson.quiz[quizState.currentQuestion]
    const isCorrect = answerIndex === currentQ.correct_answer
    
    // Store answer at the correct question index
    const newAnswers = { ...quizState.answers }
    newAnswers[quizState.currentQuestion] = { selected: answerIndex, correct: isCorrect }
    
    // Recalculate score based on all answers
    const newScore = Object.values(newAnswers).filter(a => a?.correct).length
    
    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: newScore
    }))
    setQuizWritingInput('')
  }

  // Handle writing quiz answers
  const handleQuizWritingSubmit = async () => {
    const currentQ = lesson.quiz[quizState.currentQuestion]
    const userAnswer = quizWritingInput.toLowerCase().trim().replace(/[.!?,;:]+$/, '')
    const correctAnswer = currentQ.correct_answer_text.toLowerCase().trim().replace(/[.!?,;:]+$/, '')
    const isCorrect = userAnswer === correctAnswer
    
    // Store answer at the correct question index
    const newAnswers = { ...quizState.answers }
    newAnswers[quizState.currentQuestion] = { 
      selected: quizWritingInput, 
      correct: isCorrect,
      isWriting: true,
      correctText: currentQ.correct_answer_text
    }
    
    // Recalculate score based on all answers
    const newScore = Object.values(newAnswers).filter(a => a?.correct).length
    
    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: newScore
    }))

    // Play audio for the correct answer
    setTimeout(() => {
      speak(currentQ.correct_answer_text)
    }, 300)

    // Save quiz progress after each answer
    const quizAnswersToSave = {}
    newAnswers.forEach((ans, idx) => {
      quizAnswersToSave[idx] = ans
    })
    saveProgressToBackend(quizAnswersToSave, quizState.currentQuestion + 1, null)

    setTimeout(async () => {
      setQuizWritingInput('')
      if (quizState.currentQuestion < lesson.quiz.length - 1) {
        setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
      } else {
        // Show result immediately
        setQuizState(prev => ({ ...prev, showResult: true }))
        // Quiz finished - save progress
        const finalScore = newScore
        
        // Save to backend if authenticated
        if (isAuthenticated) {
          try {
            const apiResult = await progressApi.submitQuiz(
              lesson.id,
              finalScore,
              lesson.quiz.length,
              quizState.answers.reduce((acc, a, i) => ({ ...acc, [i]: a.selected }), {})
            )
            setQuizResult({
              pointsEarned: apiResult.xp_earned,
              isNewHighScore: apiResult.is_new_high_score,
              lessonCompleted: apiResult.lesson_completed,
              totalXp: apiResult.total_xp,
              currentLevel: apiResult.current_level,
              passed: apiResult.passed,
              percentage: apiResult.percentage
            })
            // Update lesson progress state
            setLessonProgress(prev => ({
              ...prev,
              quiz_passed: apiResult.passed,
              best_quiz_percentage: apiResult.percentage
            }))
            await refreshStats()
          } catch (error) {
            console.error('Failed to save quiz result:', error)
            const result = saveQuizScore(lesson.id, finalScore, lesson.quiz.length)
            setQuizResult(result)
          }
        } else {
          const result = saveQuizScore(lesson.id, finalScore, lesson.quiz.length)
          setQuizResult(result)
        }
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setQuizState({ currentQuestion: 0, answers: {}, showResult: false, score: 0 })
    setShowQuizTranslation(false)
    setQuizResult(null)
    setQuizWritingInput('')
  }

  // Lesson-specific exercise data
  const exercisesByLesson = {
    // Lesson 1: Greetings & Verb "biti" (to be)
    1: {
      fillBlank: [
        { id: 1, sentence: "Ja _____ student.", answer: "sam", translation: "I am a student.", options: ["sam", "si", "je", "smo"] },
        { id: 2, sentence: "Ti _____ iz Mostara.", answer: "si", translation: "You are from Mostar.", options: ["sam", "si", "je", "ste"] },
        { id: 3, sentence: "On _____ moj prijatelj.", answer: "je", translation: "He is my friend.", options: ["sam", "si", "je", "su"] },
        { id: 4, sentence: "Mi _____ iz Bosne.", answer: "smo", translation: "We are from Bosnia.", options: ["sam", "smo", "ste", "su"] },
        { id: 5, sentence: "Vi _____ dobrodošli!", answer: "ste", translation: "You are welcome!", options: ["si", "smo", "ste", "su"] },
        { id: 6, sentence: "Oni _____ u Sarajevu.", answer: "su", translation: "They are in Sarajevo.", options: ["je", "smo", "ste", "su"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["sam", "Ja", "student"], correct: ["Ja", "sam", "student"], translation: "I am a student." },
        { id: 2, scrambled: ["si", "Kako", "ti"], correct: ["Kako", "si", "ti"], translation: "How are you?" },
        { id: 3, scrambled: ["je", "mi", "Drago"], correct: ["Drago", "mi", "je"], translation: "Nice to meet you." },
        { id: 4, scrambled: ["Sarajeva", "iz", "sam", "Ja"], correct: ["Ja", "sam", "iz", "Sarajeva"], translation: "I am from Sarajevo." },
        { id: 5, scrambled: ["smo", "Mi", "prijatelji"], correct: ["Mi", "smo", "prijatelji"], translation: "We are friends." }
      ],
      matching: [
        { id: 1, bosnian: "Ja sam", english: "I am" },
        { id: 2, bosnian: "Ti si", english: "You are" },
        { id: 3, bosnian: "On/Ona je", english: "He/She is" },
        { id: 4, bosnian: "Mi smo", english: "We are" },
        { id: 5, bosnian: "Vi ste", english: "You are (formal)" },
        { id: 6, bosnian: "Oni su", english: "They are" }
      ],
      translation: [
        { id: 1, english: "I am from Sarajevo", bosnian: "Ja sam iz Sarajeva", options: ["Ja sam iz Sarajeva", "Ti si iz Sarajeva", "On je iz Sarajeva", "Mi smo iz Sarajeva"] },
        { id: 2, english: "She is a teacher", bosnian: "Ona je učiteljica", options: ["On je učitelj", "Ona je učiteljica", "Mi smo učitelji", "Ti si učenik"] },
        { id: 3, english: "We are friends", bosnian: "Mi smo prijatelji", options: ["Ja sam prijatelj", "Mi smo prijatelji", "Vi ste prijatelji", "Oni su prijatelji"] },
        { id: 4, english: "You are welcome", bosnian: "Vi ste dobrodošli", options: ["Ti si dobrodošao", "Vi ste dobrodošli", "Mi smo dobrodošli", "Oni su dobrodošli"] }
      ],
      writing: [
        { id: 1, english: "Hello, how are you?", bosnian: "Zdravo, kako si?" },
        { id: 2, english: "I am fine, thank you.", bosnian: "Ja sam dobro, hvala." },
        { id: 3, english: "Nice to meet you.", bosnian: "Drago mi je." },
        { id: 4, english: "What is your name?", bosnian: "Kako se zoveš?" },
        { id: 5, english: "My name is Ahmed.", bosnian: "Ja se zovem Ahmed." },
        { id: 6, english: "Where are you from?", bosnian: "Odakle si?" },
        { id: 7, english: "I am from Bosnia.", bosnian: "Ja sam iz Bosne." },
        { id: 8, english: "Good morning!", bosnian: "Dobro jutro!" },
        { id: 9, english: "Goodbye!", bosnian: "Doviđenja!" },
        { id: 10, english: "See you tomorrow.", bosnian: "Vidimo se sutra." }
      ]
    },
    // Lesson 2: Numbers (with ordinals and noun agreement)
    2: {
      fillBlank: [
        { id: 1, sentence: "Imam _____ brata.", answer: "jednog", translation: "I have one brother.", options: ["jednog", "jedna", "jedan", "jedno"] },
        { id: 2, sentence: "Kupila sam _____ jabuke.", answer: "tri", translation: "I bought three apples.", options: ["dva", "tri", "pet", "šest"] },
        { id: 3, sentence: "Ovo je moj _____ dan u školi.", answer: "prvi", translation: "This is my first day at school.", options: ["prvi", "druga", "treći", "peti"] },
        { id: 4, sentence: "Imam _____ sestre.", answer: "dvije", translation: "I have two sisters.", options: ["jedan", "dva", "dvije", "tri"] },
        { id: 5, sentence: "To je _____ lekcija.", answer: "druga", translation: "That is the second lesson.", options: ["prvi", "druga", "treći", "četvrti"] },
        { id: 6, sentence: "U razredu ima _____ učenika.", answer: "pet", translation: "There are five students in class.", options: ["dva", "tri", "četiri", "pet"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["dan", "prvi", "moj", "je", "Ovo"], correct: ["Ovo", "je", "moj", "prvi", "dan"], translation: "This is my first day." },
        { id: 2, scrambled: ["sestre", "dvije", "Imam"], correct: ["Imam", "dvije", "sestre"], translation: "I have two sisters." },
        { id: 3, scrambled: ["lekcija", "druga", "je", "Ovo"], correct: ["Ovo", "je", "druga", "lekcija"], translation: "This is the second lesson." },
        { id: 4, scrambled: ["jabuke", "tri", "sam", "Kupila"], correct: ["Kupila", "sam", "tri", "jabuke"], translation: "I bought three apples." },
        { id: 5, scrambled: ["čovjek", "jedan", "Tu", "je"], correct: ["Tu", "je", "jedan", "čovjek"], translation: "There is one man." }
      ],
      matching: [
        { id: 1, bosnian: "Prvi", english: "First" },
        { id: 2, bosnian: "Drugi", english: "Second" },
        { id: 3, bosnian: "Treći", english: "Third" },
        { id: 4, bosnian: "Jedna žena", english: "One woman" },
        { id: 5, bosnian: "Dva brata", english: "Two brothers" },
        { id: 6, bosnian: "Pet djece", english: "Five children" }
      ],
      translation: [
        { id: 1, english: "This is my first day", bosnian: "Ovo je moj prvi dan", options: ["Ovo je moj prvi dan", "Ovo je moj drugi dan", "Ovo je moja prva noć", "Ovo je moj treći dan"] },
        { id: 2, english: "I have two sisters", bosnian: "Imam dvije sestre", options: ["Imam jednu sestru", "Imam dvije sestre", "Imam tri sestre", "Imam pet sestara"] },
        { id: 3, english: "One man and two women", bosnian: "Jedan čovjek i dvije žene", options: ["Dva čovjeka i jedna žena", "Jedan čovjek i dvije žene", "Tri čovjeka i pet žena", "Pet ljudi"] },
        { id: 4, english: "The third lesson", bosnian: "Treća lekcija", options: ["Prva lekcija", "Druga lekcija", "Treća lekcija", "Četvrta lekcija"] }
      ],
      writing: [
        { id: 1, english: "I have one brother.", bosnian: "Imam jednog brata." },
        { id: 2, english: "She has two sisters.", bosnian: "Ona ima dvije sestre." },
        { id: 3, english: "This is my first day.", bosnian: "Ovo je moj prvi dan." },
        { id: 4, english: "I bought three apples.", bosnian: "Kupio sam tri jabuke." },
        { id: 5, english: "There are five students.", bosnian: "Ima pet učenika." },
        { id: 6, english: "This is the second lesson.", bosnian: "Ovo je druga lekcija." },
        { id: 7, english: "I am twenty years old.", bosnian: "Imam dvadeset godina." },
        { id: 8, english: "One coffee, please.", bosnian: "Jednu kafu, molim." },
        { id: 9, english: "I have four children.", bosnian: "Imam četvero djece." },
        { id: 10, english: "This is the third time.", bosnian: "Ovo je treći put." }
      ]
    },
    // Lesson 3: Colors & Adjective Agreement (rod pridjeva)
    3: {
      fillBlank: [
        { id: 1, sentence: "Zastava BiH je _____ i žuta.", answer: "plava", translation: "The BiH flag is blue and yellow.", options: ["plav", "plava", "plavo", "plave"] },
        { id: 2, sentence: "_____ džamija je u Sarajevu.", answer: "Bijela", translation: "The white mosque is in Sarajevo.", options: ["Bijel", "Bijela", "Bijelo", "Bijeli"] },
        { id: 3, sentence: "Stari Most je _____ boje.", answer: "bijele", translation: "The Old Bridge is white color.", options: ["bijel", "bijela", "bijele", "bijelo"] },
        { id: 4, sentence: "Bosanska kafa je _____.", answer: "crna", translation: "Bosnian coffee is black.", options: ["crn", "crna", "crno", "crni"] },
        { id: 5, sentence: "_____ ćilim je tradicionalan.", answer: "Crveni", translation: "The red carpet is traditional.", options: ["Crven", "Crvena", "Crveni", "Crveno"] },
        { id: 6, sentence: "Rijeka Miljacka je _____.", answer: "zelena", translation: "The Miljacka river is green.", options: ["zelen", "zelena", "zeleno", "zeleni"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["plava", "je", "Zastava", "i", "žuta"], correct: ["Zastava", "je", "plava", "i", "žuta"], translation: "The flag is blue and yellow." },
        { id: 2, scrambled: ["bijela", "džamija", "je", "Ova"], correct: ["Ova", "džamija", "je", "bijela"], translation: "This mosque is white." },
        { id: 3, scrambled: ["crna", "je", "Bosanska", "kafa"], correct: ["Bosanska", "kafa", "je", "crna"], translation: "Bosnian coffee is black." },
        { id: 4, scrambled: ["crveni", "je", "Ovaj", "ćilim"], correct: ["Ovaj", "ćilim", "je", "crveni"], translation: "This carpet is red." },
        { id: 5, scrambled: ["boje", "je", "Koje", "nebo"], correct: ["Koje", "boje", "je", "nebo"], translation: "What color is the sky?" }
      ],
      matching: [
        { id: 1, bosnian: "Crven ćilim (m)", english: "Red carpet" },
        { id: 2, bosnian: "Bijela džamija (f)", english: "White mosque" },
        { id: 3, bosnian: "Plavo nebo (n)", english: "Blue sky" },
        { id: 4, bosnian: "Zelena rijeka (f)", english: "Green river" },
        { id: 5, bosnian: "Žuta zastava (f)", english: "Yellow flag" },
        { id: 6, bosnian: "Crna kafa (f)", english: "Black coffee" }
      ],
      translation: [
        { id: 1, english: "The Bosnian flag is blue", bosnian: "Bosanska zastava je plava", options: ["Bosanska zastava je plava", "Bosanska zastava je crvena", "Bosanski grb je plav", "Bosanska kafa je crna"] },
        { id: 2, english: "The Old Bridge is white", bosnian: "Stari Most je bijel", options: ["Stari Most je crn", "Stari Most je bijel", "Stari Most je zelen", "Stari Most je plav"] },
        { id: 3, english: "I love black coffee", bosnian: "Volim crnu kafu", options: ["Volim bijelu kafu", "Volim crnu kafu", "Volim zelenu kafu", "Volim crvenu kafu"] },
        { id: 4, english: "The green mountains", bosnian: "Zelene planine", options: ["Crvene planine", "Plave planine", "Zelene planine", "Bijele planine"] }
      ],
      writing: [
        { id: 1, english: "The flag is blue and yellow.", bosnian: "Zastava je plava i žuta." },
        { id: 2, english: "The white mosque is beautiful.", bosnian: "Bijela džamija je lijepa." },
        { id: 3, english: "Bosnian coffee is black.", bosnian: "Bosanska kafa je crna." },
        { id: 4, english: "The red carpet is traditional.", bosnian: "Crveni ćilim je tradicionalan." },
        { id: 5, english: "The sky is blue.", bosnian: "Nebo je plavo." },
        { id: 6, english: "I like green color.", bosnian: "Volim zelenu boju." },
        { id: 7, english: "The Old Bridge is white.", bosnian: "Stari Most je bijel." },
        { id: 8, english: "She has black hair.", bosnian: "Ona ima crnu kosu." },
        { id: 9, english: "The yellow sun is shining.", bosnian: "Žuto sunce sija." },
        { id: 10, english: "The green river is cold.", bosnian: "Zelena rijeka je hladna." }
      ]
    },
    // Lesson 4: Family (Possessive pronouns - moj/moja/moje, tvoj/tvoja, njegov/njena, naš/naša)
    4: {
      fillBlank: [
        { id: 1, sentence: "_____ majka pravi pitu.", answer: "Moja", translation: "My mother makes pie.", options: ["Moj", "Moja", "Moje", "Tvoja"] },
        { id: 2, sentence: "Gdje je _____ otac?", answer: "tvoj", translation: "Where is your father?", options: ["moj", "tvoj", "njegov", "naš"] },
        { id: 3, sentence: "_____ sestra je mlađa od mene.", answer: "Njegova", translation: "His sister is younger than him.", options: ["Moja", "Tvoja", "Njegova", "Njena"] },
        { id: 4, sentence: "_____ nana živi u Zenici.", answer: "Naša", translation: "Our grandmother lives in Zenica.", options: ["Moja", "Tvoja", "Njegova", "Naša"] },
        { id: 5, sentence: "Ovo je _____ dijete.", answer: "njeno", translation: "This is her child.", options: ["moje", "tvoje", "njegovo", "njeno"] },
        { id: 6, sentence: "_____ djed čita novine.", answer: "Moj", translation: "My grandfather reads newspapers.", options: ["Moj", "Moja", "Moje", "Moji"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["pravi", "nana", "pitu", "Moja"], correct: ["Moja", "nana", "pravi", "pitu"], translation: "My grandmother makes pie." },
        { id: 2, scrambled: ["je", "sin", "Njegov", "visok"], correct: ["Njegov", "sin", "je", "visok"], translation: "His son is tall." },
        { id: 3, scrambled: ["u", "živi", "Naša", "Sarajevu", "porodica"], correct: ["Naša", "porodica", "živi", "u", "Sarajevu"], translation: "Our family lives in Sarajevo." },
        { id: 4, scrambled: ["kći", "Njena", "studentica", "je"], correct: ["Njena", "kći", "je", "studentica"], translation: "Her daughter is a student." }
      ],
      matching: [
        { id: 1, bosnian: "Moj brat", english: "My brother" },
        { id: 2, bosnian: "Tvoja sestra", english: "Your sister" },
        { id: 3, bosnian: "Njegov otac", english: "His father" },
        { id: 4, bosnian: "Njena majka", english: "Her mother" },
        { id: 5, bosnian: "Naša nana", english: "Our grandmother" },
        { id: 6, bosnian: "Njihov djed", english: "Their grandfather" }
      ],
      translation: [
        { id: 1, english: "My grandmother makes the best pie", bosnian: "Moja nana pravi najbolju pitu", options: ["Moja nana pravi najbolju pitu", "Tvoja nana pravi pitu", "Njegova majka pravi pitu", "Naša sestra pravi pitu"] },
        { id: 2, english: "His wife is a teacher", bosnian: "Njegova žena je učiteljica", options: ["Moja žena je učiteljica", "Tvoja žena je učiteljica", "Njegova žena je učiteljica", "Njena žena je učiteljica"] },
        { id: 3, english: "Our family is big", bosnian: "Naša porodica je velika", options: ["Moja porodica je velika", "Tvoja porodica je velika", "Naša porodica je velika", "Njihova porodica je velika"] }
      ],
      writing: [
        { id: 1, english: "My mother makes pie.", bosnian: "Moja majka pravi pitu." },
        { id: 2, english: "Where is your father?", bosnian: "Gdje je tvoj otac?" },
        { id: 3, english: "His sister is young.", bosnian: "Njegova sestra je mlada." },
        { id: 4, english: "Our grandmother lives in Zenica.", bosnian: "Naša nana živi u Zenici." },
        { id: 5, english: "This is her child.", bosnian: "Ovo je njeno dijete." },
        { id: 6, english: "My grandfather reads newspapers.", bosnian: "Moj djed čita novine." },
        { id: 7, english: "Her daughter is a student.", bosnian: "Njena kći je studentica." },
        { id: 8, english: "Our family is big.", bosnian: "Naša porodica je velika." },
        { id: 9, english: "My brother is tall.", bosnian: "Moj brat je visok." },
        { id: 10, english: "Their son works in Sarajevo.", bosnian: "Njihov sin radi u Sarajevu." }
      ]
    },
    // Lesson 5: Days of the Week (danas/sutra/jučer, u + dan, redoslijed dana)
    5: {
      fillBlank: [
        { id: 1, sentence: "_____ je petak. Sutra je subota!", answer: "Danas", translation: "Today is Friday. Tomorrow is Saturday!", options: ["Danas", "Sutra", "Jučer", "Preksutra"] },
        { id: 2, sentence: "U _____ idem na pijacu Markale.", answer: "subotu", translation: "On Saturday I go to Markale market.", options: ["ponedjeljak", "srijedu", "subotu", "nedjelju"] },
        { id: 3, sentence: "_____ sam bio kod nane.", answer: "Jučer", translation: "Yesterday I was at grandma's.", options: ["Danas", "Sutra", "Jučer", "Prekosutra"] },
        { id: 4, sentence: "Koji dan dolazi poslije utorka? _____.", answer: "Srijeda", translation: "Which day comes after Tuesday? Wednesday.", options: ["Ponedjeljak", "Srijeda", "Četvrtak", "Petak"] },
        { id: 5, sentence: "U _____ radim, a u nedjelju odmaram.", answer: "ponedjeljak", translation: "On Monday I work, and on Sunday I rest.", options: ["ponedjeljak", "subotu", "nedjelju", "petak"] },
        { id: 6, sentence: "_____ je dan prije subote.", answer: "Petak", translation: "Friday is the day before Saturday.", options: ["Četvrtak", "Petak", "Nedjelja", "Srijeda"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["dan", "je", "Koji", "danas"], correct: ["Koji", "je", "danas", "dan"], translation: "What day is it today?" },
        { id: 2, scrambled: ["je", "petak", "Danas"], correct: ["Danas", "je", "petak"], translation: "Today is Friday." },
        { id: 3, scrambled: ["subotu", "U", "pijacu", "idem", "na"], correct: ["U", "subotu", "idem", "na", "pijacu"], translation: "On Saturday I go to the market." },
        { id: 4, scrambled: ["bio", "Jučer", "sam", "kod", "nane"], correct: ["Jučer", "sam", "bio", "kod", "nane"], translation: "Yesterday I was at grandma's." },
        { id: 5, scrambled: ["je", "Sutra", "nedjelja"], correct: ["Sutra", "je", "nedjelja"], translation: "Tomorrow is Sunday." }
      ],
      matching: [
        { id: 1, bosnian: "Danas", english: "Today" },
        { id: 2, bosnian: "Sutra", english: "Tomorrow" },
        { id: 3, bosnian: "Jučer", english: "Yesterday" },
        { id: 4, bosnian: "U ponedjeljak", english: "On Monday" },
        { id: 5, bosnian: "U subotu", english: "On Saturday" },
        { id: 6, bosnian: "U nedjelju", english: "On Sunday" }
      ],
      translation: [
        { id: 1, english: "What day is it today?", bosnian: "Koji je danas dan?", options: ["Koji je danas dan?", "Koliko je sati?", "Kako si?", "Gdje si?"] },
        { id: 2, english: "Tomorrow is Saturday", bosnian: "Sutra je subota", options: ["Danas je subota", "Sutra je subota", "Jučer je bila subota", "Sutra je petak"] },
        { id: 3, english: "On Friday I go to the market", bosnian: "U petak idem na pijacu", options: ["U petak idem na pijacu", "U subotu idem na pijacu", "Danas idem na pijacu", "Jučer sam išao na pijacu"] },
        { id: 4, english: "Yesterday was Thursday", bosnian: "Jučer je bio četvrtak", options: ["Jučer je bio četvrtak", "Danas je četvrtak", "Sutra je četvrtak", "Jučer je bila srijeda"] }
      ],
      writing: [
        { id: 1, english: "What day is it today?", bosnian: "Koji je danas dan?" },
        { id: 2, english: "Today is Friday.", bosnian: "Danas je petak." },
        { id: 3, english: "Tomorrow is Saturday.", bosnian: "Sutra je subota." },
        { id: 4, english: "Yesterday I was at grandma's.", bosnian: "Jučer sam bio kod nane." },
        { id: 5, english: "On Saturday I go to the market.", bosnian: "U subotu idem na pijacu." },
        { id: 6, english: "On Monday I work.", bosnian: "U ponedjeljak radim." },
        { id: 7, english: "Sunday is a day of rest.", bosnian: "Nedjelja je dan odmora." },
        { id: 8, english: "Wednesday comes after Tuesday.", bosnian: "Srijeda dolazi poslije utorka." },
        { id: 9, english: "Friday is before Saturday.", bosnian: "Petak je prije subote." },
        { id: 10, english: "I love weekends.", bosnian: "Volim vikende." }
      ]
    },
    // Lesson 6: Months and Seasons (u + mjesec, godišnja doba, rođendan)
    6: {
      fillBlank: [
        { id: 1, sentence: "Moj rođendan je u _____.", answer: "maju", translation: "My birthday is in May.", options: ["januar", "maju", "juli", "decembar"] },
        { id: 2, sentence: "U _____ pada snijeg.", answer: "januaru", translation: "In January snow falls.", options: ["januaru", "junu", "augustu", "maju"] },
        { id: 3, sentence: "_____ je toplo godišnje doba.", answer: "Ljeto", translation: "Summer is a warm season.", options: ["Zima", "Jesen", "Proljeće", "Ljeto"] },
        { id: 4, sentence: "U _____ i oktobru je jesen.", answer: "septembru", translation: "In September and October it's autumn.", options: ["martu", "junu", "septembru", "decembru"] },
        { id: 5, sentence: "_____ počinje u martu.", answer: "Proljeće", translation: "Spring begins in March.", options: ["Zima", "Ljeto", "Jesen", "Proljeće"] },
        { id: 6, sentence: "U julu i _____ idemo na more.", answer: "augustu", translation: "In July and August we go to the sea.", options: ["januaru", "martu", "augustu", "novembru"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["tvoj", "je", "Kada", "rođendan"], correct: ["Kada", "je", "tvoj", "rođendan"], translation: "When is your birthday?" },
        { id: 2, scrambled: ["u", "maju", "Moj", "rođendan", "je"], correct: ["Moj", "rođendan", "je", "u", "maju"], translation: "My birthday is in May." },
        { id: 3, scrambled: ["zimi", "pada", "Snijeg"], correct: ["Snijeg", "pada", "zimi"], translation: "Snow falls in winter." },
        { id: 4, scrambled: ["u", "počinje", "Ljeto", "junu"], correct: ["Ljeto", "počinje", "u", "junu"], translation: "Summer begins in June." },
        { id: 5, scrambled: ["pada", "jesen", "U", "lišće"], correct: ["U", "jesen", "lišće", "pada"], translation: "In autumn leaves fall." }
      ],
      matching: [
        { id: 1, bosnian: "U januaru", english: "In January" },
        { id: 2, bosnian: "U maju", english: "In May" },
        { id: 3, bosnian: "U proljeće", english: "In spring" },
        { id: 4, bosnian: "Zimi", english: "In winter" },
        { id: 5, bosnian: "U jesen", english: "In autumn" },
        { id: 6, bosnian: "Ljeti", english: "In summer" }
      ],
      translation: [
        { id: 1, english: "When is your birthday?", bosnian: "Kada je tvoj rođendan?", options: ["Kada je tvoj rođendan?", "Koliko imaš godina?", "Gdje živiš?", "Kako se zoveš?"] },
        { id: 2, english: "My birthday is in December", bosnian: "Moj rođendan je u decembru", options: ["Moj rođendan je u maju", "Moj rođendan je u decembru", "Moj rođendan je u julu", "Moj rođendan je u martu"] },
        { id: 3, english: "Snow falls in winter", bosnian: "Snijeg pada zimi", options: ["Snijeg pada ljeti", "Snijeg pada zimi", "Snijeg pada u proljeće", "Snijeg pada u jesen"] },
        { id: 4, english: "In July we go to Neum", bosnian: "U julu idemo u Neum", options: ["U januaru idemo u Neum", "U julu idemo u Neum", "U martu idemo u Neum", "U oktobru idemo u Neum"] }
      ],
      writing: [
        { id: 1, english: "When is your birthday?", bosnian: "Kada je tvoj rođendan?" },
        { id: 2, english: "My birthday is in May.", bosnian: "Moj rođendan je u maju." },
        { id: 3, english: "In January snow falls.", bosnian: "U januaru pada snijeg." },
        { id: 4, english: "Summer is warm.", bosnian: "Ljeto je toplo." },
        { id: 5, english: "Spring begins in March.", bosnian: "Proljeće počinje u martu." },
        { id: 6, english: "In July we go to the sea.", bosnian: "U julu idemo na more." },
        { id: 7, english: "Winter is cold.", bosnian: "Zima je hladna." },
        { id: 8, english: "In autumn leaves fall.", bosnian: "U jesen lišće pada." },
        { id: 9, english: "December is cold.", bosnian: "Decembar je hladan." },
        { id: 10, english: "I love spring.", bosnian: "Volim proljeće." }
      ]
    },
    // Lesson 7: Food and Drink (volim/ne volim, želim, koliko košta, naručivanje)
    7: {
      fillBlank: [
        { id: 1, sentence: "_____ ćevape sa lukom.", answer: "Volim", translation: "I love cevapi with onions.", options: ["Volim", "Voliš", "Voli", "Volimo"] },
        { id: 2, sentence: "Ja ne _____ ribu.", answer: "volim", translation: "I don't like fish.", options: ["volim", "voliš", "želim", "želiš"] },
        { id: 3, sentence: "_____ jednu bosansku kafu, molim.", answer: "Želim", translation: "I want one Bosnian coffee, please.", options: ["Želim", "Volim", "Imam", "Pijem"] },
        { id: 4, sentence: "_____ košta burek?", answer: "Koliko", translation: "How much does burek cost?", options: ["Koliko", "Kada", "Gdje", "Šta"] },
        { id: 5, sentence: "_____, molim.", answer: "Račun", translation: "The bill, please.", options: ["Račun", "Kafu", "Vodu", "Hljeb"] },
        { id: 6, sentence: "Šta _____ piti?", answer: "želite", translation: "What would you like to drink?", options: ["želim", "želiš", "želite", "žele"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["kafu", "Želim", "jednu", "bosansku"], correct: ["Želim", "jednu", "bosansku", "kafu"], translation: "I want one Bosnian coffee." },
        { id: 2, scrambled: ["ćevape", "ne", "Ja", "volim"], correct: ["Ja", "ne", "volim", "ćevape"], translation: "I don't like cevapi." },
        { id: 3, scrambled: ["košta", "Koliko", "burek"], correct: ["Koliko", "košta", "burek"], translation: "How much does burek cost?" },
        { id: 4, scrambled: ["molim", "Račun"], correct: ["Račun", "molim"], translation: "The bill, please." },
        { id: 5, scrambled: ["jesti", "želite", "Šta"], correct: ["Šta", "želite", "jesti"], translation: "What would you like to eat?" }
      ],
      matching: [
        { id: 1, bosnian: "Volim kafu", english: "I love coffee" },
        { id: 2, bosnian: "Ne volim ribu", english: "I don't like fish" },
        { id: 3, bosnian: "Želim vodu", english: "I want water" },
        { id: 4, bosnian: "Koliko košta?", english: "How much?" },
        { id: 5, bosnian: "Račun, molim", english: "The bill, please" },
        { id: 6, bosnian: "Mogu li dobiti...?", english: "Can I get...?" }
      ],
      translation: [
        { id: 1, english: "I love cevapi with kajmak", bosnian: "Volim ćevape sa kajmakom", options: ["Volim ćevape sa kajmakom", "Želim ćevape sa kajmakom", "Ne volim ćevape", "Imam ćevape"] },
        { id: 2, english: "I don't like onions", bosnian: "Ne volim luk", options: ["Volim luk", "Ne volim luk", "Želim luk", "Imam luk"] },
        { id: 3, english: "How much does coffee cost?", bosnian: "Koliko košta kafa?", options: ["Koliko košta kafa?", "Gdje je kafa?", "Želim kafu", "Volim kafu"] },
        { id: 4, english: "What would you like to eat?", bosnian: "Šta želite jesti?", options: ["Šta želite jesti?", "Šta volite jesti?", "Koliko košta?", "Gdje je restoran?"] }
      ],
      writing: [
        { id: 1, english: "I love cevapi with onions.", bosnian: "Volim ćevape sa lukom." },
        { id: 2, english: "I don't like fish.", bosnian: "Ne volim ribu." },
        { id: 3, english: "I want one Bosnian coffee, please.", bosnian: "Želim jednu bosansku kafu, molim." },
        { id: 4, english: "How much does burek cost?", bosnian: "Koliko košta burek?" },
        { id: 5, english: "The bill, please.", bosnian: "Račun, molim." },
        { id: 6, english: "What would you like to drink?", bosnian: "Šta želite piti?" },
        { id: 7, english: "I am hungry.", bosnian: "Gladan sam." },
        { id: 8, english: "The food is delicious.", bosnian: "Hrana je ukusna." },
        { id: 9, english: "Can I get water?", bosnian: "Mogu li dobiti vodu?" },
        { id: 10, english: "I want pie with cheese.", bosnian: "Želim pitu sa sirom." }
      ]
    },
    // Lesson 8: House and Apartment (prijedlozi mjesta: u, na, ispod, iznad, pored, između, iza, ispred)
    8: {
      fillBlank: [
        { id: 1, sentence: "Živim _____ stanu u Sarajevu.", answer: "u", translation: "I live in an apartment in Sarajevo.", options: ["u", "na", "iz", "sa"] },
        { id: 2, sentence: "Knjiga je _____ stolu.", answer: "na", translation: "The book is on the table.", options: ["u", "na", "ispod", "iza"] },
        { id: 3, sentence: "Mačka je _____ kreveta.", answer: "ispod", translation: "The cat is under the bed.", options: ["na", "u", "ispod", "iznad"] },
        { id: 4, sentence: "Slika je _____ vrata.", answer: "iznad", translation: "The picture is above the door.", options: ["ispod", "iznad", "pored", "iza"] },
        { id: 5, sentence: "Kupatilo je _____ spavaće sobe.", answer: "pored", translation: "The bathroom is next to the bedroom.", options: ["ispod", "iznad", "pored", "u"] },
        { id: 6, sentence: "Stolice su _____ stola i zida.", answer: "između", translation: "The chairs are between the table and the wall.", options: ["pored", "između", "ispred", "iza"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["živiš", "Gdje", "ti"], correct: ["Gdje", "živiš", "ti"], translation: "Where do you live?" },
        { id: 2, scrambled: ["u", "Živim", "kući", "velikoj"], correct: ["Živim", "u", "velikoj", "kući"], translation: "I live in a big house." },
        { id: 3, scrambled: ["je", "na", "Knjiga", "stolu"], correct: ["Knjiga", "je", "na", "stolu"], translation: "The book is on the table." },
        { id: 4, scrambled: ["je", "kuće", "Vrt", "iza"], correct: ["Vrt", "je", "iza", "kuće"], translation: "The garden is behind the house." },
        { id: 5, scrambled: ["kuhinje", "Kupatilo", "pored", "je"], correct: ["Kupatilo", "je", "pored", "kuhinje"], translation: "The bathroom is next to the kitchen." }
      ],
      matching: [
        { id: 1, bosnian: "U kući", english: "In the house" },
        { id: 2, bosnian: "Na stolu", english: "On the table" },
        { id: 3, bosnian: "Ispod kreveta", english: "Under the bed" },
        { id: 4, bosnian: "Iznad vrata", english: "Above the door" },
        { id: 5, bosnian: "Pored prozora", english: "Next to the window" },
        { id: 6, bosnian: "Iza kuće", english: "Behind the house" }
      ],
      translation: [
        { id: 1, english: "Where do you live?", bosnian: "Gdje živiš?", options: ["Gdje živiš?", "Kako si?", "Šta radiš?", "Odakle si?"] },
        { id: 2, english: "I live in an apartment", bosnian: "Živim u stanu", options: ["Živim u kući", "Živim u stanu", "Imam stan", "Volim stan"] },
        { id: 3, english: "The kitchen is next to the living room", bosnian: "Kuhinja je pored dnevne sobe", options: ["Kuhinja je pored dnevne sobe", "Kuhinja je iza dnevne sobe", "Kuhinja je u dnevnoj sobi", "Kuhinja je ispod dnevne sobe"] },
        { id: 4, english: "The cat is under the table", bosnian: "Mačka je ispod stola", options: ["Mačka je na stolu", "Mačka je ispod stola", "Mačka je pored stola", "Mačka je iza stola"] }
      ],
      writing: [
        { id: 1, english: "I live in an apartment in Sarajevo.", bosnian: "Živim u stanu u Sarajevu." },
        { id: 2, english: "The book is on the table.", bosnian: "Knjiga je na stolu." },
        { id: 3, english: "The cat is under the bed.", bosnian: "Mačka je ispod kreveta." },
        { id: 4, english: "The picture is above the door.", bosnian: "Slika je iznad vrata." },
        { id: 5, english: "The bathroom is next to the bedroom.", bosnian: "Kupatilo je pored spavaće sobe." },
        { id: 6, english: "Where do you live?", bosnian: "Gdje živiš?" },
        { id: 7, english: "I live in a big house.", bosnian: "Živim u velikoj kući." },
        { id: 8, english: "The garden is behind the house.", bosnian: "Vrt je iza kuće." },
        { id: 9, english: "The chair is between the table and the wall.", bosnian: "Stolica je između stola i zida." },
        { id: 10, english: "The kitchen is in my apartment.", bosnian: "Kuhinja je u mom stanu." }
      ]
    },
    // Lesson 9: Body and Health (boli me..., bole me..., dijelovi tijela, kako se osjećate)
    9: {
      fillBlank: [
        { id: 1, sentence: "Boli me _____.", answer: "glava", translation: "My head hurts.", options: ["glava", "ruka", "oči", "uši"] },
        { id: 2, sentence: "_____ me oči.", answer: "Bole", translation: "My eyes hurt.", options: ["Boli", "Bole", "Imam", "Vidim"] },
        { id: 3, sentence: "_____ sam danas.", answer: "Bolestan", translation: "I am sick today.", options: ["Bolestan", "Sretan", "Gladan", "Dobar"] },
        { id: 4, sentence: "Kako se _____?", answer: "osjećate", translation: "How are you feeling?", options: ["osjećate", "zovete", "bavite", "živite"] },
        { id: 5, sentence: "_____ sam. Trebam odmor.", answer: "Umorna", translation: "I'm tired. I need rest.", options: ["Umorna", "Sretna", "Gladna", "Zdrava"] },
        { id: 6, sentence: "Boli me _____ i grlo.", answer: "glava", translation: "My head and throat hurt.", options: ["glava", "noga", "ruka", "stomak"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["me", "Boli", "stomak"], correct: ["Boli", "me", "stomak"], translation: "My stomach hurts." },
        { id: 2, scrambled: ["sam", "Umoran", "danas"], correct: ["Umoran", "sam", "danas"], translation: "I am tired today." },
        { id: 3, scrambled: ["me", "Bole", "oči"], correct: ["Bole", "me", "oči"], translation: "My eyes hurt." },
        { id: 4, scrambled: ["sam", "Loše"], correct: ["Loše", "sam"], translation: "I'm not well." },
        { id: 5, scrambled: ["se", "Kako", "osjećate"], correct: ["Kako", "se", "osjećate"], translation: "How are you feeling?" }
      ],
      matching: [
        { id: 1, bosnian: "Boli me glava", english: "My head hurts" },
        { id: 2, bosnian: "Bole me oči", english: "My eyes hurt" },
        { id: 3, bosnian: "Bolestan sam", english: "I'm sick" },
        { id: 4, bosnian: "Umorna sam", english: "I'm tired (f)" },
        { id: 5, bosnian: "Loše sam", english: "I'm not well" },
        { id: 6, bosnian: "Dobro sam", english: "I'm fine" }
      ],
      translation: [
        { id: 1, english: "My head hurts", bosnian: "Boli me glava", options: ["Boli me glava", "Bole me glave", "Imam glavu", "Vidim glavu"] },
        { id: 2, english: "I am tired", bosnian: "Umoran sam", options: ["Umoran sam", "Bolestan sam", "Sretan sam", "Gladan sam"] },
        { id: 3, english: "My eyes hurt", bosnian: "Bole me oči", options: ["Boli me oko", "Bole me oči", "Imam oči", "Vidim oči"] },
        { id: 4, english: "How are you feeling?", bosnian: "Kako se osjećate?", options: ["Kako se osjećate?", "Kako se zovete?", "Gdje živite?", "Šta radite?"] }
      ],
      writing: [
        { id: 1, english: "My head hurts.", bosnian: "Boli me glava." },
        { id: 2, english: "My eyes hurt.", bosnian: "Bole me oči." },
        { id: 3, english: "I am sick today.", bosnian: "Bolestan sam danas." },
        { id: 4, english: "How are you feeling?", bosnian: "Kako se osjećate?" },
        { id: 5, english: "I am tired.", bosnian: "Umoran sam." },
        { id: 6, english: "My stomach hurts.", bosnian: "Boli me stomak." },
        { id: 7, english: "I need rest.", bosnian: "Trebam odmor." },
        { id: 8, english: "I am not well.", bosnian: "Loše sam." },
        { id: 9, english: "My throat hurts.", bosnian: "Boli me grlo." },
        { id: 10, english: "I feel good.", bosnian: "Osjećam se dobro." }
      ]
    },
    // Lesson 10: Jobs and Work
    10: {
      fillBlank: [
        { id: 1, sentence: "_____ kao učiteljica.", answer: "Radim", translation: "I work as a teacher.", options: ["Radim", "Radiš", "Radi", "Radimo"] },
        { id: 2, sentence: "Ona je _____.", answer: "doktorica", translation: "She is a doctor.", options: ["doktor", "doktorica", "učitelj", "učiteljica"] },
        { id: 3, sentence: "Moj otac _____ u bolnici.", answer: "radi", translation: "My father works in a hospital.", options: ["radim", "radiš", "radi", "rade"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["baviš", "se", "Čime"], correct: ["Čime", "se", "baviš"], translation: "What do you do?" },
        { id: 2, scrambled: ["u", "školi", "Radim"], correct: ["Radim", "u", "školi"], translation: "I work at a school." }
      ],
      matching: [
        { id: 1, bosnian: "Doktor", english: "Doctor" },
        { id: 2, bosnian: "Učitelj", english: "Teacher" },
        { id: 3, bosnian: "Inženjer", english: "Engineer" },
        { id: 4, bosnian: "Kuhar", english: "Cook" },
        { id: 5, bosnian: "Vozač", english: "Driver" },
        { id: 6, bosnian: "Prodavač", english: "Salesperson" }
      ],
      translation: [
        { id: 1, english: "What do you do?", bosnian: "Čime se baviš?", options: ["Čime se baviš?", "Kako si?", "Gdje živiš?", "Koliko imaš godina?"] },
        { id: 2, english: "I work as an engineer", bosnian: "Radim kao inženjer", options: ["Radim kao inženjer", "Radim kao doktor", "Radim kao učitelj", "Radim kao kuhar"] }
      ],
      writing: [
        { id: 1, english: "I work as a teacher.", bosnian: "Radim kao učitelj." },
        { id: 2, english: "She is a doctor.", bosnian: "Ona je doktorica." },
        { id: 3, english: "My father works in a hospital.", bosnian: "Moj otac radi u bolnici." },
        { id: 4, english: "What do you do?", bosnian: "Čime se baviš?" },
        { id: 5, english: "I work at a school.", bosnian: "Radim u školi." },
        { id: 6, english: "He is an engineer.", bosnian: "On je inženjer." },
        { id: 7, english: "My mother is a cook.", bosnian: "Moja majka je kuharica." },
        { id: 8, english: "I am a student.", bosnian: "Ja sam student." },
        { id: 9, english: "Where do you work?", bosnian: "Gdje radiš?" },
        { id: 10, english: "She works in an office.", bosnian: "Ona radi u kancelariji." }
      ]
    },
    // Lesson 11: Time
    11: {
      fillBlank: [
        { id: 1, sentence: "Koliko je _____?", answer: "sati", translation: "What time is it?", options: ["sati", "dana", "godina", "minuta"] },
        { id: 2, sentence: "Sada je _____ devet.", answer: "pola", translation: "It's 8:30 now.", options: ["pola", "četvrt", "tri", "dva"] },
        { id: 3, sentence: "Film počinje u _____ sati.", answer: "pet", translation: "The movie starts at 5 o'clock.", options: ["tri", "četiri", "pet", "šest"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["sati", "je", "Koliko"], correct: ["Koliko", "je", "sati"], translation: "What time is it?" },
        { id: 2, scrambled: ["osam", "je", "Sada", "sati"], correct: ["Sada", "je", "osam", "sati"], translation: "It's 8 o'clock now." }
      ],
      matching: [
        { id: 1, bosnian: "Sat", english: "Hour/Clock" },
        { id: 2, bosnian: "Minuta", english: "Minute" },
        { id: 3, bosnian: "Jutro", english: "Morning" },
        { id: 4, bosnian: "Podne", english: "Noon" },
        { id: 5, bosnian: "Veče", english: "Evening" },
        { id: 6, bosnian: "Noć", english: "Night" }
      ],
      translation: [
        { id: 1, english: "What time is it?", bosnian: "Koliko je sati?", options: ["Koliko je sati?", "Koji je dan?", "Kako si?", "Gdje si?"] },
        { id: 2, english: "It's half past two", bosnian: "Pola tri je", options: ["Dva sata je", "Pola tri je", "Tri sata je", "Četvrt tri je"] }
      ],
      writing: [
        { id: 1, english: "What time is it?", bosnian: "Koliko je sati?" },
        { id: 2, english: "It is eight o'clock.", bosnian: "Sada je osam sati." },
        { id: 3, english: "It is half past nine.", bosnian: "Pola deset je." },
        { id: 4, english: "The movie starts at five.", bosnian: "Film počinje u pet." },
        { id: 5, english: "Good morning!", bosnian: "Dobro jutro!" },
        { id: 6, english: "Good evening!", bosnian: "Dobro veče!" },
        { id: 7, english: "Good night!", bosnian: "Laku noć!" },
        { id: 8, english: "It is noon.", bosnian: "Sada je podne." },
        { id: 9, english: "I wake up at seven.", bosnian: "Buđim se u sedam." },
        { id: 10, english: "I go to sleep at eleven.", bosnian: "Idem spavati u jedanaest." }
      ]
    },
    // Lesson 12: Basic Phrases
    12: {
      fillBlank: [
        { id: 1, sentence: "_____, ne razumijem.", answer: "Izvinite", translation: "Sorry, I don't understand.", options: ["Izvinite", "Hvala", "Molim", "Naravno"] },
        { id: 2, sentence: "_____ li engleski?", answer: "Govorite", translation: "Do you speak English?", options: ["Govorite", "Govorim", "Govori", "Govore"] },
        { id: 3, sentence: "Nema na _____!", answer: "čemu", translation: "You're welcome!", options: ["čemu", "šta", "kako", "gdje"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["mi", "pomoći", "Možete", "li"], correct: ["Možete", "li", "mi", "pomoći"], translation: "Can you help me?" },
        { id: 2, scrambled: ["razumijem", "Ne", "bosanski"], correct: ["Ne", "razumijem", "bosanski"], translation: "I don't understand Bosnian." }
      ],
      matching: [
        { id: 1, bosnian: "Izvinite", english: "Excuse me" },
        { id: 2, bosnian: "Naravno", english: "Of course" },
        { id: 3, bosnian: "Možda", english: "Maybe" },
        { id: 4, bosnian: "Nema problema", english: "No problem" },
        { id: 5, bosnian: "Ne razumijem", english: "I don't understand" },
        { id: 6, bosnian: "Polako, molim", english: "Slowly, please" }
      ],
      translation: [
        { id: 1, english: "Do you speak English?", bosnian: "Govorite li engleski?", options: ["Govorite li engleski?", "Govorite li bosanski?", "Razumijete li?", "Možete li?"] },
        { id: 2, english: "I don't understand", bosnian: "Ne razumijem", options: ["Ne razumijem", "Ne znam", "Ne mogu", "Ne volim"] }
      ],
      writing: [
        { id: 1, english: "Excuse me, I don't understand.", bosnian: "Izvinite, ne razumijem." },
        { id: 2, english: "Do you speak English?", bosnian: "Govorite li engleski?" },
        { id: 3, english: "You're welcome!", bosnian: "Nema na čemu!" },
        { id: 4, english: "Can you help me?", bosnian: "Možete li mi pomoći?" },
        { id: 5, english: "I don't understand Bosnian.", bosnian: "Ne razumijem bosanski." },
        { id: 6, english: "Slowly, please.", bosnian: "Polako, molim." },
        { id: 7, english: "Of course!", bosnian: "Naravno!" },
        { id: 8, english: "No problem.", bosnian: "Nema problema." },
        { id: 9, english: "Maybe tomorrow.", bosnian: "Možda sutra." },
        { id: 10, english: "Thank you very much.", bosnian: "Hvala lijepo." }
      ]
    }
  }

  // Get exercises for current lesson (fallback to lesson 1 if not found)
  const currentExercises = exercisesByLesson[lesson?.id] || exercisesByLesson[1]
  const grammarExercisesList = currentExercises.fillBlank
  const sentenceOrderingList = currentExercises.sentenceOrder
  const matchingList = currentExercises.matching
  const translationList = currentExercises.translation
  const writingList = currentExercises.writing || []

  // Get options for fill-blank based on lesson
  const getVerbOptions = () => {
    if (lesson?.id === 2) return ["dva", "tri", "pet", "deset", "dvadeset", "sto"]
    if (lesson?.id === 3) return ["crveno", "plavo", "zeleno", "žuto", "bijelo", "crno"]
    return ["sam", "si", "je", "smo", "ste", "su"]
  }
  const verbOptions = getVerbOptions()

  const handleDragStart = (verb) => {
    setGrammarExercises(prev => ({ ...prev, draggedItem: verb }))
  }

  const handleDrop = (exerciseId) => {
    if (grammarExercises.draggedItem) {
      setGrammarExercises(prev => ({
        ...prev,
        answers: { ...prev.answers, [exerciseId]: prev.draggedItem },
        draggedItem: null
      }))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Submit all exercises to backend - defined here so it can be called by check functions
  const submitAllExercisesToBackend = async (grammarDone, sentenceDone, matchingDone, translationDone) => {
    // Only submit if ALL 4 types are done
    if (!grammarDone || !sentenceDone || !matchingDone || !translationDone) return
    if (!isAuthenticated || !lesson) return
    if (allExercisesCompleted) return
    
    // Calculate scores using the current state values
    const currentExercises = exercisesByLesson[lesson?.id] || exercisesByLesson[1]
    const grammarList = currentExercises.fillBlank
    const sentenceList = currentExercises.sentenceOrder
    const matchList = currentExercises.matching
    const transList = currentExercises.translation
    
    let grammarScore = 0
    grammarList.forEach(ex => {
      if (grammarExercises.answers[ex.id] === ex.answer) grammarScore++
    })
    
    let sentenceScore = 0
    sentenceList.forEach(ex => {
      const userAnswer = (wordPositions[ex.id] || []).join(' ')
      if (userAnswer === ex.correct) sentenceScore++
    })
    
    let matchingScore = 0
    matchList.forEach(ex => {
      if (matchedPairs[ex.bosnian] === ex.english) matchingScore++
    })
    
    let translationScore = 0
    transList.forEach(ex => {
      if (translationInputs[ex.id] === ex.correct) translationScore++
    })
    
    const totalScore = grammarScore + sentenceScore + matchingScore + translationScore
    const totalExercises = grammarList.length + sentenceList.length + matchList.length + transList.length
    
    console.log('Submitting exercises:', { totalScore, totalExercises })
    
    setAllExercisesCompleted(true)
    try {
      const result = await progressApi.submitExercises(parseInt(lessonId), totalScore, totalExercises)
      console.log('Exercise submission result:', result)
      setExerciseResult(result)
      setLessonProgress(prev => ({
        ...prev,
        exercises_passed: result.exercises_passed,
        exercises_completed: true,
        best_exercise_percentage: result.percentage
      }))
      await refreshStats()
    } catch (error) {
      console.error('Failed to submit exercise results:', error)
      setAllExercisesCompleted(false)
    }
  }

  const checkGrammarExercises = () => {
    setGrammarExercises(prev => ({ ...prev, showResults: true }))
    // Try to submit if all exercises are done
    submitAllExercisesToBackend(true, sentenceExercises.showResults, matchingExercises.showResults, translationExercises.showResults)
  }

  const resetGrammarExercises = () => {
    setGrammarExercises({ answers: {}, showResults: false, draggedItem: null })
    setExerciseResult(null)
    setAllExercisesCompleted(false)
  }

  const getGrammarScore = () => {
    let correct = 0
    grammarExercisesList.forEach(ex => {
      if (grammarExercises.answers[ex.id] === ex.answer) correct++
    })
    return correct
  }

  // Sentence ordering handlers
  const [draggedWord, setDraggedWord] = useState(null)
  const [wordPositions, setWordPositions] = useState({})

  const initializeSentenceExercise = (exerciseId, words) => {
    if (!wordPositions[exerciseId]) {
      setWordPositions(prev => ({
        ...prev,
        [exerciseId]: [...words]
      }))
    }
  }

  const handleWordDragStart = (exerciseId, wordIndex) => {
    setDraggedWord({ exerciseId, wordIndex })
  }

  const handleWordDrop = (exerciseId, targetIndex) => {
    if (draggedWord && draggedWord.exerciseId === exerciseId) {
      const words = [...(wordPositions[exerciseId] || [])]
      const [removed] = words.splice(draggedWord.wordIndex, 1)
      words.splice(targetIndex, 0, removed)
      setWordPositions(prev => ({
        ...prev,
        [exerciseId]: words
      }))
    }
    setDraggedWord(null)
  }

  const checkSentenceExercises = () => {
    setSentenceExercises(prev => ({ ...prev, showResults: true }))
    // Try to submit if all exercises are done
    submitAllExercisesToBackend(grammarExercises.showResults, true, matchingExercises.showResults, translationExercises.showResults)
  }

  const resetSentenceExercises = () => {
    setWordPositions({})
    setSentenceExercises({ answers: {}, showResults: false })
    setExerciseResult(null)
    setAllExercisesCompleted(false)
  }

  const getSentenceScore = () => {
    let correct = 0
    sentenceOrderingList.forEach(ex => {
      const built = sentenceExercises.answers[ex.id]?.built || []
      if (JSON.stringify(built) === JSON.stringify(ex.correct)) correct++
    })
    return correct
  }

  // Matching exercise handlers
  const [selectedBosnian, setSelectedBosnian] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState({})

  const handleMatchClick = (type, id, value) => {
    if (matchingExercises.showResults) return
    
    if (type === 'bosnian') {
      setSelectedBosnian({ id, value })
    } else if (type === 'english' && selectedBosnian) {
      const newPairs = { ...matchedPairs, [selectedBosnian.id]: value }
      setMatchedPairs(newPairs)
      setSelectedBosnian(null)
      saveExerciseProgress(null, null, newPairs, null)
    }
  }

  const checkMatchingExercises = () => {
    setMatchingExercises({ answers: matchedPairs, showResults: true })
    // Try to submit if all exercises are done
    submitAllExercisesToBackend(grammarExercises.showResults, sentenceExercises.showResults, true, translationExercises.showResults)
  }

  const resetMatchingExercises = () => {
    setMatchedPairs({})
    setSelectedBosnian(null)
    setMatchingExercises({ answers: {}, showResults: false })
    setExerciseResult(null)
    setAllExercisesCompleted(false)
  }

  const getMatchingScore = () => {
    let correct = 0
    matchingList.forEach(item => {
      if (matchedPairs[item.id] === item.english) correct++
    })
    return correct
  }

  // Translation exercise handlers
  const [translationInputs, setTranslationInputs] = useState({})

  const checkTranslationExercises = () => {
    setTranslationExercises({ answers: translationInputs, showResults: true })
    // Try to submit if all exercises are done
    submitAllExercisesToBackend(grammarExercises.showResults, sentenceExercises.showResults, matchingExercises.showResults, true)
  }

  const resetTranslationExercises = () => {
    setTranslationInputs({})
    setTranslationExercises({ answers: {}, showResults: false })
    setExerciseResult(null)
    setAllExercisesCompleted(false)
  }

  const getTranslationScore = () => {
    let correct = 0
    translationList.forEach(item => {
      if (translationInputs[item.id] === item.bosnian) correct++
    })
    return correct
  }

  // Writing exercise handlers
  const handleWritingInput = (id, value) => {
    setWritingExercises(prev => ({
      ...prev,
      answers: { ...prev.answers, [id]: value }
    }))
  }

  const normalizeText = (text) => {
    if (!text) return ''
    return text.toLowerCase().trim()
      .replace(/[.!?,;:]+$/, '') // Remove trailing punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
  }

  // Calculate similarity score between two strings (Levenshtein-based percentage)
  const calculateSimilarity = (userText, correctText) => {
    const user = normalizeText(userText)
    const correct = normalizeText(correctText)
    
    if (user === correct) return 100
    if (!user) return 0
    
    // Simple word-based scoring
    const userWords = user.split(' ')
    const correctWords = correct.split(' ')
    
    let matchedWords = 0
    userWords.forEach(word => {
      if (correctWords.some(cw => cw === word || cw.includes(word) || word.includes(cw))) {
        matchedWords++
      }
    })
    
    const wordScore = (matchedWords / Math.max(correctWords.length, userWords.length)) * 100
    
    // Character similarity bonus
    let charMatches = 0
    const minLen = Math.min(user.length, correct.length)
    for (let i = 0; i < minLen; i++) {
      if (user[i] === correct[i]) charMatches++
    }
    const charScore = (charMatches / Math.max(user.length, correct.length)) * 100
    
    return Math.round((wordScore * 0.6 + charScore * 0.4))
  }

  // Get rating based on similarity score
  const getScoreRating = (score) => {
    if (score === 100) return { emoji: '🌟', text: 'Savršeno!', color: 'text-green-600' }
    if (score >= 80) return { emoji: '👏', text: 'Odlično!', color: 'text-green-500' }
    if (score >= 60) return { emoji: '👍', text: 'Dobro!', color: 'text-yellow-600' }
    if (score >= 40) return { emoji: '💪', text: 'Nastavi vježbati!', color: 'text-orange-500' }
    return { emoji: '📚', text: 'Pokušaj ponovo', color: 'text-red-500' }
  }

  // Submit single sentence for checking
  const submitWritingSentence = (id) => {
    const item = writingList.find(w => w.id === id)
    if (!item) return
    
    const userAnswer = writingExercises.answers[id] || ''
    const score = calculateSimilarity(userAnswer, item.bosnian)
    
    setWritingExercises(prev => ({
      ...prev,
      checked: { ...prev.checked, [id]: { score, submitted: true } }
    }))
    
    // Play audio after short delay
    setTimeout(() => {
      speak(item.bosnian)
    }, 300)
  }

  // Handle Enter key press to submit
  const handleWritingKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitWritingSentence(id)
    }
  }

  const resetWritingExercises = () => {
    setWritingExercises({ answers: {}, showResults: false, isPlayingAudio: false, currentAudioIndex: -1, checked: {} })
  }

  const getWritingScore = () => {
    let total = 0
    let count = 0
    writingList.forEach(item => {
      if (writingExercises.checked?.[item.id]?.submitted) {
        total += writingExercises.checked[item.id].score
        count++
      }
    })
    return count > 0 ? Math.round(total / count) : 0
  }

  const getCompletedCount = () => {
    return writingList.filter(item => writingExercises.checked?.[item.id]?.submitted).length
  }

  const playAllWritingAudio = async () => {
    if (writingExercises.isPlayingAudio) return
    
    setWritingExercises(prev => ({ ...prev, isPlayingAudio: true, currentAudioIndex: 0 }))
    
    for (let i = 0; i < writingList.length; i++) {
      setWritingExercises(prev => ({ ...prev, currentAudioIndex: i }))
      await new Promise(resolve => {
        speak(writingList[i].bosnian)
        // Wait for speech to complete (estimate based on text length)
        const waitTime = Math.max(2000, writingList[i].bosnian.length * 80)
        setTimeout(resolve, waitTime)
      })
    }
    
    setWritingExercises(prev => ({ ...prev, isPlayingAudio: false, currentAudioIndex: -1 }))
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

  if (accessDenied) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lekcija zaključana</h2>
          <p className="text-gray-600 mb-6">
            Morate završiti prethodne lekcije prije pristupa ovoj lekciji.
          </p>
          <div className="space-y-3">
            <Link
              to={`/lesson/${stats?.current_lesson_id || 1}`}
              className="block w-full bg-bosnia-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Idi na lekciju {stats?.current_lesson_id || 1}
            </Link>
            <Link
              to="/levels/a1"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Nazad na listu lekcija
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return <div className="text-center py-12">Lekcija nije pronađena</div>
  }

  const tabs = [
    { id: 'vocabulary', label: 'Vokabular', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'grammar', label: 'Gramatika', icon: <PenTool className="w-4 h-4" /> },
    { id: 'exercises', label: 'Vježbajmo', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'dialogue', label: 'Dijalog', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'culture', label: 'Kultura', icon: <Globe className="w-4 h-4" /> },
    { id: 'quiz', label: 'Kviz', icon: <HelpCircle className="w-4 h-4" /> }
  ]

  const exerciseTypes = [
    { id: 'fillBlank', label: 'Popuni prazninu', icon: '✏️' },
    { id: 'sentenceOrder', label: 'Složi rečenicu', icon: '🔀' },
    { id: 'matching', label: 'Spoji parove', icon: '🔗' },
    { id: 'translation', label: 'Prevedi', icon: '🌍' },
    { id: 'writing', label: 'Piši', icon: '✍️' }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 safe-area-inset">
      <Link
        to={`/levels/${lesson.level}`}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-bosnia-blue mb-4 sm:mb-6 transition-colors py-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Nazad</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6 animate-fadeIn">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {lesson.level.toUpperCase()}
              </span>
              <span className="text-gray-600 text-sm">Lekcija {lesson.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{lesson.description}</p>
          </div>
        </div>

        {/* Objectives */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Ciljevi lekcije</span>
          </h3>
          <ul className="grid md:grid-cols-2 gap-2">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2 text-blue-700">
                <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress Requirements - Only show for authenticated users */}
        {isAuthenticated && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Za otključavanje sljedeće lekcije</span>
            </h3>
            
            {/* Quiz Progress - Only quiz required */}
            <div className={`p-3 rounded-lg border-2 ${
                lessonProgress?.quiz_passed 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className={`w-5 h-5 ${lessonProgress?.quiz_passed ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${lessonProgress?.quiz_passed ? 'text-green-700' : 'text-gray-700'}`}>
                      Kviz
                    </span>
                  </div>
                  {lessonProgress?.quiz_passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-sm text-gray-500">≥70% potrebno</span>
                  )}
                </div>
                {/* Live quiz progress bar */}
                {(() => {
                  const totalQuestions = lesson?.quiz?.length || 0
                  const answeredQuestions = Object.keys(quizState.answers).length
                  const correctAnswers = Object.values(quizState.answers).filter(a => a?.correct).length
                  const currentPercentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0
                  const projectedPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
                  
                  return answeredQuestions > 0 && !quizState.showResult && !lessonProgress?.quiz_passed ? (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Trenutni napredak</span>
                        <span className={projectedPercentage >= 70 ? 'text-green-600 font-bold' : ''}>{projectedPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${projectedPercentage >= 70 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${projectedPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{correctAnswers}/{totalQuestions} tačno ({answeredQuestions} odgovoreno)</div>
                    </div>
                  ) : lessonProgress?.best_quiz_percentage > 0 ? (
                    <div className="mt-2 text-sm text-gray-600">
                      Najbolji rezultat: {Math.round(lessonProgress.best_quiz_percentage)}%
                    </div>
                  ) : null
                })()}
              </div>

            {/* Lesson completed status */}
            {lessonProgress?.quiz_passed ? (
              <div className="mt-3 p-2 bg-green-100 rounded-lg text-center">
                <span className="text-green-700 font-medium flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Lekcija {lesson.id} završena! Sljedeća lekcija je otključana.</span>
                </span>
              </div>
            ) : (
              <div className="mt-3 p-2 bg-amber-100 rounded-lg text-center">
                <span className="text-amber-700 text-sm">
                  💡 Položite kviz sa minimalno 70% da otključate sljedeću lekciju
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fadeIn">
        {/* Mobile-friendly scrollable tabs */}
        <div className="flex border-b overflow-x-auto tabs-mobile no-select">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); saveCurrentPosition() }}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'text-bosnia-blue border-b-2 border-bosnia-blue bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Resume Dialog */}
        {showResumeDialog && savedPosition && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-bosnia-blue/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-bosnia-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nastavite gdje ste stali?</h3>
                <p className="text-gray-600">
                  Pronašli smo vaš sačuvani napredak u ovoj lekciji.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Zadnja pozicija: <span className="font-medium text-bosnia-blue">
                    {savedPosition.tab === 'vocabulary' && 'Vokabular'}
                    {savedPosition.tab === 'grammar' && 'Gramatika'}
                    {savedPosition.tab === 'exercises' && `Vježbe - ${
                      savedPosition.exerciseType === 'fillBlank' ? 'Popuni prazninu' :
                      savedPosition.exerciseType === 'sentenceOrder' ? 'Složi rečenicu' :
                      savedPosition.exerciseType === 'matching' ? 'Spoji parove' :
                      savedPosition.exerciseType === 'translation' ? 'Prevedi' :
                      savedPosition.exerciseType === 'writing' ? 'Piši' : 'Vježbe'
                    }`}
                    {savedPosition.tab === 'dialogue' && 'Dijalog'}
                    {savedPosition.tab === 'culture' && 'Kultura'}
                    {savedPosition.tab === 'quiz' && 'Kviz'}
                  </span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={startFromBeginning}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Počni ispočetka
                </button>
                <button
                  onClick={resumeFromSavedPosition}
                  className="flex-1 px-4 py-3 bg-bosnia-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Nastavi
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6">
          {/* Vocabulary Tab */}
          {activeTab === 'vocabulary' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vokabular</h2>
              <p className="text-gray-600 mb-6">Kliknite na karticu da vidite prijevod i primjer</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lesson.vocabulary.map((word, index) => (
                  <div
                    key={index}
                    onClick={() => toggleCard(index)}
                    className={`cursor-pointer transition-all duration-300 ${
                      flippedCards[index] ? 'transform' : ''
                    }`}
                  >
                    <div 
                      className={`relative rounded-xl min-h-[180px] flex flex-col justify-between hover:shadow-lg transition-shadow overflow-hidden border-2 ${
                        flippedCards[index] ? 'border-green-300' : 'border-blue-200'
                      }`}
                      style={word.image_url ? {
                        backgroundImage: `url(${word.image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}
                    >
                      {/* Background overlay */}
                      <div className={`absolute inset-0 ${
                        word.image_url 
                          ? (flippedCards[index] ? 'bg-gradient-to-t from-green-900/90 via-green-800/70 to-transparent' : 'bg-gradient-to-t from-blue-900/90 via-blue-800/70 to-transparent')
                          : (flippedCards[index] ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100')
                      }`}></div>
                      
                      {!flippedCards[index] ? (
                        <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start">
                            {!word.image_url && <div className="text-4xl">{word.image_emoji}</div>}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                speak(word.bosnian)
                              }}
                              className={`p-2 rounded-full shadow-sm hover:shadow transition-all ml-auto ${
                                word.image_url 
                                  ? 'bg-white/20 hover:bg-white/40 text-white' 
                                  : 'bg-white/70 hover:bg-white text-bosnia-blue hover:text-blue-700'
                              }`}
                              title="Slušaj izgovor"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="mt-auto">
                            <div className={`text-2xl font-bold ${word.image_url ? 'text-white drop-shadow-lg' : 'text-gray-800'}`}>{word.bosnian}</div>
                            <div className={`text-sm mt-1 ${word.image_url ? 'text-white/80' : 'text-gray-500'}`}>{word.pronunciation}</div>
                          </div>
                          <div className={`text-xs mt-2 ${word.image_url ? 'text-white/70' : 'text-blue-600'}`}>Klikni za prijevod →</div>
                        </div>
                      ) : (
                        <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start">
                            <div className={`text-lg font-semibold ${word.image_url ? 'text-white drop-shadow-lg' : 'text-green-800'}`}>{word.english}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                speak(word.bosnian)
                              }}
                              className={`p-2 rounded-full shadow-sm hover:shadow transition-all ${
                                word.image_url 
                                  ? 'bg-white/20 hover:bg-white/40 text-white' 
                                  : 'bg-white/70 hover:bg-white text-green-600 hover:text-green-700'
                              }`}
                              title="Slušaj riječ"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className={`mt-2 p-2 rounded-lg ${word.image_url ? 'bg-black/30' : 'bg-white/50'}`}>
                            <div className="flex justify-between items-start gap-2">
                              <div className={`text-sm italic ${word.image_url ? 'text-white' : 'text-gray-700'}`}>"{word.example}"</div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  speak(word.example)
                                }}
                                className={`p-1.5 rounded-full shadow-sm hover:shadow transition-all flex-shrink-0 ${
                                  word.image_url 
                                    ? 'bg-white/20 hover:bg-white/40 text-white' 
                                    : 'bg-white/70 hover:bg-white text-green-600 hover:text-green-700'
                                }`}
                                title="Slušaj rečenicu"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className={`text-xs mt-1 ${word.image_url ? 'text-white/80' : 'text-gray-500'}`}>{word.example_translation}</div>
                          </div>
                          <div className={`text-xs mt-2 ${word.image_url ? 'text-white/70' : 'text-green-600'}`}>← Klikni za bosanski</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Tab */}
          {activeTab === 'grammar' && (
            <div className="animate-fadeIn markdown-content">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gramatika</h2>
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.grammar_explanation}
                </ReactMarkdown>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-blue-700">💡 Želite vježbati? Posjetite tab <strong>"Vježbajmo"</strong> za interaktivne vježbe!</p>
              </div>
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === 'exercises' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Dumbbell className="w-6 h-6" />
                <span>Vježbajmo gramatiku!</span>
              </h2>
              
              {/* Exercise type selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {exerciseTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setActiveExerciseType(type.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      activeExerciseType === type.id
                        ? 'bg-bosnia-blue text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Fill in the Blank Exercises */}
              {activeExerciseType === 'fillBlank' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">✏️ Popuni prazninu - {lesson?.title || 'Vježba'}</h3>
                    <button
                      onClick={() => setShowFillBlankTranslation(!showFillBlankTranslation)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        showFillBlankTranslation 
                          ? 'bg-bosnia-blue text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {showFillBlankTranslation ? '🌍 Sakrij prijevod' : '🌍 Prikaži prijevod'}
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">Odaberi tačan odgovor za svaku rečenicu</p>

                  <div className="space-y-4">
                    {grammarExercisesList.map((exercise) => {
                      const userAnswer = grammarExercises.answers[exercise.id]
                      const isCorrect = userAnswer === exercise.answer
                      const showResult = grammarExercises.showResults

                      return (
                        <div
                          key={exercise.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            showResult && userAnswer
                              ? isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {/* Sentence with blank */}
                          <div className="flex items-center space-x-2 text-lg mb-3">
                            <span className="bg-bosnia-blue text-white px-2 py-1 rounded text-sm font-bold">#{exercise.id}</span>
                            <span className="font-medium">
                              {exercise.sentence.split('_____')[0]}
                              <span className={`inline-block min-w-[80px] mx-1 px-3 py-1 rounded-lg border-2 text-center ${
                                userAnswer
                                  ? showResult
                                    ? isCorrect ? 'bg-green-100 border-green-400 text-green-700 font-bold' : 'bg-red-100 border-red-400 text-red-700 font-bold'
                                    : 'bg-blue-100 border-blue-400 text-blue-700 font-bold'
                                  : 'bg-gray-100 border-dashed border-gray-300 text-gray-400'
                              }`}>
                                {userAnswer || '_____'}
                              </span>
                              {exercise.sentence.split('_____')[1]}
                            </span>
                          </div>
                          
                          {/* Options */}
                          <div className="flex flex-wrap gap-2">
                            {exercise.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => !showResult && handleGrammarAnswer(exercise.id, option)}
                                disabled={showResult}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                  showResult
                                    ? option === exercise.answer
                                      ? 'bg-green-500 text-white'
                                      : userAnswer === option
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                    : userAnswer === option
                                      ? 'bg-bosnia-blue text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                          
                          {/* Translation */}
                          {(userAnswer || showResult || showFillBlankTranslation) && (
                            <div className="mt-3 text-sm">
                              {showResult && userAnswer && !isCorrect && <span className="text-red-600">Tačan odgovor: <strong>{exercise.answer}</strong></span>}
                              <div className="text-gray-500 italic mt-1">🌍 {exercise.translation}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-center space-x-4 mt-6">
                    {!grammarExercises.showResults ? (
                      <button onClick={checkGrammarExercises} className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                        Provjeri ({Object.keys(grammarExercises.answers).length}/{grammarExercisesList.length})
                      </button>
                    ) : (
                      <div className="text-center">
                        <div className="mb-4 text-xl">Rezultat: <strong className="text-bosnia-blue">{getGrammarScore()}</strong> / {grammarExercisesList.length}</div>
                        <button onClick={resetGrammarExercises} className="px-6 py-3 bg-bosnia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                          <RefreshCw className="w-5 h-5" /><span>Ponovo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sentence Ordering Exercises */}
              {activeExerciseType === 'sentenceOrder' && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔀 Složi rečenicu</h3>
                  <p className="text-gray-600 mb-4">Klikni na riječi redom da složiš rečenicu</p>

                  <div className="space-y-6">
                    {sentenceOrderingList.map((exercise) => {
                      if (!wordPositions[exercise.id]) {
                        initializeSentenceExercise(exercise.id, exercise.scrambled)
                      }
                      const currentWords = wordPositions[exercise.id] || exercise.scrambled
                      const usedIndices = sentenceExercises.answers[exercise.id]?.usedIndices || []
                      const builtSentence = sentenceExercises.answers[exercise.id]?.built || []
                      const isCorrect = sentenceExercises.showResults && JSON.stringify(builtSentence) === JSON.stringify(exercise.correct)
                      const showResult = sentenceExercises.showResults

                      const handleWordClick = (word, idx) => {
                        if (showResult || usedIndices.includes(idx)) return
                        setSentenceExercises(prev => ({
                          ...prev,
                          answers: {
                            ...prev.answers,
                            [exercise.id]: {
                              usedIndices: [...usedIndices, idx],
                              built: [...builtSentence, word]
                            }
                          }
                        }))
                      }

                      const handleRemoveWord = (removeIdx) => {
                        if (showResult) return
                        const newBuilt = builtSentence.filter((_, i) => i !== removeIdx)
                        const removedWord = builtSentence[removeIdx]
                        const originalIdx = exercise.scrambled.indexOf(removedWord)
                        const newUsedIndices = usedIndices.filter(i => exercise.scrambled[i] !== removedWord || usedIndices.indexOf(i) !== usedIndices.lastIndexOf(i) ? i !== usedIndices[removeIdx] : true)
                        
                        setSentenceExercises(prev => ({
                          ...prev,
                          answers: {
                            ...prev.answers,
                            [exercise.id]: {
                              usedIndices: usedIndices.filter((_, i) => i !== removeIdx),
                              built: newBuilt
                            }
                          }
                        }))
                      }

                      return (
                        <div
                          key={exercise.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            showResult
                              ? isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {/* Header */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="bg-bosnia-blue text-white px-2 py-1 rounded-md text-sm font-bold">#{exercise.id}</span>
                            <span className="text-gray-600 font-medium">{exercise.translation}</span>
                          </div>
                          
                          {/* Two-column layout */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Left - Available words */}
                            <div>
                              <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide text-center">📦 Dostupne riječi</div>
                              <div className="bg-blue-50 rounded-xl p-3 min-h-[80px] border-2 border-dashed border-blue-200">
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {exercise.scrambled.map((word, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleWordClick(word, idx)}
                                      disabled={usedIndices.includes(idx) || showResult}
                                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                                        usedIndices.includes(idx)
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                          : 'bg-bosnia-blue text-white hover:bg-blue-700 hover:scale-105 cursor-pointer shadow-md'
                                      }`}
                                    >
                                      {word}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {/* Right - Built sentence */}
                            <div>
                              <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide text-center">📝 Tvoja rečenica</div>
                              <div className={`rounded-xl p-3 min-h-[80px] border-2 ${
                                showResult
                                  ? isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                                  : 'bg-green-50 border-dashed border-green-300'
                              }`}>
                                <div className="flex flex-wrap gap-2 justify-center min-h-[40px] items-center">
                                  {builtSentence.length === 0 ? (
                                    <span className="text-gray-400 text-sm italic">Klikni na riječi lijevo...</span>
                                  ) : (
                                    builtSentence.map((word, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => handleRemoveWord(idx)}
                                        disabled={showResult}
                                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                                          showResult
                                            ? isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            : 'bg-green-600 text-white hover:bg-red-500 cursor-pointer shadow-md'
                                        }`}
                                        title={!showResult ? "Klikni da ukloniš" : ""}
                                      >
                                        {word}
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {showResult && !isCorrect && (
                            <div className="mt-3 p-2 bg-red-100 rounded-lg text-sm text-red-700">
                              ✓ Tačan redoslijed: <strong>{exercise.correct.join(' ')}</strong>
                              <div className="text-gray-600 italic mt-1">🌍 {exercise.translation}</div>
                            </div>
                          )}
                          {showResult && isCorrect && (
                            <div className="mt-3 p-2 bg-green-100 rounded-lg text-sm text-green-700">
                              ✓ Odlično! Tačna rečenica!
                              <div className="text-gray-600 italic mt-1">🌍 {exercise.translation}</div>
                            </div>
                          )}
                          
                          {/* Show translation when sentence is complete (all words used) */}
                          {!showResult && builtSentence.length === exercise.scrambled.length && (
                            <div className="mt-3 p-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                              📝 Složena rečenica: <strong>{builtSentence.join(' ')}</strong>
                              <div className="text-gray-600 italic mt-1">🌍 {exercise.translation}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-center space-x-4 mt-6">
                    {!sentenceExercises.showResults ? (
                      <button onClick={checkSentenceExercises} className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                        Provjeri odgovore
                      </button>
                    ) : (
                      <div className="text-center">
                        <div className="mb-4 text-xl">Rezultat: <strong className="text-bosnia-blue">{getSentenceScore()}</strong> / {sentenceOrderingList.length}</div>
                        <button onClick={resetSentenceExercises} className="px-6 py-3 bg-bosnia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                          <RefreshCw className="w-5 h-5" /><span>Ponovo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Matching Exercises */}
              {activeExerciseType === 'matching' && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔗 Spoji parove</h3>
                  <p className="text-gray-600 mb-4">Kliknite na bosansku riječ, zatim na engleski prijevod</p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Bosanski</h4>
                      <div className="space-y-2">
                        {matchingList.map(item => {
                          const isMatched = matchedPairs[item.id]
                          const isSelected = selectedBosnian?.id === item.id
                          const isCorrect = matchingExercises.showResults && matchedPairs[item.id] === item.english
                          const isWrong = matchingExercises.showResults && matchedPairs[item.id] && matchedPairs[item.id] !== item.english

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleMatchClick('bosnian', item.id, item.bosnian)}
                              disabled={isMatched || matchingExercises.showResults}
                              className={`w-full p-3 rounded-lg text-left transition-all ${
                                isCorrect ? 'bg-green-100 border-2 border-green-400' :
                                isWrong ? 'bg-red-100 border-2 border-red-400' :
                                isMatched ? 'bg-gray-100 text-gray-400' :
                                isSelected ? 'bg-bosnia-blue text-white' :
                                'bg-white border-2 border-gray-200 hover:border-bosnia-blue'
                              }`}
                            >
                              {item.bosnian}
                              {isMatched && <span className="float-right text-sm">→ {matchedPairs[item.id]}</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">English</h4>
                      <div className="space-y-2">
                        {[...matchingList].sort(() => Math.random() - 0.5).map(item => {
                          const isUsed = Object.values(matchedPairs).includes(item.english)
                          return (
                            <button
                              key={item.english}
                              onClick={() => handleMatchClick('english', item.id, item.english)}
                              disabled={isUsed || !selectedBosnian || matchingExercises.showResults}
                              className={`w-full p-3 rounded-lg text-left transition-all ${
                                isUsed ? 'bg-gray-100 text-gray-400' :
                                selectedBosnian ? 'bg-white border-2 border-gray-200 hover:border-green-400 hover:bg-green-50' :
                                'bg-white border-2 border-gray-200'
                              }`}
                            >
                              {item.english}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 mt-6">
                    {!matchingExercises.showResults ? (
                      <button onClick={checkMatchingExercises} disabled={Object.keys(matchedPairs).length < matchingList.length} className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-300">
                        Provjeri ({Object.keys(matchedPairs).length}/{matchingList.length})
                      </button>
                    ) : (
                      <div className="text-center">
                        <div className="mb-4 text-xl">Rezultat: <strong className="text-bosnia-blue">{getMatchingScore()}</strong> / {matchingList.length}</div>
                        <button onClick={resetMatchingExercises} className="px-6 py-3 bg-bosnia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                          <RefreshCw className="w-5 h-5" /><span>Ponovo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Translation Exercises - Multiple Choice */}
              {activeExerciseType === 'translation' && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🌍 Prevedi na bosanski</h3>
                  <p className="text-gray-600 mb-4">Odaberite tačan prijevod engleske rečenice na bosanski</p>

                  <div className="space-y-6">
                    {translationList.map(item => {
                      const userAnswer = translationInputs[item.id]
                      const isCorrect = userAnswer === item.bosnian
                      const showResult = translationExercises.showResults
                      const hasAnswered = userAnswer !== undefined

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            showResult && hasAnswered
                              ? isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-gray-500 text-sm">#{item.id}</span>
                            <span className="font-medium text-gray-800 text-lg">{item.english}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.options.map((option, optIndex) => {
                              const isSelected = userAnswer === option
                              const isCorrectOption = option === item.bosnian
                              
                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => {
                                    if (!showResult) {
                                      const newInputs = { ...translationInputs, [item.id]: option }
                                      setTranslationInputs(newInputs)
                                      saveExerciseProgress(null, null, null, newInputs)
                                    }
                                  }}
                                  disabled={showResult}
                                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                                    showResult
                                      ? isCorrectOption
                                        ? 'bg-green-100 border-green-400 text-green-700'
                                        : isSelected
                                          ? 'bg-red-100 border-red-400 text-red-700'
                                          : 'bg-gray-50 border-gray-200 text-gray-500'
                                      : isSelected
                                        ? 'bg-bosnia-blue text-white border-bosnia-blue'
                                        : 'bg-gray-50 border-gray-200 hover:border-bosnia-blue hover:bg-blue-50'
                                  }`}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                </button>
                              )
                            })}
                          </div>
                          
                          {showResult && hasAnswered && !isCorrect && (
                            <p className="text-sm text-green-600 mt-2">✓ Tačan odgovor: <strong>{item.bosnian}</strong></p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-center space-x-4 mt-6">
                    {!translationExercises.showResults ? (
                      <button 
                        onClick={checkTranslationExercises} 
                        className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Provjeri odgovore ({Object.keys(translationInputs).length}/{translationList.length})
                      </button>
                    ) : (
                      <div className="text-center">
                        <div className="mb-4 text-xl">Rezultat: <strong className="text-bosnia-blue">{getTranslationScore()}</strong> / {translationList.length}</div>
                        <button onClick={resetTranslationExercises} className="px-6 py-3 bg-bosnia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                          <RefreshCw className="w-5 h-5" /><span>Ponovo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Writing Exercises */}
              {activeExerciseType === 'writing' && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">✍️ Piši na bosanskom - {lesson?.title || 'Vježba'}</h3>
                  <p className="text-gray-600 mb-4">Napiši prijevod i pritisni Enter za provjeru. Zvuk će se automatski pustiti.</p>

                  {/* Progress indicator */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="text-gray-600">Napredak: <strong>{getCompletedCount()}</strong> / {writingList.length}</span>
                    {getCompletedCount() > 0 && (
                      <span className="text-bosnia-blue font-medium">Prosječna ocjena: <strong>{getWritingScore()}%</strong></span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {writingList.map((exercise) => {
                      const userAnswer = writingExercises.answers[exercise.id] || ''
                      const checkedData = writingExercises.checked?.[exercise.id]
                      const isChecked = checkedData?.submitted
                      const score = checkedData?.score || 0
                      const rating = getScoreRating(score)
                      const isCurrentlyPlaying = writingExercises.currentAudioIndex === writingList.indexOf(exercise)

                      return (
                        <div
                          key={exercise.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isChecked
                              ? score === 100 ? 'bg-green-50 border-green-300' 
                                : score >= 60 ? 'bg-yellow-50 border-yellow-300' 
                                : 'bg-red-50 border-red-300'
                              : isCurrentlyPlaying ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300' : 'bg-white border-gray-200'
                          }`}
                        >
                          {/* English sentence to translate */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-sm font-bold ${isChecked ? 'bg-gray-500' : 'bg-bosnia-blue'} text-white`}>#{exercise.id}</span>
                              <span className="text-lg font-medium text-gray-800">🇬🇧 {exercise.english}</span>
                            </div>
                            {isChecked && (
                              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${score === 100 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                                <span className="text-lg">{rating.emoji}</span>
                                <span className={`font-bold ${rating.color}`}>{score}%</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Input field with submit button */}
                          <div className="flex space-x-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => handleWritingInput(exercise.id, e.target.value)}
                                onKeyPress={(e) => handleWritingKeyPress(e, exercise.id)}
                                disabled={isChecked}
                                placeholder="Napiši prijevod na bosanskom i pritisni Enter..."
                                className={`w-full px-4 py-3 rounded-lg border-2 text-lg transition-all ${
                                  isChecked
                                    ? score === 100 
                                      ? 'bg-green-100 border-green-400 text-green-700' 
                                      : score >= 60 
                                        ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                                        : 'bg-red-100 border-red-400 text-red-700'
                                    : 'border-gray-300 focus:border-bosnia-blue focus:ring-2 focus:ring-blue-200'
                                }`}
                              />
                            </div>
                            {!isChecked && (
                              <button
                                onClick={() => submitWritingSentence(exercise.id)}
                                disabled={!userAnswer.trim()}
                                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                                  userAnswer.trim() 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <CheckCircle className="w-6 h-6" />
                              </button>
                            )}
                            {isChecked && (
                              <button
                                onClick={() => speak(exercise.bosnian)}
                                className="px-4 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
                                title="Slušaj ponovo"
                              >
                                <Volume2 className="w-6 h-6" />
                              </button>
                            )}
                          </div>
                          
                          {/* Show result after checking */}
                          {isChecked && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-medium ${rating.color}`}>{rating.emoji} {rating.text}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-start space-x-2">
                                  <span className="text-gray-500 text-sm w-20">Tvoj odgovor:</span>
                                  <span className={`${score === 100 ? 'text-green-600' : 'text-gray-700'}`}>{userAnswer}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <span className="text-gray-500 text-sm w-20">Tačno:</span>
                                  <span className="text-green-600 font-medium">{exercise.bosnian}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Bottom controls */}
                  <div className="flex flex-col items-center space-y-4 mt-6">
                    {getCompletedCount() === writingList.length && (
                      <div className="text-center space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                        <div className="text-2xl font-bold text-gray-800">
                          {getWritingScore() >= 80 ? '🎉' : getWritingScore() >= 50 ? '👍' : '💪'} Završeno!
                        </div>
                        <div className="text-xl">Prosječna ocjena: <strong className="text-bosnia-blue">{getWritingScore()}%</strong></div>
                        
                        {/* Play all audio button */}
                        <button 
                          onClick={playAllWritingAudio}
                          disabled={writingExercises.isPlayingAudio}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2 ${
                            writingExercises.isPlayingAudio 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-purple-500 text-white hover:bg-purple-600'
                          }`}
                        >
                          <Volume2 className="w-5 h-5" />
                          <span>{writingExercises.isPlayingAudio ? 'Reproducira se...' : 'Slušaj sve rečenice'}</span>
                        </button>
                        
                        <button onClick={resetWritingExercises} className="px-6 py-3 bg-bosnia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                          <RefreshCw className="w-5 h-5" /><span>Vježbaj ponovo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dialogue Tab */}
          {activeTab === 'dialogue' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dijalog</h2>
              <p className="text-gray-600 mb-6">Pratite razgovor i učite iz konteksta</p>
              
              {/* Dialogue with Background Image */}
              <div 
                className="relative rounded-xl overflow-hidden p-6 min-h-[500px]"
                style={lesson.dialogue_image_url ? {
                  backgroundImage: `url(${lesson.dialogue_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {}}
              >
                {/* Dark overlay for readability */}
                {lesson.dialogue_image_url && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                )}
                
                <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                {lesson.dialogue.map((line, index) => (
                  <div
                    key={index}
                    className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} animate-slideIn`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`max-w-[80%] ${
                      index % 2 === 0 
                        ? 'bg-blue-100 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl' 
                        : 'bg-green-100 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
                    } p-4`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-700 text-sm">{line.speaker}</div>
                        <button
                          onClick={() => speak(line.text)}
                          className={`p-1.5 rounded-full transition-all ${
                            index % 2 === 0 
                              ? 'hover:bg-blue-200 text-blue-600' 
                              : 'hover:bg-green-200 text-green-600'
                          }`}
                          title="Slušaj"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-gray-800 cursor-pointer hover:text-blue-700" onClick={() => speak(line.text)}>{line.text}</div>
                      <div className="text-sm text-gray-500 mt-2 italic">{line.translation}</div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          )}

          {/* Culture Tab */}
          {activeTab === 'culture' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Kulturna bilješka</h2>
              
              {/* Culture with Background Image */}
              <div 
                className="relative rounded-xl overflow-hidden min-h-[400px]"
                style={lesson.culture_image_url ? {
                  backgroundImage: `url(${lesson.culture_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {}}
              >
                {/* Dark overlay for readability */}
                {lesson.culture_image_url && (
                  <div className="absolute inset-0 bg-black/50"></div>
                )}
                
                <div 
                  className={`relative z-10 p-6 cursor-pointer hover:bg-white/10 transition-colors rounded-xl ${!lesson.culture_image_url ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200' : ''}`}
                  onClick={() => setShowCultureTranslation(!showCultureTranslation)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">🇧🇦</div>
                    <div className="flex-1">
                      <p className={`leading-relaxed ${lesson.culture_image_url ? 'text-white font-medium' : 'text-gray-700'}`}>{lesson.cultural_note}</p>
                    
                    {showCultureTranslation && lesson.cultural_note_en && (
                      <div className={`mt-4 pt-4 border-t ${lesson.culture_image_url ? 'border-white/30' : 'border-amber-300'}`}>
                        <div className={`flex items-center space-x-2 mb-2 ${lesson.culture_image_url ? 'text-white/80' : 'text-amber-700'}`}>
                          <Globe className="w-4 h-4" />
                          <span className="font-medium text-sm">English translation:</span>
                        </div>
                        <p className={`italic ${lesson.culture_image_url ? 'text-white/90' : 'text-amber-800'}`}>{lesson.cultural_note_en}</p>
                      </div>
                    )}
                    
                    {!lesson.cultural_note_en && showCultureTranslation && (
                      <div className={`mt-4 pt-4 border-t ${lesson.culture_image_url ? 'border-white/30' : 'border-amber-300'}`}>
                        <div className={`flex items-center space-x-2 mb-2 ${lesson.culture_image_url ? 'text-white/80' : 'text-amber-700'}`}>
                          <Globe className="w-4 h-4" />
                          <span className="font-medium text-sm">English translation:</span>
                        </div>
                        <p className={`italic ${lesson.culture_image_url ? 'text-white/90' : 'text-amber-800'}`}>
                          {lesson.cultural_note.includes('Bosni i Hercegovini') 
                            ? 'In Bosnia and Herzegovina, people often greet each other with "Merhaba" (from Turkish) or "Selam" in informal situations. The "Vi" form is used for older people and in formal situations as a sign of respect.'
                            : 'Click to see the English translation of this cultural note.'}
                        </p>
                      </div>
                    )}
                    </div>
                  </div>
                  <div className={`text-center mt-4 text-sm ${lesson.culture_image_url ? 'text-white/70' : 'text-amber-600'}`}>
                    {showCultureTranslation ? '← Klikni da sakriješ prijevod' : 'Klikni za prijevod na engleski →'}
                  </div>
                </div>
              </div>

              {/* Cultural Comic Strip */}
              {lesson.cultural_comic && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">💬</span> {lesson.cultural_comic.title}
                  </h3>
                  
                  {/* Comic container with background */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    {/* Background image - generated or fallback */}
                    <div className="absolute inset-0">
                      <img 
                        src={lesson.cultural_comic.generated_image || lesson.cultural_comic.image} 
                        alt={lesson.cultural_comic.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = lesson.cultural_comic.image || 'https://images.unsplash.com/photo-1592425104520-196dedfd6277?w=800'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
                    </div>
                    
                    {/* Comic panels */}
                    <div className="relative p-4 sm:p-6 space-y-4">
                      {lesson.cultural_comic.panels.map((panel, index) => (
                        <div 
                          key={index} 
                          className={`flex ${panel.position === 'right' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] flex items-start gap-2 sm:gap-3 ${panel.position === 'right' ? 'flex-row-reverse' : ''}`}>
                            {/* Character avatar - generated or fallback */}
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                              {(panel.generated_avatar || panel.avatar) ? (
                                <img 
                                  src={panel.generated_avatar || panel.avatar} 
                                  alt={panel.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    if (panel.avatar && e.target.src !== panel.avatar) {
                                      e.target.src = panel.avatar
                                    } else {
                                      e.target.parentElement.innerHTML = `<div class="w-full h-full bg-bosnia-blue flex items-center justify-center text-white text-xl">${panel.character}</div>`
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-bosnia-blue flex items-center justify-center text-white text-xl">
                                  {panel.character}
                                </div>
                              )}
                            </div>
                            
                            {/* Speech bubble */}
                            <div className={`relative bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg ${
                              panel.position === 'right' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-bold text-sm text-bosnia-blue">{panel.name}</div>
                                <button
                                  onClick={() => speak(panel.text)}
                                  className="p-1 rounded-full hover:bg-blue-100 text-bosnia-blue transition-all"
                                  title="Slušaj"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div 
                                className="text-gray-800 font-medium text-base sm:text-lg cursor-pointer hover:text-bosnia-blue transition-colors"
                                onClick={() => speak(panel.text)}
                              >
                                {panel.text}
                              </div>
                              <div className="text-gray-500 text-xs sm:text-sm italic mt-1">{panel.translation}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Kviz</h2>
              
              {!quizState.showResult ? (
                <div className="max-w-2xl mx-auto">
                  {/* Question number indicators - clickable */}
                  <div className="mb-6">
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      {lesson.quiz.map((_, i) => {
                        const isAnswered = quizState.answers[i] !== undefined
                        const isCorrect = quizState.answers[i]?.correct
                        const isCurrent = i === quizState.currentQuestion
                        
                        return (
                          <button
                            key={i}
                            onClick={() => goToQuizQuestion(i)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                              isCurrent
                                ? 'bg-bosnia-blue text-white ring-2 ring-offset-2 ring-bosnia-blue'
                                : isAnswered
                                  ? isCorrect
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            title={`Pitanje ${i + 1}${isAnswered ? (isCorrect ? ' - Tačno' : ' - Netačno') : ''}`}
                          >
                            {i + 1}
                          </button>
                        )
                      })}
                    </div>
                    <div className="text-center text-gray-600 text-sm">
                      Pitanje {quizState.currentQuestion + 1} od {lesson.quiz.length}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 
                        className="text-lg font-medium text-gray-800 cursor-pointer hover:text-bosnia-blue transition-colors flex-1"
                        onClick={() => speak(lesson.quiz[quizState.currentQuestion].question)}
                      >
                        {lesson.quiz[quizState.currentQuestion].question}
                      </h3>
                      <button
                        onClick={() => speak(lesson.quiz[quizState.currentQuestion].question)}
                        className="p-2 rounded-full hover:bg-gray-200 text-bosnia-blue transition-all flex-shrink-0"
                        title="Slušaj pitanje"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Translation toggle */}
                    <button
                      onClick={() => setShowQuizTranslation(!showQuizTranslation)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{showQuizTranslation ? 'Sakrij prijevod' : 'Prikaži prijevod'}</span>
                    </button>
                    
                    {showQuizTranslation && lesson.quiz[quizState.currentQuestion].question_en && (
                      <p className="mt-2 text-gray-500 italic text-sm">
                        {lesson.quiz[quizState.currentQuestion].question_en}
                      </p>
                    )}
                    {showQuizTranslation && !lesson.quiz[quizState.currentQuestion].question_en && (
                      <p className="mt-2 text-gray-500 italic text-sm">
                        {lesson.quiz[quizState.currentQuestion].question.includes('Kako se kaže')
                          ? lesson.quiz[quizState.currentQuestion].question.replace('Kako se kaže', 'How do you say').replace('na bosanskom', 'in Bosnian')
                          : lesson.quiz[quizState.currentQuestion].question.includes('Šta znači')
                          ? lesson.quiz[quizState.currentQuestion].question.replace('Šta znači', 'What does ... mean')
                          : lesson.quiz[quizState.currentQuestion].question.includes('Koja je pravilna')
                          ? 'What is the correct form?'
                          : 'Translation available'}
                      </p>
                    )}
                  </div>

                  {/* Writing question type */}
                  {lesson.quiz[quizState.currentQuestion].question_type === 'writing' ? (
                    <div className="space-y-4">
                      {(() => {
                        const currentAnswer = quizState.answers[quizState.currentQuestion]
                        const showFeedback = currentAnswer !== undefined
                        
                        return (
                          <>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={quizWritingInput}
                                onChange={(e) => setQuizWritingInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !showFeedback && quizWritingInput.trim() && handleQuizWritingSubmit()}
                                disabled={showFeedback}
                                placeholder="Napiši odgovor na bosanskom..."
                                className={`flex-1 px-4 py-3 rounded-lg border-2 text-lg transition-all ${
                                  showFeedback
                                    ? currentAnswer.correct
                                      ? 'bg-green-100 border-green-400 text-green-700'
                                      : 'bg-red-100 border-red-400 text-red-700'
                                    : 'border-gray-300 focus:border-bosnia-blue focus:ring-2 focus:ring-blue-200'
                                }`}
                              />
                              {!showFeedback && (
                                <button
                                  onClick={handleQuizWritingSubmit}
                                  disabled={!quizWritingInput.trim()}
                                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                                    quizWritingInput.trim()
                                      ? 'bg-green-500 text-white hover:bg-green-600'
                                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  <CheckCircle className="w-6 h-6" />
                                </button>
                              )}
                              {showFeedback && (
                                <button
                                  onClick={() => speak(currentAnswer.correctText)}
                                  className="px-4 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
                                  title="Slušaj tačan odgovor"
                                >
                                  <Volume2 className="w-6 h-6" />
                                </button>
                              )}
                            </div>
                            
                            {showFeedback && (
                              <div className={`p-4 rounded-lg ${currentAnswer.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                                <div className="flex items-center space-x-2 mb-2">
                                  {currentAnswer.correct ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                  )}
                                  <span className={`font-medium ${currentAnswer.correct ? 'text-green-700' : 'text-red-700'}`}>
                                    {currentAnswer.correct ? 'Tačno!' : 'Netačno!'}
                                  </span>
                                </div>
                                {!currentAnswer.correct && (
                                  <div className="space-y-1 text-sm">
                                    <p className="text-gray-600">Tvoj odgovor: <span className="text-red-600">{currentAnswer.selected}</span></p>
                                    <p className="text-gray-600">Tačan odgovor: <span className="text-green-600 font-medium">{currentAnswer.correctText}</span></p>
                                  </div>
                                )}
                                <p className="text-sm mt-2 text-gray-600">
                                  {lesson.quiz[quizState.currentQuestion].explanation}
                                </p>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    /* Multiple choice questions */
                    <div className="space-y-3">
                      {lesson.quiz[quizState.currentQuestion].options.map((option, i) => {
                        const currentAnswer = quizState.answers[quizState.currentQuestion]
                        const isSelected = currentAnswer?.selected === i
                        const isCorrect = i === lesson.quiz[quizState.currentQuestion].correct_answer
                        const showFeedback = currentAnswer !== undefined

                        return (
                          <div
                            key={i}
                            className={`w-full p-4 rounded-xl text-left transition-all ${
                              showFeedback
                                ? isCorrect
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : isSelected
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-gray-100 border-2 border-transparent'
                                : 'bg-white border-2 border-gray-200 hover:border-bosnia-blue hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => !showFeedback && handleQuizAnswer(i)}
                                disabled={showFeedback}
                                className="flex-1 text-left"
                              >
                                {option}
                              </button>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    speak(option)
                                  }}
                                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-bosnia-blue transition-all"
                                  title="Slušaj"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Feedback for multiple choice questions */}
                  {lesson.quiz[quizState.currentQuestion].question_type !== 'writing' && quizState.answers[quizState.currentQuestion] && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      quizState.answers[quizState.currentQuestion].correct 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-red-50 text-red-800'
                    }`}>
                      <p className="font-medium">
                        {quizState.answers[quizState.currentQuestion].correct ? 'Tačno!' : 'Netačno!'}
                      </p>
                      <p className="text-sm mt-1">
                        {lesson.quiz[quizState.currentQuestion].explanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation buttons for quiz */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={goToPrevQuestion}
                      disabled={quizState.currentQuestion === 0}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        quizState.currentQuestion === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Prethodno</span>
                    </button>
                    
                    <span className="text-gray-500 text-sm">
                      {Object.keys(quizState.answers).length} / {lesson.quiz.length} odgovoreno
                    </span>
                    
                    <button
                      onClick={goToNextQuestion}
                      disabled={quizState.currentQuestion === lesson.quiz.length - 1}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        quizState.currentQuestion === lesson.quiz.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-bosnia-blue text-white hover:bg-blue-700'
                      }`}
                    >
                      <span>Sljedeće</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Finish quiz button - show when all questions are answered */}
                  {Object.keys(quizState.answers).length === lesson.quiz.length && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => {
                          const finalScore = Object.values(quizState.answers).filter(a => a?.correct).length
                          setQuizState(prev => ({ ...prev, showResult: true, score: finalScore }))
                          // Submit quiz result
                          if (isAuthenticated) {
                            progressApi.submitQuiz(
                              lesson.id,
                              finalScore,
                              lesson.quiz.length,
                              Object.fromEntries(Object.entries(quizState.answers).map(([i, a]) => [i, a.selected]))
                            ).then(apiResult => {
                              setQuizResult({
                                pointsEarned: apiResult.xp_earned,
                                isNewHighScore: apiResult.is_new_high_score,
                                lessonCompleted: apiResult.lesson_completed,
                                totalXp: apiResult.total_xp,
                                currentLevel: apiResult.current_level,
                                passed: apiResult.passed,
                                percentage: apiResult.percentage
                              })
                              setLessonProgress(prev => ({
                                ...prev,
                                quiz_passed: apiResult.passed,
                                best_quiz_percentage: apiResult.percentage
                              }))
                              refreshStats()
                            }).catch(err => {
                              console.error('Failed to save quiz result:', err)
                              const result = saveQuizScore(lesson.id, finalScore, lesson.quiz.length)
                              setQuizResult(result)
                            })
                          } else {
                            const result = saveQuizScore(lesson.id, finalScore, lesson.quiz.length)
                            setQuizResult(result)
                          }
                        }}
                        className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        <Trophy className="w-5 h-5" />
                        <span>Završi kviz</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-md mx-auto text-center animate-scaleIn">
                  {/* Stars display */}
                  <div className="flex justify-center space-x-2 mb-4">
                    {[1, 2, 3].map((star) => {
                      const percentage = quizResult?.alreadyPassed 
                        ? Math.round(quizResult.bestPercentage) 
                        : Math.round((quizState.score / lesson.quiz.length) * 100)
                      const filled = (star === 1 && percentage >= 50) || 
                                    (star === 2 && percentage >= 70) || 
                                    (star === 3 && percentage >= 90)
                      return (
                        <Star
                          key={star}
                          className={`w-12 h-12 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      )
                    })}
                  </div>
                  
                  {(() => {
                    const percentage = quizResult?.alreadyPassed 
                      ? quizResult.bestPercentage 
                      : (quizState.score / lesson.quiz.length) * 100
                    return (
                      <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                        percentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <span className="text-4xl">
                          {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : '📚'}
                        </span>
                      </div>
                    )
                  })()}
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {quizResult?.alreadyPassed ? 'Kviz položen!' : 'Kviz završen!'}
                  </h3>
                  
                  {quizResult?.alreadyPassed ? (
                    <p className="text-gray-600 mb-2">
                      Najbolji rezultat: <strong>{Math.round(quizResult.bestPercentage)}%</strong>
                    </p>
                  ) : (
                    <p className="text-gray-600 mb-2">
                      Vaš rezultat: <strong>{quizState.score}</strong> od <strong>{lesson.quiz.length}</strong> ({Math.round(quizState.score / lesson.quiz.length * 100)}%)
                    </p>
                  )}
                  
                  {/* Points earned */}
                  {quizResult && !quizResult.alreadyPassed && (
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">+{quizResult.pointsEarned} bodova!</span>
                      </div>
                      {quizResult.isNewHighScore && (
                        <div className="flex items-center justify-center space-x-2 text-yellow-600">
                          <Trophy className="w-5 h-5" />
                          <span className="font-medium">Novi rekord!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Already passed message */}
                  {quizResult?.alreadyPassed && (
                    <div className="mb-4 p-3 bg-green-100 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Već ste položili ovaj kviz!</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Progress info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-bosnia-blue">{progress.totalPoints}</div>
                        <div className="text-gray-500">Ukupno bodova</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{progress.completedLessons.length}/12</div>
                        <div className="text-gray-500">Lekcija</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-500">{progress.streak}🔥</div>
                        <div className="text-gray-500">Streak</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={resetQuiz}
                    className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>{quizResult?.alreadyPassed ? 'Radi ponovo' : 'Pokušaj ponovo'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {lesson.id > 1 && (
          <Link
            to={`/lesson/${lesson.id - 1}`}
            className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Prethodna lekcija</span>
          </Link>
        )}
        
        {/* Guide through tabs, then next lesson after quiz completion */}
        {activeTab === 'vocabulary' && (
          <button
            onClick={() => { setActiveTab('grammar'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Gramatiku</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'grammar' && (
          <button
            onClick={() => { setActiveTab('exercises'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Vježbe</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'exercises' && activeExerciseType === 'fillBlank' && (
          <button
            onClick={() => { setActiveExerciseType('sentenceOrder'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Složi rečenicu</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'exercises' && activeExerciseType === 'sentenceOrder' && (
          <button
            onClick={() => { setActiveExerciseType('matching'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Spoji parove</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'exercises' && activeExerciseType === 'matching' && (
          <button
            onClick={() => { setActiveExerciseType('translation'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Prevedi</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'exercises' && activeExerciseType === 'translation' && (
          <button
            onClick={() => { setActiveTab('dialogue'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Dijalog</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'dialogue' && (
          <button
            onClick={() => { setActiveTab('culture'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Kulturu</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'culture' && (
          <button
            onClick={() => { setActiveTab('quiz'); saveCurrentPosition() }}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Kviz</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'quiz' && quizState.showResult && lesson.id < 12 && (
          <Link
            to={`/lesson/${lesson.id + 1}`}
            className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Lekciju {lesson.id + 1}</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
        {activeTab === 'quiz' && !quizState.showResult && (
          <div className="ml-auto text-gray-500 text-sm italic">
            Završite kviz da biste nastavili na sljedeću lekciju
          </div>
        )}
      </div>
    </div>
  )
}

export default Lesson
