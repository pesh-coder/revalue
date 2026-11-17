function Mark({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      className="revalue-mark"
    >
      <path
        d="M37 24A13 13 0 1 1 24 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="36.4" cy="11.6" r="4.5" fill="currentColor" />
    </svg>
  )
}

export function Logo() {
  return (
    <div className="revalue-logo">
      <Mark size={56} />
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
      <Mark size={26} />
    </span>
  )
}
