import { Outlet } from 'react-router-dom'
import { ChatbotFab } from '../chatbot/ChatbotFab.tsx'
import { Footer } from './Footer.tsx'
import { Navbar } from './Navbar.tsx'

export function SiteLayout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotFab />
    </div>
  )
}
