'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type ProjectStatus =
  'Concept' | 'In development' | 'Testing' | 'Pilot' | 'Completed' | 'Published research'
export type SolutionStatus = 'Available' | 'In development' | 'Exploring'

export function StatusTag({
  status,
  animate = false,
}: {
  status: ProjectStatus | SolutionStatus
  animate?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (!animate || !ref.current || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true)
        observer.disconnect()
      }
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animate])
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex min-h-6 shrink-0 items-center gap-1.5 rounded-pill bg-clay-tint py-1 pr-2.5 pl-2 text-label-sm text-clay-text',
        entered && 'animate-tag-settle',
      )}
    >
      <span className="size-1.5 shrink-0 rounded-pill bg-clay" />
      <span className="sr-only">Status: </span>
      {status}
    </span>
  )
}
