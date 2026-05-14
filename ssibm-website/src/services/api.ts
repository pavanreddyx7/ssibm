import axios from 'axios'
import { auth } from '../firebase'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 60000,
})

// Attach Firebase ID token for Cloud Functions / backend calls
api.interceptors.request.use(async (config) => {
  const firebaseUser = auth.currentUser
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
