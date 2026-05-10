import { AnimatePresence, motion } from 'framer-motion'
import { GraduationCap, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { getLoginPath } from '../../services/auth.ts'
import { LanguageSwitcher } from './LanguageSwitcher.tsx'

const navItems = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'courses', to: '/courses' },
  { key: 'faculty', to: '/faculty' },
  { key: 'events', to: '/events' },
  { key: 'admissions', to: '/admissions' },
  { key: 'contact', to: '/contact' },
] as const

const loginLinks = [
  { label: 'Student', to: getLoginPath('student') },
  { label: 'Faculty', to: getLoginPath('faculty') },
  { label: 'Admin', to: getLoginPath('admin') },
]

export function Navbar() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 shadow-lg backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <p className="font-display text-lg font-extrabold tracking-[0.2em] text-primary">
              SSIBM
            </p>
            <p className="text-xs text-slate-600">Tumakuru, Karnataka</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'
                }`
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <div className="group relative">
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              {t('nav.login')}
            </button>
            <div className="absolute right-0 top-12 hidden min-w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl group-hover:block">
              {loginLinks.map((link) => (
                <Link
                  key={link.to}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  to={link.to}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            to="/admissions"
            className="rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-secondary/30 transition hover:-translate-y-0.5"
          >
            {t('nav.applyNow')}
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          className="rounded-full border border-white/60 bg-white/80 p-3 text-slate-800 shadow-sm backdrop-blur lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/35 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="ml-auto flex h-full w-[86%] max-w-sm flex-col bg-white p-6 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.45 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-xl font-extrabold text-primary">SSIBM</p>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className="rounded-full border border-slate-200 p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-6">
                <LanguageSwitcher />
              </div>

              <nav className="mt-8 flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    className="rounded-2xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-8 grid gap-3">
                {loginLinks.map((link) => (
                  <Link
                    key={link.to}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label} Login
                  </Link>
                ))}
              </div>

              <Link
                to="/admissions"
                className="mt-auto rounded-full bg-secondary px-5 py-3 text-center text-sm font-bold text-slate-950"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.applyNow')}
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
