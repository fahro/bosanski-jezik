import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Levels from './pages/Levels'
import LessonList from './pages/LessonList'
import Lesson from './pages/Lesson'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FinalTest from './pages/FinalTest'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/levels/:levelId" element={<LessonList />} />
            <Route path="/lesson/:lessonId" element={<Lesson />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/final-test" element={<FinalTest />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
