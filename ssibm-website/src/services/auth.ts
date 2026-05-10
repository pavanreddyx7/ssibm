import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { AuthUser, UserRole } from '../types/auth'

export async function login(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return fetchUserProfile(credential.user.uid)
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export async function fetchUserProfile(uid: string): Promise<AuthUser> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) throw new Error('User profile not found in Firestore.')
  const data = snap.data() as { role: UserRole; name: string; email: string }
  return { id: uid, ...data }
}

export async function createUserProfile(
  uid: string,
  profile: { role: UserRole; name: string; email: string },
): Promise<void> {
  await setDoc(doc(db, 'users', uid), profile)
}

export function getLoginPath(role: UserRole) {
  return `/login?role=${role}`
}
