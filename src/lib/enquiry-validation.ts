import { enquiryTypes } from './content-types'
export type EnquiryInput = {
  name: string
  organisation: string
  email: string
  phone: string
  type: string
  message: string
  website: string
  submissionId: string
}
export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>
export function validateEnquiry(input: Partial<EnquiryInput>): EnquiryErrors {
  const errors: EnquiryErrors = {}
  if (!input.name?.trim() || input.name.trim().length > 120) errors.name = 'Enter your name.'
  if (!input.organisation?.trim() || input.organisation.trim().length > 120)
    errors.organisation = 'Enter your organisation.'
  if (
    !input.email ||
    input.email.length > 254 ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    /[\r\n]/.test(input.email)
  )
    errors.email = 'Enter an email address like name@example.com.'
  if (input.phone && input.phone.length > 40)
    errors.phone = 'Enter a phone number with no more than 40 characters.'
  if (!enquiryTypes.includes(input.type as (typeof enquiryTypes)[number]))
    errors.type = 'Choose what this is about.'
  if (!input.message?.trim() || input.message.trim().length > 5000)
    errors.message = 'Tell us a little about your enquiry.'
  return errors
}
