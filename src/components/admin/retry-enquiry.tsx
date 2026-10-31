'use client'
import { useState } from 'react'
import { Button, useDocumentInfo, useAuth } from '@payloadcms/ui'
export function RetryEnquiry() {
  const { id } = useDocumentInfo()
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [needsReconciliation, setNeedsReconciliation] = useState(false)
  if (!id || user?.role !== 'admin') return null
  return (
    <div>
      <Button
        type="button"
        buttonStyle="secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          try {
            if (
              needsReconciliation &&
              !window.confirm(
                'Have you checked the Resend delivery log and confirmed this notification was NOT delivered?',
              )
            )
              return
            const r = await fetch(`/api/contact/retry/${id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ confirmedUndelivered: needsReconciliation }),
            })
            const data = await r.json()
            setNeedsReconciliation(!r.ok && String(data.error).includes('provider delivery log'))
            setMessage(
              r.ok
                ? 'Notification accepted by the email provider.'
                : data.error || 'Notification could not be retried.',
            )
          } catch {
            setMessage('Connection failed. Check the notification status before retrying.')
          } finally {
            setBusy(false)
          }
        }}
      >
        {busy
          ? 'Retrying notification'
          : needsReconciliation
            ? 'Confirm undelivered and retry'
            : 'Retry notification'}
      </Button>
      <p role="status">{message}</p>
    </div>
  )
}
