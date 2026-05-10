import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { fetchUserProfile, login as loginRequest, logout as logoutRequest } from '../services/auth'
import type { AuthUser } from '../types/auth'

type AuthContextValue = {
  isAuthenticated: boolean
  isReady: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
  user: AuthUser | null
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isReady: false,
  login: async () => {
    throw new Error('Auth context not initialized.')
  },
  logout: async () => undefined,
  user: null,
})

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await fetchUserProfile(firebaseUser.uid)
          setUser(profile)
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setIsReady(true)
    })
    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isReady,
      login: async (email: string, password: string) => {
        const profile = await loginRequest(email, password)
        setUser(profile)
        return profile
      },
      logout: async () => {
        await logoutRequest()
        setUser(null)
      },
      user,
    }),
    [isReady, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
