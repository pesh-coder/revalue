import { ImageResponse } from 'next/og'
import { sunriseStops } from '@/components/brand-mark'

// Default image shown when a ReValue page is shared (WhatsApp, LinkedIn, X).
// Posts with their own social or cover image use that instead.
export const alt = 'ReValue: Waste has value'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const deep = '#173B2E'
const warm = '#FFFDF8'
const clay = '#B46A3C'

// The sunrise mark on a white rounded tile, so its deep-green end stays visible on the dark card.
const tileLogo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><radialGradient id="g" gradientUnits="userSpaceOnUse" cx="16" cy="52" r="52">${sunriseStops
    .map(([offset, color]) => `<stop offset="${offset}" stop-color="${color}"/>`)
    .join(
      '',
    )}</radialGradient></defs><rect width="64" height="64" rx="14" fill="#fff"/><path d="M45 32A13 13 0 1 1 32 19" fill="none" stroke="url(#g)" stroke-width="8" stroke-linecap="round"/><circle cx="44.4" cy="19.6" r="4.5" fill="url(#g)"/></svg>`,
)}`

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
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
        <img src={tileLogo} width={104} height={104} alt="" />
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
