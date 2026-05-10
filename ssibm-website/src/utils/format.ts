export function formatPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\s+/g, ' ').trim()
}
