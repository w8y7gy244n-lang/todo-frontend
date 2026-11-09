import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': '1'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (data) => api.post('/usuarios', data)
export const login = (data) => api.post('/auth/login', data)
export const getTasks = () => api.get('/tareas')
export const createTask = (data) => api.post('/tareas', data)
export const deleteTask = (id) => api.delete(`/tareas/${id}`)