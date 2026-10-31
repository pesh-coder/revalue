'use client'
import { useState } from 'react'
import { Button, useAuth } from '@payloadcms/ui'
export function Operations() {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [expired, setExpired] = useState(0)
  if (user?.role !== 'admin') return null
  async function run(cleanup = false) {
    setBusy(true)
    try {
      const r = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cleanup }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error('The operation could not be completed. Try again.')
      setExpired(
        cleanup ? 0 : data.retention.enquiries + data.retention.attempts + data.retention.updates,
      )
      setMessage(
        `${data.updates.processed} pending public refreshes processed. ${data.retention.enquiries} expired enquiries, ${data.retention.attempts} expired rate-limit records and ${data.retention.updates} old refresh records ${cleanup ? 'deleted' : 'eligible for deletion'}.`,
      )
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Connection failed. Try again.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <section aria-labelledby="operations-heading">
      <h2 id="operations-heading">Website operations</h2>
      <p>
        Refresh published pages and review records that have reached the configured retention
        period.
      </p>
      <Button type="button" disabled={busy} onClick={() => run()}>
        Refresh pages and check retention
      </Button>
      {expired > 0 && (
        <Button type="button" buttonStyle="secondary" disabled={busy} onClick={() => run(true)}>
          Delete {expired} expired records
        </Button>
      )}
      <p>
        <a href="/api/enquiries/export" download>
          Export enquiries as CSV
        </a>
      </p>
      <p role="status">{message}</p>
    </section>
  )
}
