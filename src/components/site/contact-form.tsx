'use client'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import { enquiryTypes } from '@/lib/content-types'
import { validateEnquiry, type EnquiryInput, type EnquiryErrors } from '@/lib/enquiry-validation'
const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false
const initial: EnquiryInput = {
  name: '',
  organisation: '',
  email: '',
  phone: '',
  type: '',
  message: '',
  website: '',
  submissionId: '',
}
export function ContactForm({
  initialType = '',
  enabled = false,
}: {
  initialType?: string
  enabled?: boolean
}) {
  const ready = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const [values, setValues] = useState({
    ...initial,
    type: enquiryTypes.includes(initialType as (typeof enquiryTypes)[number]) ? initialType : '',
  })
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const summary = useRef<HTMLDivElement>(null)
  const confirmation = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const submissionId = useRef('')
  useEffect(() => {
    if (Object.keys(errors).length || message) summary.current?.focus()
  }, [errors, message])
  useEffect(() => {
    if (state === 'success') confirmation.current?.focus()
  }, [state])
  function update(name: keyof EnquiryInput, value: string) {
    setValues((v) => ({ ...v, [name]: value }))
    submissionId.current = ''
    if (state === 'error') {
      setState('idle')
      setMessage('')
    }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy.current) return
    const next = validateEnquiry(values)
    setErrors(next)
    if (Object.keys(next).length) {
      return
    }
    busy.current = true
    setState('sending')
    setMessage('')
    submissionId.current ||= crypto.randomUUID()
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId: submissionId.current }),
      })
      const result = await response.json()
      if (!response.ok) {
        setErrors(result.errors || {})
        setMessage(result.message || 'Something went wrong on our side. Try again, or email us.')
        setState('error')
        return
      }
      setState('success')
      setValues(initial)
    } catch {
      setMessage(
        'We could not send your message. Check your connection and try again. Your text has been kept.',
      )
      setState('error')
    } finally {
      busy.current = false
    }
  }
  const inputClass =
    'min-h-12 w-full rounded-control border border-input-border bg-surface px-3 py-3 text-body-md aria-invalid:border-2 aria-invalid:border-error'
  if (state === 'success')
    return (
      <div ref={confirmation} tabIndex={-1} className="bg-border/25 p-6" role="status">
        <h2 className="font-serif text-headline-md text-deep">
          Thanks. We have your message and will reply by email.
        </h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            submissionId.current = ''
            setState('idle')
          }}
        >
          Send another enquiry
        </Button>
      </div>
    )
  return (
    <form
      method="post"
      action="/api/contact"
      noValidate
      onSubmit={submit}
      aria-busy={state === 'sending'}
      className="flex flex-col gap-5"
    >
      {!enabled && (
        <p className="text-body-sm text-muted">
          Enquiries are not being sent from this preview yet. You can review the form without
          submitting personal information.
        </p>
      )}
      {(Object.keys(errors).length > 0 || message) && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className="border-l-4 border-error bg-border/20 p-4"
        >
          <h2 className="font-semibold text-deep">{message || 'Check the following details'}</h2>
          {Object.entries(errors).map(([key, error]) => (
            <a
              key={key}
              href={`#enquiry-${key}`}
              className="block min-h-11 py-2 text-error underline"
            >
              {error}
            </a>
          ))}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {(['name', 'organisation', 'email', 'phone'] as const).map((name) => (
          <div key={name}>
            <label htmlFor={`enquiry-${name}`} className="mb-2 block font-semibold">
              {
                {
                  name: 'Name',
                  organisation: 'Organisation',
                  email: 'Email',
                  phone: 'Phone (optional)',
                }[name]
              }
            </label>
            <input
              id={`enquiry-${name}`}
              name={name}
              value={values[name]}
              onChange={(e) => update(name, e.target.value)}
              readOnly={state === 'sending'}
              type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
              autoComplete={
                { name: 'name', organisation: 'organization', email: 'email', phone: 'tel' }[name]
              }
              required={name !== 'phone'}
              maxLength={name === 'email' ? 254 : name === 'phone' ? 40 : 120}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `error-${name}` : undefined}
              className={inputClass}
            />
            {errors[name] && (
              <p id={`error-${name}`} className="mt-2 text-body-sm text-error">
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <fieldset
        tabIndex={-1}
        id="enquiry-type"
        aria-describedby={errors.type ? 'error-type' : undefined}
        aria-invalid={Boolean(errors.type)}
      >
        <legend className="mb-3 font-semibold">What is this about?</legend>
        <div className="grid gap-1 sm:grid-cols-2">
          {enquiryTypes.map((type) => (
            <label key={type} className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="type"
                value={type}
                checked={values.type === type}
                disabled={state === 'sending'}
                onChange={() => update('type', type)}
                className="size-5 accent-forest"
                required
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
        {errors.type && (
          <p id="error-type" className="mt-2 text-body-sm text-error">
            {errors.type}
          </p>
        )}
      </fieldset>
      <div>
        <label htmlFor="enquiry-message" className="mb-2 block font-semibold">
          Message
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          required
          maxLength={5000}
          readOnly={state === 'sending'}
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'error-message' : undefined}
          className={inputClass}
        />
        {errors.message && (
          <p id="error-message" className="mt-2 text-body-sm text-error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="enquiry-website">Website</label>
        <input
          id="enquiry-website"
          name="website"
          value={values.website}
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => update('website', e.target.value)}
        />
      </div>
      <p className="text-body-sm text-muted">
        We use your details only to reply. See our{' '}
        <Link
          href="/privacy"
          className="inline-flex min-h-11 items-center text-forest underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <Button type="submit" disabled={!ready || state === 'sending'} className="self-start">
        {state === 'sending' && (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-pill border-2 border-current border-r-transparent"
          />
        )}
        {state === 'sending' ? 'Sending' : 'Send enquiry'}
      </Button>
    </form>
  )
}
