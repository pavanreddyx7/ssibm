import { useContext, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export function Login() {
  const { isAuthenticated, isReady, login, user } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirect = searchParams.get('redirect')

  if (isReady && isAuthenticated && user) {
    return <Navigate replace to={redirect || `/dashboard/${user.role}`} />
  }

  async function handleSubmit(event: { preventDefault(): void }) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const loggedInUser = await login(email, password)
      window.location.href = redirect || `/dashboard/${loggedInUser.role}`
    } catch (submitError) {
      const code = (submitError as { code?: string }).code ?? ''
      const msg  = submitError instanceof Error ? submitError.message : String(submitError)

      if (code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled. Please contact the administrator.')
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Wrong email or password. Please check your credentials and try again.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a few minutes and try again.')
      } else if (msg.includes('User profile not found')) {
        setError('Account profile is missing. Please contact the administrator.')
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.')
      } else {
        setError(`Sign-in failed. Please try again or contact support.`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr,1fr]">
        <article className="rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Secure Access
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold">
            SSIBM Portal Login
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-100">
            Sign in with your SSIBM account to access your personalised dashboard.
            Students, faculty, and administrators are automatically directed to their
            respective portals after login.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { role: 'Student', desc: 'View attendance, timetable, marks, and fee details.' },
              { role: 'Faculty', desc: 'Mark attendance, manage courses, and view salary information.' },
              { role: 'Admin', desc: 'Full access — manage students, faculty, admissions, and data.' },
            ].map((item) => (
              <div key={item.role} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                  {item.role}
                </p>
                <p className="mt-1 text-sm text-slate-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Sign In
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-slate-950">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your credentials to access your dashboard.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
            />

            {error ? (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </article>
      </div>
    </section>
  )
}

function Field({
  label,
  onChange,
  type,
  value,
}: {
  label: string
  onChange: (value: string) => void
  type: string
  value: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  )
}
