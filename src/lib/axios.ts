import axios from 'axios'
import { getCookie, deleteCookie } from 'cookies-next'

const instance = axios.create({
  baseURL: '/api/proxy',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie('access-token')
      deleteCookie('user')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    if (error.response?.status === 403) {
      console.warn('Forbidden:', error.response?.data)
    }
    return Promise.reject(error)
  },
)

export default instance
