import { useId } from 'react'

// The ReValue "sunrise" mark (source files in /brand). Shared by the website and the admin.
// `tile` puts it on a white rounded square, for dark backgrounds where the gradient's
// deep-green end would disappear.
export const sunriseStops = [
  ['0', '#123828'],
  ['0.33', '#1F6B3F'],
  ['0.67', '#5DAE3E'],
  ['1', '#E3D04A'],
] as const

export function SunriseMark({
  className,
  size,
  tile = false,
  label,
}: {
  className?: string
  size?: number
  tile?: boolean
  label?: string
}) {
  const id = `sunrise-${useId().replace(/:/g, '')}`
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={tile ? '0 0 64 64' : '0 0 48 48'}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx="8" cy="44" r="52">
          {sunriseStops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </radialGradient>
      </defs>
      {tile && <rect width="64" height="64" rx="14" fill="#FFFFFF" />}
      <g transform={tile ? 'translate(8 8)' : undefined}>
        <path
          d="M37 24A13 13 0 1 1 24 11"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="36.4" cy="11.6" r="4.5" fill={`url(#${id})`} />
      </g>
    </svg>
  )
}
