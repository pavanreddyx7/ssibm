import { CheckCircle2, ChevronLeft, ChevronRight, CircleDashed, Send } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { submitAdmissionApplication } from '../../services/admissions.ts'
import type { AdmissionFormData, AdmissionStepKey } from '../../types/admissions'
import type { CourseCode } from '../../types/content.ts'

const applicationSteps: Array<{
  key: AdmissionStepKey
  title: string
  description: string
}> = [
  {
    key: 'program',
    title: 'Choose Program',
    description: 'Select the course you want to apply for.',
  },
  {
    key: 'profile',
    title: 'Applicant Profile',
    description: 'Add your contact and personal details.',
  },
  {
    key: 'academics',
    title: 'Academic Details',
    description: 'Share qualification and score information.',
  },
  {
    key: 'review',
    title: 'Review and Consent',
    description: 'Confirm documents and contact consent.',
  },
]

const courses: Array<{
  code: CourseCode
  title: string
  duration: string
  level: string
}> = [
  { code: 'bba', title: 'BBA', duration: '3 years', level: 'Undergraduate' },
  { code: 'bcom', title: 'B.Com', duration: '3 years', level: 'Undergraduate' },
  { code: 'bca', title: 'BCA', duration: '3 years', level: 'Undergraduate' },
  { code: 'mcom', title: 'M.Com', duration: '2 years', level: 'Postgraduate' },
  { code: 'msw', title: 'MSW', duration: '2 years', level: 'Postgraduate' },
]

const initialFormData: AdmissionFormData = {
  course: '',
  applicantName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  previousQualification: '',
  percentage: '',
  city: '',
  state: '',
  documentsConfirmed: false,
  consentToContact: false,
}

export function AdmissionsApplication() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<AdmissionFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof AdmissionFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionReference, setSubmissionReference] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')

  const currentStep = applicationSteps[currentStepIndex]
  const isLastStep = currentStepIndex === applicationSteps.length - 1

  function updateField<K extends keyof AdmissionFormData>(field: K, value: AdmissionFormData[K]) {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validateStep(stepKey: AdmissionStepKey) {
    const nextErrors: Partial<Record<keyof AdmissionFormData, string>> = {}

    if (stepKey === 'program' && !formData.course) {
      nextErrors.course = 'Please choose a program.'
    }

    if (stepKey === 'profile') {
      if (!formData.applicantName.trim()) nextErrors.applicantName = 'Name is required.'
      if (!formData.email.trim()) nextErrors.email = 'Email is required.'
      if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required.'
      if (!formData.dateOfBirth.trim()) nextErrors.dateOfBirth = 'Date of birth is required.'
    }

    if (stepKey === 'academics') {
      if (!formData.previousQualification.trim()) {
        nextErrors.previousQualification = 'Qualification is required.'
      }
      if (!formData.percentage.trim()) nextErrors.percentage = 'Percentage is required.'
      if (!formData.city.trim()) nextErrors.city = 'City is required.'
      if (!formData.state.trim()) nextErrors.state = 'State is required.'
    }

    if (stepKey === 'review') {
      if (!formData.documentsConfirmed) {
        nextErrors.documentsConfirmed = 'Please confirm your documents are ready.'
      }
      if (!formData.consentToContact) {
        nextErrors.consentToContact = 'Please provide contact consent to continue.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleNext() {
    if (!validateStep(currentStep.key)) return
    setCurrentStepIndex((current) => Math.min(current + 1, applicationSteps.length - 1))
  }

  function handlePrevious() {
    setCurrentStepIndex((current) => Math.max(current - 1, 0))
  }

  async function handleSubmit() {
    if (!validateStep(currentStep.key)) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await submitAdmissionApplication(formData)
      setSubmissionReference(response.data.referenceId)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setSubmitError(String(error.response.data.message))
      } else {
        setSubmitError('Unable to submit right now. Please make sure the server is running and try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.7fr,1.3fr]">
      <article className="rounded-[2rem] bg-primary p-6 text-white shadow-xl shadow-primary/20 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
          Online Application
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold">Apply in guided steps</h2>
        <div className="mt-8 grid gap-4">
          {applicationSteps.map((step, index) => {
            const isActive = currentStepIndex === index
            const isComplete = currentStepIndex > index || submissionReference

            return (
              <div
                key={step.key}
                className={`rounded-[1.5rem] border p-4 transition ${
                  isActive
                    ? 'border-white/30 bg-white/15'
                    : 'border-white/10 bg-white/8'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isComplete ? (
                      <CheckCircle2 className="size-5 text-secondary" />
                    ) : isActive ? (
                      <CircleDashed className="size-5 text-white" />
                    ) : (
                      <div className="flex size-5 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm text-slate-100">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        {submissionReference ? (
          <div className="rounded-[1.8rem] bg-[linear-gradient(135deg,#ecfdf5_0%,#f0fdf4_50%,#eff6ff_100%)] p-8">
            <div className="flex items-center gap-3 text-accent">
              <CheckCircle2 className="size-8" />
              <p className="font-display text-2xl font-extrabold text-slate-950">
                Application received
              </p>
            </div>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Your application has been staged successfully for admissions follow-up.
              A backend endpoint can replace this mock submission without changing the UI flow.
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                Reference ID
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold text-primary">
                {submissionReference}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                  Step {currentStepIndex + 1} of {applicationSteps.length}
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950">
                  {currentStep.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{currentStep.description}</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {Math.round(((currentStepIndex + 1) / applicationSteps.length) * 100)}% complete
              </div>
            </div>

            <div className="mt-8">
              {currentStep.key === 'program' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((course) => {
                    const isSelected = formData.course === course.code

                    return (
                      <button
                        key={course.code}
                        type="button"
                        className={`rounded-[1.8rem] border p-5 text-left transition ${
                          isSelected
                            ? 'border-primary bg-primary/6 shadow-md'
                            : 'border-slate-200 bg-white hover:border-primary/30'
                        }`}
                        onClick={() => updateField('course', course.code)}
                      >
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                          {course.level}
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-extrabold text-slate-950">
                          {course.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">{course.duration}</p>
                      </button>
                    )
                  })}
                  <FieldError message={errors.course} />
                </div>
              ) : null}

              {currentStep.key === 'profile' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldInput
                    label="Full name"
                    value={formData.applicantName}
                    error={errors.applicantName}
                    onChange={(value) => updateField('applicantName', value)}
                  />
                  <FieldInput
                    label="Email address"
                    type="email"
                    value={formData.email}
                    error={errors.email}
                    onChange={(value) => updateField('email', value)}
                  />
                  <FieldInput
                    label="Phone number"
                    value={formData.phone}
                    error={errors.phone}
                    onChange={(value) => updateField('phone', value)}
                  />
                  <FieldInput
                    label="Date of birth"
                    type="date"
                    value={formData.dateOfBirth}
                    error={errors.dateOfBirth}
                    onChange={(value) => updateField('dateOfBirth', value)}
                  />
                </div>
              ) : null}

              {currentStep.key === 'academics' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldInput
                    label="Previous qualification"
                    value={formData.previousQualification}
                    error={errors.previousQualification}
                    onChange={(value) => updateField('previousQualification', value)}
                  />
                  <FieldInput
                    label="Percentage / CGPA"
                    value={formData.percentage}
                    error={errors.percentage}
                    onChange={(value) => updateField('percentage', value)}
                  />
                  <FieldInput
                    label="City"
                    value={formData.city}
                    error={errors.city}
                    onChange={(value) => updateField('city', value)}
                  />
                  <FieldInput
                    label="State"
                    value={formData.state}
                    error={errors.state}
                    onChange={(value) => updateField('state', value)}
                  />
                </div>
              ) : null}

              {currentStep.key === 'review' ? (
                <div className="grid gap-6">
                  <div className="rounded-[1.6rem] bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                      Application summary
                    </p>
                    <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                      <SummaryItem label="Program" value={formData.course || 'Not selected'} />
                      <SummaryItem label="Applicant" value={formData.applicantName || 'Not added'} />
                      <SummaryItem label="Email" value={formData.email || 'Not added'} />
                      <SummaryItem label="Phone" value={formData.phone || 'Not added'} />
                      <SummaryItem
                        label="Qualification"
                        value={formData.previousQualification || 'Not added'}
                      />
                      <SummaryItem label="Score" value={formData.percentage || 'Not added'} />
                    </div>
                  </div>

                  <CheckboxField
                    label="I confirm that I have the required documents ready for verification."
                    checked={formData.documentsConfirmed}
                    error={errors.documentsConfirmed}
                    onChange={(checked) => updateField('documentsConfirmed', checked)}
                  />
                  <CheckboxField
                    label="I consent to be contacted by SSIBM regarding admissions and counselling."
                    checked={formData.consentToContact}
                    error={errors.consentToContact}
                    onChange={(checked) => updateField('consentToContact', checked)}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
              {submitError ? (
                <div className="sm:max-w-md">
                  <p className="text-sm font-medium text-rose-600">{submitError}</p>
                </div>
              ) : (
                <div />
              )}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentStepIndex === 0 || isSubmitting}
                onClick={handlePrevious}
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <Send className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
                  onClick={() => void handleNext()}
                >
                  Continue
                  <ChevronRight className="size-4" />
                </button>
              )}
            </div>
          </>
        )}
      </article>
    </section>
  )
}

function FieldInput({
  error,
  label,
  onChange,
  type = 'text',
  value,
}: {
  error?: string
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-2xl border px-4 py-3 outline-none transition ${
          error ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white focus:border-primary'
        }`}
      />
      <FieldError message={error} />
    </label>
  )
}

function CheckboxField({
  checked,
  error,
  label,
  onChange,
}: {
  checked: boolean
  error?: string
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="grid gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 size-4"
        />
        <span className="text-sm leading-7 text-slate-700">{label}</span>
      </div>
      <FieldError message={error} />
    </label>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="text-sm font-medium text-rose-600">{message}</p>
}
