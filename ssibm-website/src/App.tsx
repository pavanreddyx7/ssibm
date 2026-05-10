import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'
import { SiteLayout } from './components/layout/SiteLayout.tsx'

const Home = lazy(() =>
  import('./pages/Home.tsx').then((module) => ({ default: module.Home })),
)
const About = lazy(() =>
  import('./pages/About.tsx').then((module) => ({ default: module.About })),
)
const Courses = lazy(() =>
  import('./pages/Courses.tsx').then((module) => ({ default: module.Courses })),
)
const Faculty = lazy(() =>
  import('./pages/Faculty.tsx').then((module) => ({ default: module.Faculty })),
)
const Events = lazy(() =>
  import('./pages/Events.tsx').then((module) => ({ default: module.Events })),
)
const Contact = lazy(() =>
  import('./pages/Contact.tsx').then((module) => ({ default: module.Contact })),
)
const Admissions = lazy(() =>
  import('./pages/Admissions.tsx').then((module) => ({ default: module.Admissions })),
)
const AdminDashboard = lazy(() =>
  import('./pages/dashboard/AdminDashboard.tsx').then((module) => ({
    default: module.AdminDashboard,
  })),
)
const Login = lazy(() =>
  import('./pages/Login.tsx').then((module) => ({ default: module.Login })),
)
const DevSeed = lazy(() =>
  import('./pages/DevSeed.tsx').then((module) => ({ default: module.DevSeed })),
)
const FacultyDashboard = lazy(() =>
  import('./pages/dashboard/FacultyDashboard.tsx').then((module) => ({
    default: module.FacultyDashboard,
  })),
)
const StudentDashboard = lazy(() =>
  import('./pages/dashboard/StudentDashboard.tsx').then((module) => ({
    default: module.StudentDashboard,
  })),
)

function App() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/dev/seed" element={<DevSeed />} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/faculty"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  )
}

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
          Loading
        </p>
        <div className="mt-4 h-4 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

export default App
