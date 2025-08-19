import axios from 'axios'
import { getAccessToken } from '../utils/auth'

const api = axios.create({
  baseURL: 'http://localhost:3002/api', // exemple d'API publique
  timeout: 10000,
})

api.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api