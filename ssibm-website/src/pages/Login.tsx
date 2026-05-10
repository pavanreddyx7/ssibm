import { useContext, useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import type { UserRole } from '../types/auth'

const roles: UserRole[] = ['student', 'faculty', 'admin']

export function Login() {
  const { isAuthenticated, isReady, login, user } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirect = searchParams.get('redirect')

  useEffect(() => {
    const requestedRole = searchParams.get('role')
    if (requestedRole && roles.includes(requestedRole as UserRole)) {
      setSelectedRole(requestedRole as UserRole)
    }
  }, [searchParams])

  if (isReady && isAuthenticated && user) {
    return <Navigate replace to={redirect || `/dashboard/${user.role}`} />
  }

  async function handleSubmit(event: { preventDefault(): void }) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const loggedInUser = await login(email, password)
      if (loggedInUser.role !== selectedRole) {
        setError(
          `This account belongs to the "${loggedInUser.role}" role. Please switch the role tab.`,
        )
        return
      }
      window.location.href = redirect || `/dashboard/${loggedInUser.role}`
    } catch (submitError) {
      const code = (submitError as { code?: string }).code ?? ''
      const msg  = submitError instanceof Error ? submitError.message : String(submitError)

      if (code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in method → Email/Password → Enable it.')
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Wrong email or password. Make sure you created accounts on the /dev/seed page first.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Wait a few minutes and try again.')
      } else if (msg.includes('User profile not found')) {
        setError('Firebase Auth account exists but Firestore profile is missing. Re-run Step 1 on /dev/seed.')
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your internet connection.')
      } else {
        setError(`Sign-in failed: ${code || msg}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <article className="rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Secure Access
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold">
            Role-based dashboard login
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-100">
            Sign in with your SSIBM account. Students, faculty, and admin each
            have dedicated dashboards.
          </p>
          <div className="mt-6 rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Dev setup</p>
            <p className="mt-2 text-sm text-slate-200">
              First time? Go to{' '}
              <a href="/dev/seed" className="font-bold text-secondary underline">
                /dev/seed
              </a>{' '}
              → click <strong>"Create All Test Accounts"</strong> → come back and sign in.
            </p>
            <div className="mt-3 grid gap-1">
              {[
                { role: 'student', email: 'student@ssibm.ac.in', pass: 'Student@123' },
                { role: 'faculty', email: 'faculty@ssibm.ac.in', pass: 'Faculty@123' },
                { role: 'admin',   email: 'admin@ssibm.ac.in',   pass: 'Admin@123'   },
              ].map((a) => (
                <p key={a.role} className="font-mono text-xs text-slate-300">
                  <span className="w-16 inline-block capitalize text-secondary">{a.role}</span>
                  {a.email} · {a.pass}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {roles.map((role) => (
              <div
                key={role}
                className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                  {role}
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {role === 'admin' && 'Full access — manage students, faculty, and data.'}
                  {role === 'faculty' && 'Mark attendance, view assigned courses.'}
                  {role === 'student' && 'View attendance, timetable, and fees.'}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Sign In
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                  selectedRole === role
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 bg-white text-slate-700'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            {selectedRole === 'faculty' ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Faculty finance access is enabled through Firebase. After faculty login, salary
                slip and leave-balance data load from Firestore.
              </div>
            ) : null}

            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
            />

            {error ? (
              <p className="text-sm font-medium text-rose-600">{error}</p>
            ) : null}

            <button
              type="submit"
              className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : `Continue as ${selectedRole}`}
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
