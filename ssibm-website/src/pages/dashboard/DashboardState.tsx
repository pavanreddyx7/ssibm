import { LogOut, RefreshCw } from 'lucide-react'
import { useContext, type ReactNode } from 'react'
import { AuthContext } from '../../context/AuthContext'

export function DashboardHeader({
  eyebrow,
  title,
  description,
  onRefresh,
  isLoading,
}: {
  eyebrow: string
  title: string
  description: string
  onRefresh: () => void
  isLoading?: boolean
}) {
  const { logout, user } = useContext(AuthContext)

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{description}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Signed in as <span className="font-semibold text-slate-800">{user?.name}</span>
      </p>
    </div>
  )
}

export function DashboardMetric({
  label,
  value,
  detail,
}: {
  label: string
  value: string | number
  detail: string
}) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{detail}</p>
    </article>
  )
}

export function DashboardPanel({
  title,
  eyebrow,
  children,
}: {
  title: string
  eyebrow: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function DashboardError({ message }: { message: string }) {
  return (
    <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
      {message}
    </div>
  )
}

export function DashboardEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
      {message}
    </div>
  )
}

export function DashboardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={`dashboard-skeleton-${index + 1}`} className="rounded-[1.5rem] bg-slate-100 p-5">
          <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  )
}
