import type { CourseCode } from './content'

export type AdmissionFormData = {
  course: CourseCode | ''
  applicantName: string
  email: string
  phone: string
  dateOfBirth: string
  previousQualification: string
  percentage: string
  city: string
  state: string
  documentsConfirmed: boolean
  consentToContact: boolean
}

export type AdmissionStepKey = 'program' | 'profile' | 'academics' | 'review'
