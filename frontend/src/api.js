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
  getLessonProgress: async (lessonId, level = 'a1') => {
    return api.get(`/api/progress/lessons/${lessonId}?level=${level}`)
  },
  getAllProgress: async (level = 'a1') => {
    return api.get(`/api/progress/lessons?level=${level}`)
  },
  checkLevelAccess: async (level) => {
    return api.get(`/api/progress/level-access/${level}`)
  },
  updateView: async (lessonId, viewData, level = 'a1') => {
    return api.post(`/api/progress/lessons/${lessonId}/view?level=${level}`, viewData)
  },
  submitQuiz: async (lessonId, score, totalQuestions, answers, level = 'a1') => {
    return api.post('/api/progress/quiz/submit', {
      lesson_id: lessonId,
      score,
      total_questions: totalQuestions,
      answers,
      level
    })
  },
  submitExercises: async (lessonId, score, totalExercises, level = 'a1') => {
    return api.post('/api/progress/exercises/submit', {
      lesson_id: lessonId,
      score,
      total_exercises: totalExercises,
      level
    })
  },
  saveProgress: async (lessonId, data, level = 'a1') => {
    return api.post(`/api/progress/lessons/${lessonId}/save-progress?level=${level}`, data)
  }
}

export const finalTestApi = {
  checkEligibility: async (level = 'a1') => {
    return api.get(`/api/final-test/check-eligibility?level=${level}`)
  },
  getQuestions: async (level = 'a1') => {
    return api.get(`/api/final-test/questions?level=${level}`)
  },
  submit: async (answers, writingAnswers, timeTaken, level = 'a1') => {
    return api.post('/api/final-test/submit', {
      answers,
      writing_answers: writingAnswers || {},
      time_taken_seconds: timeTaken,
      level
    })
  },
  getHistory: async () => {
    return api.get('/api/final-test/history')
  }
}

export const getApiUrl = () => API_URL
