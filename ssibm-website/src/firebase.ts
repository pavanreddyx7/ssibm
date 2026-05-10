import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyBi_yuq8ivVNjFOq5HjKPl3vFH_6AfaTJA',
  authDomain: 'aichat-bot-3932c.firebaseapp.com',
  projectId: 'aichat-bot-3932c',
  storageBucket: 'aichat-bot-3932c.firebasestorage.app',
  messagingSenderId: '835714778535',
  appId: '1:835714778535:web:1ee153bdb493bbeede6282',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
