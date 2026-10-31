'use client'
import { useState } from 'react'
export function ShareArticle() {
  const [state, setState] = useState('Share article')
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center text-body-sm font-semibold text-forest underline underline-offset-4"
      onClick={async () => {
        try {
          if (navigator.share) {
            await navigator.share({ title: document.title, url: location.href })
          } else {
            await navigator.clipboard.writeText(location.href)
            setState('Link copied')
          }
        } catch {
          setState('Use your browser to share this page')
        }
      }}
    >
      <span aria-live="polite">{state}</span>
    </button>
  )
}
