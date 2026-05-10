import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'

export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles?: UserRole[]
  children: React.ReactNode
}) {
  const { isAuthenticated, isReady, user } = useContext(AuthContext)
  const location = useLocation()

  if (!isReady) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Checking session
          </p>
          <div className="mt-4 h-4 w-40 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        replace
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      />
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate replace to={getDashboardPath(user.role)} />
  }

  return <>{children}</>
}

function getDashboardPath(role: UserRole) {
  return `/dashboard/${role}`
}
