import { addDoc, collection } from 'firebase/firestore'
import { api } from './api'
import { db } from '../firebase'
import type { AdmissionFormData } from '../types/admissions'

export async function submitAdmissionApplication(payload: AdmissionFormData) {
  const response = await api.post<{
    success: boolean
    referenceId: string
    recordId: string
    submittedAt: string
  }>('/admissions/apply', payload)

  await addDoc(collection(db, 'applications'), {
    applicantName: payload.applicantName,
    email: payload.email,
    phone: payload.phone,
    course: payload.course.toUpperCase(),
    dateOfBirth: payload.dateOfBirth,
    city: payload.city,
    state: payload.state,
    address: `${payload.city}, ${payload.state}`,
    previousQualification: payload.previousQualification,
    percentage: Number(payload.percentage),
    documentsConfirmed: payload.documentsConfirmed,
    consentToContact: payload.consentToContact,
    referenceId: response.data.referenceId,
    status: 'pending',
    reviewNotes: '',
    submittedAt: response.data.submittedAt,
    updatedAt: response.data.submittedAt,
  })

  return response
}
