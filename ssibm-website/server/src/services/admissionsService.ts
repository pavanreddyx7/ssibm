import { randomUUID } from 'node:crypto'
import { readDatabase, updateDatabase } from '../db/database.js'
import type { AdmissionApplication } from '../types/admissions.js'

type CreateApplicationInput = Omit<AdmissionApplication, 'id' | 'submittedAt'>

export async function createAdmissionApplication(input: CreateApplicationInput) {
  const application: AdmissionApplication = {
    id: `SSIBM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    submittedAt: new Date().toISOString(),
    ...input,
  }

  await updateDatabase((database) => ({
    ...database,
    admissions: [application, ...database.admissions],
  }))

  return {
    success: true,
    referenceId: application.id,
    recordId: randomUUID(),
    submittedAt: application.submittedAt,
  }
}

export async function listAdmissionApplications() {
  const database = await readDatabase()
  return database.admissions
}
