import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  ArrowLeft, BookOpen, MessageSquare, PenTool, HelpCircle, 
  Volume2, ChevronRight, ChevronLeft, CheckCircle, XCircle,
  Lightbulb, Globe, RefreshCw, Dumbbell, Shuffle, GripVertical,
  Star, Trophy, Zap, Award
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { api } from '../api'

function Lesson() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const { progress, saveQuizScore, getStars, getAchievementInfo } = useProgress()
  const [quizResult, setQuizResult] = useState(null)
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
  }, [lessonId])

  const toggleCard = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleQuizAnswer = (answerIndex) => {
    const currentQ = lesson.quiz[quizState.currentQuestion]
    const isCorrect = answerIndex === currentQ.correct_answer
    const newScore = isCorrect ? quizState.score + 1 : quizState.score
    
    setQuizState(prev => ({
      ...prev,
      answers: [...prev.answers, { selected: answerIndex, correct: isCorrect }],
      score: newScore
    }))

    setTimeout(() => {
      if (quizState.currentQuestion < lesson.quiz.length - 1) {
        setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
      } else {
        // Quiz finished - save progress
        const finalScore = newScore
        const result = saveQuizScore(lesson.id, finalScore, lesson.quiz.length)
        setQuizResult(result)
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
    // Lesson 1: Greetings
    1: {
      fillBlank: [
        { id: 1, sentence: "_____, kako si?", answer: "Zdravo", translation: "Hello, how are you?", options: ["Zdravo", "Hvala", "Molim", "Doviđenja"] },
        { id: 2, sentence: "Dobar _____, gospodine.", answer: "dan", translation: "Good day, sir.", options: ["dan", "noć", "jutro", "veče"] },
        { id: 3, sentence: "_____ mi je.", answer: "Drago", translation: "Nice to meet you.", options: ["Drago", "Hvala", "Molim", "Zdravo"] },
        { id: 4, sentence: "Zovem _____ Amina.", answer: "se", translation: "My name is Amina.", options: ["se", "sam", "si", "je"] },
        { id: 5, sentence: "Ja _____ iz Sarajeva.", answer: "sam", translation: "I am from Sarajevo.", options: ["sam", "si", "je", "smo"] },
        { id: 6, sentence: "_____ vam puno!", answer: "Hvala", translation: "Thank you very much!", options: ["Hvala", "Molim", "Zdravo", "Dobar"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["si", "kako", "Zdravo"], correct: ["Zdravo", "kako", "si"], translation: "Hello, how are you?" },
        { id: 2, scrambled: ["dan", "Dobar", "gospodine"], correct: ["Dobar", "dan", "gospodine"], translation: "Good day, sir." },
        { id: 3, scrambled: ["mi", "Drago", "je"], correct: ["Drago", "mi", "je"], translation: "Nice to meet you." },
        { id: 4, scrambled: ["se", "Zovem", "Emir"], correct: ["Zovem", "se", "Emir"], translation: "My name is Emir." },
        { id: 5, scrambled: ["si", "Odakle", "ti"], correct: ["Odakle", "si", "ti"], translation: "Where are you from?" }
      ],
      matching: [
        { id: 1, bosnian: "Zdravo", english: "Hello" },
        { id: 2, bosnian: "Dobar dan", english: "Good day" },
        { id: 3, bosnian: "Hvala", english: "Thank you" },
        { id: 4, bosnian: "Molim", english: "Please" },
        { id: 5, bosnian: "Doviđenja", english: "Goodbye" },
        { id: 6, bosnian: "Dobro jutro", english: "Good morning" }
      ],
      translation: [
        { id: 1, english: "Hello, how are you?", bosnian: "Zdravo, kako si?", options: ["Zdravo, kako si?", "Dobar dan, hvala", "Doviđenja", "Ja sam dobro"] },
        { id: 2, english: "My name is...", bosnian: "Zovem se...", options: ["Imam godina...", "Zovem se...", "Dolazim iz...", "Živim u..."] },
        { id: 3, english: "Nice to meet you", bosnian: "Drago mi je", options: ["Hvala vam", "Drago mi je", "Izvinite", "Molim vas"] },
        { id: 4, english: "Good morning", bosnian: "Dobro jutro", options: ["Dobro veče", "Dobar dan", "Dobro jutro", "Laku noć"] }
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
    // Lesson 3: Colors
    3: {
      fillBlank: [
        { id: 1, sentence: "Nebo je _____.", answer: "plavo", translation: "The sky is blue.", options: ["plavo", "crveno", "zeleno", "žuto"] },
        { id: 2, sentence: "Trava je _____.", answer: "zelena", translation: "The grass is green.", options: ["plava", "crvena", "zelena", "bijela"] },
        { id: 3, sentence: "Sunce je _____.", answer: "žuto", translation: "The sun is yellow.", options: ["plavo", "crveno", "zeleno", "žuto"] },
        { id: 4, sentence: "_____ auto je lijep.", answer: "Crven", translation: "The red car is nice.", options: ["Crven", "Plav", "Zelen", "Bijel"] },
        { id: 5, sentence: "Snijeg je _____.", answer: "bijel", translation: "Snow is white.", options: ["crn", "bijel", "siv", "plav"] },
        { id: 6, sentence: "Noć je _____.", answer: "crna", translation: "Night is black.", options: ["bijela", "plava", "crna", "siva"] }
      ],
      sentenceOrder: [
        { id: 1, scrambled: ["plavo", "je", "Nebo"], correct: ["Nebo", "je", "plavo"], translation: "The sky is blue." },
        { id: 2, scrambled: ["zelena", "Trava", "je"], correct: ["Trava", "je", "zelena"], translation: "The grass is green." },
        { id: 3, scrambled: ["boje", "je", "Koje", "auto"], correct: ["Koje", "boje", "je", "auto"], translation: "What color is the car?" },
        { id: 4, scrambled: ["crvena", "je", "Moja", "haljina"], correct: ["Moja", "haljina", "je", "crvena"], translation: "My dress is red." },
        { id: 5, scrambled: ["boja", "Plava", "omiljena", "moja", "je"], correct: ["Plava", "je", "moja", "omiljena", "boja"], translation: "Blue is my favorite color." }
      ],
      matching: [
        { id: 1, bosnian: "Crvena", english: "Red" },
        { id: 2, bosnian: "Plava", english: "Blue" },
        { id: 3, bosnian: "Zelena", english: "Green" },
        { id: 4, bosnian: "Žuta", english: "Yellow" },
        { id: 5, bosnian: "Bijela", english: "White" },
        { id: 6, bosnian: "Crna", english: "Black" }
      ],
      translation: [
        { id: 1, english: "What color is it?", bosnian: "Koje je boje?", options: ["Koje je boje?", "Šta je ovo?", "Gdje je?", "Kako si?"] },
        { id: 2, english: "The sky is blue", bosnian: "Nebo je plavo", options: ["Nebo je zeleno", "Nebo je plavo", "Nebo je crveno", "Nebo je žuto"] },
        { id: 3, english: "I like red", bosnian: "Volim crvenu", options: ["Volim plavu", "Volim crvenu", "Volim zelenu", "Volim žutu"] },
        { id: 4, english: "The white house", bosnian: "Bijela kuća", options: ["Crvena kuća", "Plava kuća", "Bijela kuća", "Zelena kuća"] }
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

  const checkGrammarExercises = () => {
    setGrammarExercises(prev => ({ ...prev, showResults: true }))
  }

  const resetGrammarExercises = () => {
    setGrammarExercises({ answers: {}, showResults: false, draggedItem: null })
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
  }

  const resetSentenceExercises = () => {
    setWordPositions({})
    setSentenceExercises({ answers: {}, showResults: false })
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
      setMatchedPairs(prev => ({
        ...prev,
        [selectedBosnian.id]: value
      }))
      setSelectedBosnian(null)
    }
  }

  const checkMatchingExercises = () => {
    setMatchingExercises({ answers: matchedPairs, showResults: true })
  }

  const resetMatchingExercises = () => {
    setMatchedPairs({})
    setSelectedBosnian(null)
    setMatchingExercises({ answers: {}, showResults: false })
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
  }

  const resetTranslationExercises = () => {
    setTranslationInputs({})
    setTranslationExercises({ answers: {}, showResults: false })
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
                          <div className="text-4xl mb-2">{word.image_emoji}</div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{word.bosnian}</div>
                            <div className="text-sm text-gray-500 mt-1">{word.pronunciation}</div>
                          </div>
                          <div className="text-xs text-blue-600 mt-2">Klikni za prijevod →</div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-semibold text-green-800">{word.english}</div>
                          <div className="mt-2 p-2 bg-white/50 rounded-lg">
                            <div className="text-sm text-gray-700 italic">"{word.example}"</div>
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
                                onClick={() => !showResult && setGrammarExercises(prev => ({
                                  ...prev,
                                  answers: { ...prev.answers, [exercise.id]: option }
                                }))}
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
                                  onClick={() => !showResult && setTranslationInputs(prev => ({ ...prev, [item.id]: option }))}
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
                      <div className="font-semibold text-gray-700 text-sm mb-1">{line.speaker}</div>
                      <div className="text-gray-800">{line.text}</div>
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
                              <div className="font-bold text-sm text-bosnia-blue mb-1">{panel.name}</div>
                              <div className="text-gray-800 font-medium text-base sm:text-lg">{panel.text}</div>
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
                    <h3 className="text-lg font-medium text-gray-800">
                      {lesson.quiz[quizState.currentQuestion].question}
                    </h3>
                    
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
                        <button
                          key={i}
                          onClick={() => !showFeedback && handleQuizAnswer(i)}
                          disabled={showFeedback}
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
                            <span>{option}</span>
                            {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                          </div>
                        </button>
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
                      const percentage = Math.round((quizState.score / lesson.quiz.length) * 100)
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
                  
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                    quizState.score >= lesson.quiz.length * 0.7 ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <span className="text-4xl">
                      {quizState.score >= lesson.quiz.length * 0.9 ? '🏆' : quizState.score >= lesson.quiz.length * 0.7 ? '🎉' : '📚'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Kviz završen!</h3>
                  <p className="text-gray-600 mb-2">
                    Vaš rezultat: <strong>{quizState.score}</strong> od <strong>{lesson.quiz.length}</strong> ({Math.round(quizState.score / lesson.quiz.length * 100)}%)
                  </p>
                  
                  {/* Points earned */}
                  {quizResult && (
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
                    <span>Pokušaj ponovo</span>
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
