import { useEffect } from 'react'

const preloaders = [
  () => import('../../pages/About.tsx'),
  () => import('../../pages/Courses.tsx'),
  () => import('../../pages/Admissions.tsx'),
  () => import('../../pages/Login.tsx'),
  () => import('../chatbot/ChatbotFab.tsx'),
]

export function RouteWarmup() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const preload of preloaders) {
        void preload()
      }
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [])

  return null
}
