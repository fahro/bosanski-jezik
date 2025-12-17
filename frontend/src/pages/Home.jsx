import { Link } from 'react-router-dom'
import { BookOpen, Users, Trophy, Sparkles, ArrowRight, Globe, MessageCircle, Brain } from 'lucide-react'

function Home() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "12 Lekcija po Nivou",
      description: "Svaki nivo sadrži 12 detaljnih lekcija sa vokabularom, gramatikom i vježbama"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Interaktivni Dijalozi",
      description: "Učite kroz realne razgovore sa prijevodom i objašnjenjima"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Kvizovi i Vježbe",
      description: "Testirajte svoje znanje kroz raznovrsne interaktivne kvizove"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Kulturne Bilješke",
      description: "Upoznajte bosansku kulturu i tradiciju kroz svaku lekciju"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-bosnia-blue to-blue-600 rounded-full mb-6 shadow-xl">
          <span className="text-5xl">🇧🇦</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Naučite <span className="text-bosnia-blue">Bosanski</span> Jezik
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Interaktivna platforma za učenje bosanskog jezika od početnika do naprednog nivoa.
          Počnite svoje putovanje danas!
        </p>
        <Link
          to="/levels"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-bosnia-blue to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          <span>Započni Učenje</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Levels Preview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-12">
        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, index) => (
          <Link
            key={level}
            to="/levels"
            className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
              level.startsWith('A') ? 'bg-green-100 text-green-600' :
              level.startsWith('B') ? 'bg-blue-100 text-blue-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <span className="font-bold">{level}</span>
            </div>
            <p className="text-sm text-gray-600">
              {level === 'A1' ? 'Početnik' :
               level === 'A2' ? 'Elementarni' :
               level === 'B1' ? 'Srednji' :
               level === 'B2' ? 'Viši srednji' :
               level === 'C1' ? 'Napredni' : 'Profesionalni'}
            </p>
          </Link>
        ))}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-bosnia-blue to-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-bosnia-blue to-blue-700 rounded-2xl p-8 text-white my-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">6</div>
            <div className="text-blue-200">Nivoa</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">72</div>
            <div className="text-blue-200">Lekcije</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Riječi</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-blue-200">Kvizova</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Spremni za učenje?</h2>
        <p className="text-gray-600 mb-6">Počnite sa A1 nivoom i napredujte korak po korak</p>
        <Link
          to="/levels/a1"
          className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          <span>Počni sa A1</span>
        </Link>
      </div>
    </div>
  )
}

export default Home
