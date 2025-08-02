import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3002/api', // exemple d'API publique
  timeout: 10000,
})

export default api