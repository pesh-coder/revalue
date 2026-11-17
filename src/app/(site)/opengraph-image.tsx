import { ImageResponse } from 'next/og'

// Default image shown when a ReValue page is shared (WhatsApp, LinkedIn, X).
// Posts with their own social or cover image use that instead.
export const alt = 'ReValue: Waste has value'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const deep = '#173B2E'
const warm = '#FFFDF8'
const clay = '#B46A3C'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 88px',
        background: deep,
        color: warm,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <svg width="96" height="96" viewBox="0 0 48 48">
          <path
            d="M37 24A13 13 0 1 1 24 11"
            fill="none"
            stroke={warm}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="36.4" cy="11.6" r="4.5" fill={warm} />
        </svg>
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -1 }}>ReValue</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>Waste has value.</div>
        <div style={{ fontSize: 32, lineHeight: 1.4, maxWidth: 900, opacity: 0.85 }}>
          Helping organisations see what they throw away, separate it better, and find out what can
          be recovered.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28 }}>
        <div style={{ width: 48, height: 4, background: clay }} />
        revalue.africa
      </div>
    </div>,
    size,
  )
}
