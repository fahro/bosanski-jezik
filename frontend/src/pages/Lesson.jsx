import { useState, useEffect } from 'react'
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
    answers: [],
    showResult: false,
    score: 0
  })
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
  const [showFillBlankTranslation, setShowFillBlankTranslation] = useState(false)

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

    // Reset all state when lesson changes
    setActiveTab('vocabulary')
    setQuizState({ currentQuestion: 0, answers: [], showResult: false, score: 0 })
    setQuizResult(null)
    setFlippedCards({})
    setShowCultureTranslation(false)
    setShowQuizTranslation(false)
    setGrammarExercises({ answers: {}, showResults: false, draggedItem: null })
    setSentenceExercises({ answers: {}, showResults: false })
    setMatchingExercises({ answers: {}, showResults: false })
    setTranslationExercises({ answers: {}, showResults: false })
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
              answers: [],
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
            const savedAnswers = Object.entries(data.saved_quiz_answers).map(([idx, ans]) => ({
              selected: ans.selected,
              correct: ans.correct
            }))
            const savedScore = savedAnswers.filter(a => a.correct).length
            setQuizState({
              currentQuestion: data.saved_quiz_position || savedAnswers.length,
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
  const saveProgressToBackend = async (quizAnswers, quizPosition, exerciseAnswers) => {
    if (!isAuthenticated) return
    try {
      await progressApi.saveProgress(lessonId, {
        quiz_answers: quizAnswers,
        quiz_position: quizPosition,
        exercise_answers: exerciseAnswers
      })
    } catch (err) {
      console.error('Error saving progress:', err)
    }
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
    const newScore = isCorrect ? quizState.score + 1 : quizState.score
    
    const newAnswers = [...quizState.answers, { selected: answerIndex, correct: isCorrect }]
    
    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: newScore
    }))

    // Save quiz progress after each answer
    const quizAnswersToSave = {}
    newAnswers.forEach((ans, idx) => {
      quizAnswersToSave[idx] = ans
    })
    saveProgressToBackend(quizAnswersToSave, quizState.currentQuestion + 1, null)

    setTimeout(async () => {
      if (quizState.currentQuestion < lesson.quiz.length - 1) {
        setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
      } else {
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
        
        setQuizState(prev => ({ ...prev, showResult: true }))
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setQuizState({ currentQuestion: 0, answers: [], showResult: false, score: 0 })
    setShowQuizTranslation(false)
    setQuizResult(null)
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
      ]
    },
    // Lesson 4: Family (Possessive pronouns - moj/moja/moje, tvoj/tvoja, njegov/njena, naš/naša)
    4: {
      fillBlank: [
        { id: 1, sentence: "_____ majka pravi pitu.", answer: "Moja", translation: "My mother makes pie.", options: ["Moj", "Moja", "Moje", "Tvoja"] },
        { id: 2, sentence: "Gdje je _____ otac?", answer: "tvoj", translation: "Where is your father?", options: ["moj", "tvoj", "njegov", "naš"] },
        { id: 3, sentence: "_____ sestra je mlađa od mene.", answer: "Njegova", translation: "His sister is younger than him.", options: ["Moja", "Tvoja", "Njegova", "Njena"] },
        { id: 4, sentence: "_____ baka živi u Zenici.", answer: "Naša", translation: "Our grandmother lives in Zenica.", options: ["Moja", "Tvoja", "Njegova", "Naša"] },
        { id: 5, sentence: "Ovo je _____ dijete.", answer: "njeno", translation: "This is her child.", options: ["moje", "tvoje", "njegovo", "njeno"] },
        { id: 6, sentence: "_____ djed čita novine.", answer: "Moj", translation: "My grandfather reads newspapers.", options: ["Moj", "Moja", "Moje", "Moji"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["pravi", "baka", "pitu", "Moja"], correct: ["Moja", "baka", "pravi", "pitu"], translation: "My grandmother makes pie." },
        { id: 2, scrambled: ["je", "sin", "Njegov", "visok"], correct: ["Njegov", "sin", "je", "visok"], translation: "His son is tall." },
        { id: 3, scrambled: ["u", "živi", "Naša", "Sarajevu", "porodica"], correct: ["Naša", "porodica", "živi", "u", "Sarajevu"], translation: "Our family lives in Sarajevo." },
        { id: 4, scrambled: ["kći", "Njena", "studentica", "je"], correct: ["Njena", "kći", "je", "studentica"], translation: "Her daughter is a student." }
      ],
      matching: [
        { id: 1, bosnian: "Moj brat", english: "My brother" },
        { id: 2, bosnian: "Tvoja sestra", english: "Your sister" },
        { id: 3, bosnian: "Njegov otac", english: "His father" },
        { id: 4, bosnian: "Njena majka", english: "Her mother" },
        { id: 5, bosnian: "Naša baka", english: "Our grandmother" },
        { id: 6, bosnian: "Njihov djed", english: "Their grandfather" }
      ],
      translation: [
        { id: 1, english: "My grandmother makes the best pie", bosnian: "Moja baka pravi najbolju pitu", options: ["Moja baka pravi najbolju pitu", "Tvoja baka pravi pitu", "Njegova majka pravi pitu", "Naša sestra pravi pitu"] },
        { id: 2, english: "His wife is a teacher", bosnian: "Njegova žena je učiteljica", options: ["Moja žena je učiteljica", "Tvoja žena je učiteljica", "Njegova žena je učiteljica", "Njena žena je učiteljica"] },
        { id: 3, english: "Our family is big", bosnian: "Naša porodica je velika", options: ["Moja porodica je velika", "Tvoja porodica je velika", "Naša porodica je velika", "Njihova porodica je velika"] }
      ]
    },
    // Lesson 5: Days of the Week (danas/sutra/jučer, u + dan, redoslijed dana)
    5: {
      fillBlank: [
        { id: 1, sentence: "_____ je petak. Sutra je subota!", answer: "Danas", translation: "Today is Friday. Tomorrow is Saturday!", options: ["Danas", "Sutra", "Jučer", "Preksutra"] },
        { id: 2, sentence: "U _____ idem na pijacu Markale.", answer: "subotu", translation: "On Saturday I go to Markale market.", options: ["ponedjeljak", "srijedu", "subotu", "nedjelju"] },
        { id: 3, sentence: "_____ sam bio kod bake.", answer: "Jučer", translation: "Yesterday I was at grandma's.", options: ["Danas", "Sutra", "Jučer", "Prekosutra"] },
        { id: 4, sentence: "Koji dan dolazi poslije utorka? _____.", answer: "Srijeda", translation: "Which day comes after Tuesday? Wednesday.", options: ["Ponedjeljak", "Srijeda", "Četvrtak", "Petak"] },
        { id: 5, sentence: "U _____ radim, a u nedjelju odmaram.", answer: "ponedjeljak", translation: "On Monday I work, and on Sunday I rest.", options: ["ponedjeljak", "subotu", "nedjelju", "petak"] },
        { id: 6, sentence: "_____ je dan prije subote.", answer: "Petak", translation: "Friday is the day before Saturday.", options: ["Četvrtak", "Petak", "Nedjelja", "Srijeda"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["dan", "je", "Koji", "danas"], correct: ["Koji", "je", "danas", "dan"], translation: "What day is it today?" },
        { id: 2, scrambled: ["je", "petak", "Danas"], correct: ["Danas", "je", "petak"], translation: "Today is Friday." },
        { id: 3, scrambled: ["subotu", "U", "pijacu", "idem", "na"], correct: ["U", "subotu", "idem", "na", "pijacu"], translation: "On Saturday I go to the market." },
        { id: 4, scrambled: ["bio", "Jučer", "sam", "kod", "bake"], correct: ["Jučer", "sam", "bio", "kod", "bake"], translation: "Yesterday I was at grandma's." },
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
      ]
    }
  }

  // Get exercises for current lesson (fallback to lesson 1 if not found)
  const currentExercises = exercisesByLesson[lesson?.id] || exercisesByLesson[1]
  const grammarExercisesList = currentExercises.fillBlank
  const sentenceOrderingList = currentExercises.sentenceOrder
  const matchingList = currentExercises.matching
  const translationList = currentExercises.translation

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
    { id: 'translation', label: 'Prevedi', icon: '🌍' }
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
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Exercises Progress */}
              <div className={`p-3 rounded-lg border-2 ${
                lessonProgress?.exercises_passed 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className={`w-5 h-5 ${lessonProgress?.exercises_passed ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${lessonProgress?.exercises_passed ? 'text-green-700' : 'text-gray-700'}`}>
                      Vježbe
                    </span>
                  </div>
                  {lessonProgress?.exercises_passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-sm text-gray-500">≥70% potrebno</span>
                  )}
                </div>
                {/* Live exercise progress bar */}
                {(() => {
                  const totalExercises = grammarExercisesList.length + sentenceOrderingList.length + matchingList.length + translationList.length
                  const currentScore = getGrammarScore() + getSentenceScore() + getMatchingScore() + getTranslationScore()
                  const currentPercentage = totalExercises > 0 ? Math.round((currentScore / totalExercises) * 100) : 0
                  const hasStarted = Object.keys(grammarExercises.answers).length > 0 || 
                                    Object.keys(sentenceExercises.answers).length > 0 || 
                                    Object.keys(matchingExercises.answers).length > 0 ||
                                    Object.keys(translationExercises.answers).length > 0
                  
                  return hasStarted && !lessonProgress?.exercises_passed ? (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Trenutni napredak</span>
                        <span className={currentPercentage >= 70 ? 'text-green-600 font-bold' : ''}>{currentPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${currentPercentage >= 70 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${currentPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{currentScore}/{totalExercises} tačno</div>
                    </div>
                  ) : lessonProgress?.best_exercise_percentage > 0 ? (
                    <div className="mt-2 text-sm text-gray-600">
                      Najbolji rezultat: {Math.round(lessonProgress.best_exercise_percentage)}%
                    </div>
                  ) : null
                })()}
              </div>

              {/* Quiz Progress */}
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
                  const answeredQuestions = quizState.answers.length
                  const correctAnswers = quizState.answers.filter(a => a.correct).length
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
              onClick={() => setActiveTab(tab.id)}
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
                    <div className={`bg-gradient-to-br ${
                      flippedCards[index] 
                        ? 'from-green-50 to-emerald-100 border-green-200' 
                        : 'from-blue-50 to-indigo-100 border-blue-200'
                    } border-2 rounded-xl p-4 min-h-[180px] flex flex-col justify-between hover:shadow-lg transition-shadow`}>
                      {!flippedCards[index] ? (
                        <>
                          <div className="flex justify-between items-start">
                            <div className="text-4xl mb-2">{word.image_emoji}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                speak(word.bosnian)
                              }}
                              className="p-2 rounded-full bg-white/70 hover:bg-white shadow-sm hover:shadow transition-all text-bosnia-blue hover:text-blue-700"
                              title="Slušaj izgovor"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{word.bosnian}</div>
                            <div className="text-sm text-gray-500 mt-1">{word.pronunciation}</div>
                          </div>
                          <div className="text-xs text-blue-600 mt-2">Klikni za prijevod →</div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div className="text-lg font-semibold text-green-800">{word.english}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                speak(word.bosnian)
                              }}
                              className="p-2 rounded-full bg-white/70 hover:bg-white shadow-sm hover:shadow transition-all text-green-600 hover:text-green-700"
                              title="Slušaj riječ"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-2 p-2 bg-white/50 rounded-lg">
                            <div className="flex justify-between items-start gap-2">
                              <div className="text-sm text-gray-700 italic">"{word.example}"</div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  speak(word.example)
                                }}
                                className="p-1.5 rounded-full bg-white/70 hover:bg-white shadow-sm hover:shadow transition-all text-green-600 hover:text-green-700 flex-shrink-0"
                                title="Slušaj rečenicu"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{word.example_translation}</div>
                          </div>
                          <div className="text-xs text-green-600 mt-2">← Klikni za bosanski</div>
                        </>
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
            </div>
          )}

          {/* Dialogue Tab */}
          {activeTab === 'dialogue' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dijalog</h2>
              <p className="text-gray-600 mb-6">Pratite razgovor i učite iz konteksta</p>
              
              <div className="space-y-4 max-w-2xl">
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
          )}

          {/* Culture Tab */}
          {activeTab === 'culture' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Kulturna bilješka</h2>
              <div 
                className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 border-2 border-amber-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setShowCultureTranslation(!showCultureTranslation)}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🇧🇦</div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">{lesson.cultural_note}</p>
                    
                    {showCultureTranslation && lesson.cultural_note_en && (
                      <div className="mt-4 pt-4 border-t border-amber-300">
                        <div className="flex items-center space-x-2 text-amber-700 mb-2">
                          <Globe className="w-4 h-4" />
                          <span className="font-medium text-sm">English translation:</span>
                        </div>
                        <p className="text-amber-800 italic">{lesson.cultural_note_en}</p>
                      </div>
                    )}
                    
                    {!lesson.cultural_note_en && showCultureTranslation && (
                      <div className="mt-4 pt-4 border-t border-amber-300">
                        <div className="flex items-center space-x-2 text-amber-700 mb-2">
                          <Globe className="w-4 h-4" />
                          <span className="font-medium text-sm">English translation:</span>
                        </div>
                        <p className="text-amber-800 italic">
                          {lesson.cultural_note.includes('Bosni i Hercegovini') 
                            ? 'In Bosnia and Herzegovina, people often greet each other with "Merhaba" (from Turkish) or "Selam" in informal situations. The "Vi" form is used for older people and in formal situations as a sign of respect.'
                            : 'Click to see the English translation of this cultural note.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center mt-4 text-sm text-amber-600">
                  {showCultureTranslation ? '← Klikni da sakriješ prijevod' : 'Klikni za prijevod na engleski →'}
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
                    {/* Background image - čaršija/kafana */}
                    <div className="absolute inset-0">
                      <img 
                        src={lesson.cultural_comic.image} 
                        alt={lesson.cultural_comic.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://images.unsplash.com/photo-1592425104520-196dedfd6277?w=800'
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
                            {/* Character avatar with fes */}
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                              {panel.avatar ? (
                                <img 
                                  src={panel.avatar} 
                                  alt={panel.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.parentElement.innerHTML = `<div class="w-full h-full bg-bosnia-blue flex items-center justify-center text-white text-xl">${panel.character}</div>`
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
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-gray-600">
                      Pitanje {quizState.currentQuestion + 1} od {lesson.quiz.length}
                    </span>
                    <div className="flex space-x-1">
                      {lesson.quiz.map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < quizState.currentQuestion
                              ? quizState.answers[i]?.correct ? 'bg-green-500' : 'bg-red-500'
                              : i === quizState.currentQuestion
                              ? 'bg-bosnia-blue'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
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

                  {quizState.answers[quizState.currentQuestion] && (
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
            onClick={() => setActiveTab('grammar')}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Gramatiku</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'grammar' && (
          <button
            onClick={() => setActiveTab('exercises')}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Vježbe</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'exercises' && (
          <button
            onClick={() => setActiveTab('dialogue')}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Dijalog</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'dialogue' && (
          <button
            onClick={() => setActiveTab('culture')}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Idite na Kulturu</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'culture' && (
          <button
            onClick={() => setActiveTab('quiz')}
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
