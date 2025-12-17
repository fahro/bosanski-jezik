import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  ArrowLeft, BookOpen, MessageSquare, PenTool, HelpCircle, 
  Volume2, ChevronRight, ChevronLeft, CheckCircle, XCircle,
  Lightbulb, Globe, RefreshCw
} from 'lucide-react'

function Lesson() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then(res => res.json())
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
    
    setQuizState(prev => ({
      ...prev,
      answers: [...prev.answers, { selected: answerIndex, correct: isCorrect }],
      score: isCorrect ? prev.score + 1 : prev.score
    }))

    setTimeout(() => {
      if (quizState.currentQuestion < lesson.quiz.length - 1) {
        setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
      } else {
        setQuizState(prev => ({ ...prev, showResult: true }))
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setQuizState({ currentQuestion: 0, answers: [], showResult: false, score: 0 })
    setShowQuizTranslation(false)
  }

  // Grammar exercises data
  const grammarExercisesList = [
    { id: 1, sentence: "Ja ___ student.", answer: "sam", translation: "I am a student." },
    { id: 2, sentence: "Ti ___ lijepa.", answer: "si", translation: "You are beautiful." },
    { id: 3, sentence: "On ___ visok.", answer: "je", translation: "He is tall." },
    { id: 4, sentence: "Ona ___ pametna.", answer: "je", translation: "She is smart." },
    { id: 5, sentence: "Mi ___ prijatelji.", answer: "smo", translation: "We are friends." },
    { id: 6, sentence: "Vi ___ dobri.", answer: "ste", translation: "You are good." },
    { id: 7, sentence: "Oni ___ sretni.", answer: "su", translation: "They are happy." },
    { id: 8, sentence: "Ja ___ iz Bosne.", answer: "sam", translation: "I am from Bosnia." },
    { id: 9, sentence: "Ti ___ moj prijatelj.", answer: "si", translation: "You are my friend." },
    { id: 10, sentence: "Ona ___ učiteljica.", answer: "je", translation: "She is a teacher." },
    { id: 11, sentence: "Mi ___ u školi.", answer: "smo", translation: "We are at school." },
    { id: 12, sentence: "Vi ___ spremni?", answer: "ste", translation: "Are you ready?" },
    { id: 13, sentence: "Oni ___ kod kuće.", answer: "su", translation: "They are at home." },
    { id: 14, sentence: "Ja ___ gladan.", answer: "sam", translation: "I am hungry." },
    { id: 15, sentence: "Ti ___ umoran.", answer: "si", translation: "You are tired." },
    { id: 16, sentence: "On ___ doktor.", answer: "je", translation: "He is a doctor." },
    { id: 17, sentence: "Mi ___ Bosanci.", answer: "smo", translation: "We are Bosnians." },
    { id: 18, sentence: "Vi ___ gosti.", answer: "ste", translation: "You are guests." },
    { id: 19, sentence: "One ___ sestre.", answer: "su", translation: "They are sisters." },
    { id: 20, sentence: "Ja ___ sretan.", answer: "sam", translation: "I am happy." }
  ]

  const verbOptions = ["sam", "si", "je", "smo", "ste", "su"]

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
    { id: 'dialogue', label: 'Dijalog', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'culture', label: 'Kultura', icon: <Globe className="w-4 h-4" /> },
    { id: 'quiz', label: 'Kviz', icon: <HelpCircle className="w-4 h-4" /> }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to={`/levels/${lesson.level}`}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-bosnia-blue mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Nazad na lekcije</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-6 animate-fadeIn">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {lesson.level.toUpperCase()}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Lekcija {lesson.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
            <p className="text-gray-600">{lesson.description}</p>
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
        <div className="flex border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-bosnia-blue border-b-2 border-bosnia-blue bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
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

              {/* Drag and Drop Exercises */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <PenTool className="w-5 h-5" />
                  <span>Vježbe: Glagol "biti" (To be)</span>
                </h3>
                <p className="text-gray-600 mb-6">Prevucite ispravan oblik glagola u prazno polje</p>

                {/* Verb options to drag */}
                <div className="flex flex-wrap gap-3 mb-6 p-4 bg-blue-50 rounded-xl">
                  <span className="text-sm text-gray-600 mr-2">Opcije:</span>
                  {verbOptions.map((verb, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => handleDragStart(verb)}
                      className="px-4 py-2 bg-bosnia-blue text-white rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-700 transition-colors font-medium shadow-md"
                    >
                      {verb}
                    </div>
                  ))}
                </div>

                {/* Exercises grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {grammarExercisesList.map((exercise) => {
                    const userAnswer = grammarExercises.answers[exercise.id]
                    const isCorrect = userAnswer === exercise.answer
                    const showResult = grammarExercises.showResults && userAnswer

                    return (
                      <div
                        key={exercise.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          showResult
                            ? isCorrect
                              ? 'bg-green-50 border-green-300'
                              : 'bg-red-50 border-red-300'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 text-lg">
                          <span className="text-gray-500 text-sm">#{exercise.id}</span>
                          <span>
                            {exercise.sentence.split('___')[0]}
                            <span
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop(exercise.id)}
                              onClick={() => !grammarExercises.showResults && setGrammarExercises(prev => ({
                                ...prev,
                                answers: { ...prev.answers, [exercise.id]: undefined }
                              }))}
                              className={`inline-block min-w-[60px] mx-1 px-3 py-1 rounded-lg border-2 border-dashed text-center cursor-pointer ${
                                userAnswer
                                  ? showResult
                                    ? isCorrect
                                      ? 'bg-green-100 border-green-400 text-green-700'
                                      : 'bg-red-100 border-red-400 text-red-700'
                                    : 'bg-blue-100 border-blue-400 text-blue-700'
                                  : 'bg-gray-100 border-gray-300 text-gray-400'
                              }`}
                            >
                              {userAnswer || '___'}
                            </span>
                            {exercise.sentence.split('___')[1]}
                          </span>
                        </div>
                        {showResult && (
                          <div className="mt-2 text-sm">
                            {!isCorrect && (
                              <span className="text-red-600">Tačan odgovor: <strong>{exercise.answer}</strong></span>
                            )}
                            <div className="text-gray-500 italic mt-1">{exercise.translation}</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Check/Reset buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                  {!grammarExercises.showResults ? (
                    <button
                      onClick={checkGrammarExercises}
                      disabled={Object.keys(grammarExercises.answers).length < grammarExercisesList.length}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Provjeri odgovore ({Object.keys(grammarExercises.answers).length}/{grammarExercisesList.length})
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4 text-xl">
                        Rezultat: <strong className="text-bosnia-blue">{getGrammarScore()}</strong> / {grammarExercisesList.length}
                        <span className="ml-2">
                          {getGrammarScore() >= 18 ? '🎉 Odlično!' : getGrammarScore() >= 14 ? '👍 Dobro!' : '📚 Vježbaj više!'}
                        </span>
                      </div>
                      <button
                        onClick={resetGrammarExercises}
                        className="px-6 py-3 bg-bosnia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>Pokušaj ponovo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                    quizState.score >= lesson.quiz.length * 0.7 ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <span className="text-4xl">
                      {quizState.score >= lesson.quiz.length * 0.7 ? '🎉' : '📚'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Kviz završen!</h3>
                  <p className="text-gray-600 mb-4">
                    Vaš rezultat: {quizState.score} od {lesson.quiz.length} ({Math.round(quizState.score / lesson.quiz.length * 100)}%)
                  </p>
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
        {lesson.id < 12 && (
          <Link
            to={`/lesson/${lesson.id + 1}`}
            className="inline-flex items-center space-x-2 bg-bosnia-blue text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow ml-auto"
          >
            <span>Sljedeća lekcija</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default Lesson
