const API_URL = import.meta.env.VITE_API_URL || ''

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`)
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  }
}

export const getApiUrl = () => API_URL
