import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Levels from './pages/Levels'
import LessonList from './pages/LessonList'
import Lesson from './pages/Lesson'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/levels/:levelId" element={<LessonList />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
