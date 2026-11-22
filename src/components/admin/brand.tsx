import { SunriseMark } from '@/components/brand-mark'

export function Logo() {
  return (
    <div className="revalue-logo">
      <SunriseMark size={56} />
      <div>
        <p className="revalue-logo__name">ReValue</p>
        <p className="revalue-logo__tag">Website admin</p>
      </div>
    </div>
  )
}

export function Icon() {
  return (
    <span className="revalue-icon" aria-label="ReValue">
      <SunriseMark size={26} />
    </span>
  )
}
