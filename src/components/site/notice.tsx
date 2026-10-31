import { WarningCircle, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

export function Notice({
  children,
  tone = 'warning',
}: {
  children: React.ReactNode
  tone?: 'warning' | 'error' | 'success'
}) {
  const Icon = tone === 'success' ? CheckCircle : WarningCircle
  return (
    <div
      className={cn(
        'flex gap-4 border-t-[3px] bg-surface p-6',
        tone === 'warning' && 'border-warning',
        tone === 'error' && 'border-error',
        tone === 'success' && 'border-success',
      )}
    >
      <Icon
        size={24}
        className={cn(
          'shrink-0',
          tone === 'warning' && 'text-warning',
          tone === 'error' && 'text-error',
          tone === 'success' && 'text-success',
        )}
        aria-hidden="true"
      />
      <div>{children}</div>
    </div>
  )
}
