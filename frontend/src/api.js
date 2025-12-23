const API_URL = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { ...getAuthHeaders() }
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'API request failed' }))
      throw new Error(error.detail || 'API request failed')
    }
    return response.json()
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'API request failed' }))
      throw new Error(error.detail || 'API request failed')
    }
    return response.json()
  },
  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'API request failed' }))
      throw new Error(error.detail || 'API request failed')
    }
    return response.json()
  }
}

export const authApi = {
  login: async (username, password) => {
    return api.post('/api/auth/login', { username, password })
  },
  register: async (username, email, password, full_name) => {
    return api.post('/api/auth/register', { username, email, password, full_name })
  },
  getMe: async () => {
    return api.get('/api/auth/me')
  },
  getStats: async () => {
    return api.get('/api/progress/stats')
  }
}

export const progressApi = {
  getLessonProgress: async (lessonId) => {
    return api.get(`/api/progress/lessons/${lessonId}`)
  },
  getAllProgress: async () => {
    return api.get('/api/progress/lessons')
  },
  updateView: async (lessonId, viewData) => {
    return api.post(`/api/progress/lessons/${lessonId}/view`, viewData)
  },
  submitQuiz: async (lessonId, score, totalQuestions, answers) => {
    return api.post('/api/progress/quiz/submit', {
      lesson_id: lessonId,
      score,
      total_questions: totalQuestions,
      answers
    })
  },
  submitExercises: async (lessonId, score, totalExercises) => {
    return api.post('/api/progress/exercises/submit', {
      lesson_id: lessonId,
      score,
      total_exercises: totalExercises
    })
  }
}

export const finalTestApi = {
  checkEligibility: async () => {
    return api.get('/api/final-test/check-eligibility')
  },
  getQuestions: async () => {
    return api.get('/api/final-test/questions')
  },
  submit: async (answers, timeTaken) => {
    return api.post('/api/final-test/submit', {
      answers,
      time_taken_seconds: timeTaken
    })
  },
  getHistory: async () => {
    return api.get('/api/final-test/history')
  }
}

export const getApiUrl = () => API_URL
